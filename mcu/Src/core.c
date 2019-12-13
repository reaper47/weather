#include "core.h"

uint16_t adc1_buffer[ADC1_BUFFER_LENGTH] = { 0 };

Temperature_t ds18b20_temperatures[_DS18B20_MAX_SENSORS];

char http_header[HTTP_HEADER_LENGTH] = {'\0'};
char json_dht[DHT_JSON_LENGTH] = {'\0'};
char json_fc37[FC37_JSON_LENGTH] = {'\0'};
char json_temt600[TEMT600_JSON_LENGTH] = {'\0'};
char json_ds18b20[DS18B20_JSON_LENGTH] = {'\0'};
char json_bme280[BME280_JSON_LENGTH] = {'\0'};
char json[JSON_LENGTH] = {'\0'};


void start_sensors(UART_HandleTypeDef *huart_esp8266, UART_HandleTypeDef *huart_stm32,
		           ADC_HandleTypeDef *hadc, TIM_HandleTypeDef *htim_temt, I2C_HandleTypeDef *hi2c)
{
	NetworkInfo_Update(SSID, PASSWORD, ADDRESS, PORT, TYPE);
	ESP8266_Init(huart_esp8266, huart_stm32);
	while (ESP8266_Start() != ESP_START_SUCCESS);

	DWT_Init();
	DHT_Init(1);
	DS18B20_Init(DS18B20_Resolution_12bits);
	FC37_Init();
	TEMT600_Init();
	BME280_Init(hi2c, BME280_FORCED_MODE, BME280_MONITORING_WEATHER);

	DHT_Sample();
	BME280_Sample(true);

	HAL_TIM_Base_Start(htim_temt);
	HAL_ADC_Start_DMA(hadc, (uint32_t*)adc1_buffer, ADC1_BUFFER_LENGTH);
}


void sample_and_post(char *endpoint, bool *is_conversion_completed)
{
    while (!(*is_conversion_completed)) {};
	*is_conversion_completed = false;
	_average_raw_values();

	DHT_Sample();
	DHT_ToJson_Partial(json_dht);

	TEMT600_Sample();
	TEMT600_ToJson_Partial(json_temt600);

	FC37_Sample();
	FC37_ToJson_Partial(json_fc37);

	DS18B20_Sample(ds18b20_temperatures);
	DS18B20_ToJson_Partial(json_ds18b20, ds18b20_temperatures);

	BME280_Sample(true);
	BME280_ToJson_Partial(json_bme280);

	Temperature_t average_temperature;
	average_temperature.celsius = (DHT_GetTemperature(true) + \
								   BME280_GetTemperature(true) + \
								   ds18b20_temperatures[0].celsius)/3;
	average_temperature.fahrenheit = (DHT_GetTemperature(false) + \
									  BME280_GetTemperature(false) + \
									  ds18b20_temperatures[0].fahrenheit)/3;

	// Send HTTP Header
	memset(json, 0, sizeof json);
	snprintf(json, sizeof json,
			 "{%s,%s,%s,%s,%s,\"T\":{\"C\":%.2f,\"F\":%.2f}}",
			 json_dht, json_ds18b20, json_fc37, json_temt600, json_bme280,
			 average_temperature.celsius, average_temperature.fahrenheit);

	memset(http_header, 0, sizeof http_header);
	snprintf(http_header, sizeof http_header,
			 "POST %s HTTP/1.1\r\n"
			 "Host: %s\r\n"
			 "Content-Type: application/json\r\n"
			 "Content-Length: %d\r\n"
			 "\r\n"
			 "%s\r\n"
			 "\r\n", endpoint, ESP8266_GetHost(), strlen(json), json);

	ESP8266_SendData(http_header);
}


void _average_raw_values()
{
	TEMT600_SetRawValue(_calculate_average(1, adc1_buffer));
	FC37_SetRawValue(_calculate_average(2, adc1_buffer));
}


uint16_t _calculate_average(uint8_t channel, uint16_t buffer[ADC1_BUFFER_LENGTH])
{
	uint16_t average = 0;
	for (uint8_t i = channel - 1; i < ADC1_BUFFER_LENGTH; i += NUM_ADC1_SENSORS)
		average += buffer[i];
	return average/(ADC1_BUFFER_LENGTH/NUM_ADC1_SENSORS);
}
