#include "dht11.h"


SampleDHT11 DHT11_sample()
{
	uint8_t buffer[DHT11_N_BYTES] = {0};

	_start_signal();
	if (_is_response_valid())
		_read(buffer);

	SampleDHT11 samples = {.station_id = 1, .humidity = 0, .temperature = 0};
	if (_is_read_valid(buffer)) {
		samples.humidity = buffer[IDX_BYTE_IRH] + buffer[IDX_BYTE_DRH]/100.0;
		samples.temperature = buffer[IDX_BYTE_ITP] + buffer[IDX_BYTE_DTP]/100.0;
	}
	return samples;
}


void _start_signal(void)
{
	gpio_set_output(DHT11_GPIO_Port, DHT11_Pin);
	HAL_GPIO_WritePin(DHT11_GPIO_Port, DHT11_Pin, 0);
	delay_us(18000);
	HAL_GPIO_WritePin(DHT11_GPIO_Port, DHT11_Pin, 1);
	delay_us(40);
	gpio_set_input(DHT11_GPIO_Port, DHT11_Pin);
}


bool _is_response_valid(void)
{
	bool is_checked = false;
	if (!(HAL_GPIO_ReadPin(DHT11_GPIO_Port, DHT11_Pin))) {
		delay_us(80);
		is_checked = HAL_GPIO_ReadPin (DHT11_GPIO_Port, DHT11_Pin);
		delay_us(80);
	}
	return is_checked;
}


void _read(uint8_t buffer[DHT11_N_BYTES])
{
	for (uint8_t i = 0; i < DHT11_N_BITS; i++) {
		while (!(HAL_GPIO_ReadPin (DHT11_GPIO_Port, DHT11_Pin)));
		delay_us(40);
		if (HAL_GPIO_ReadPin(DHT11_GPIO_Port, DHT11_Pin) == 0)
			ClearBit(buffer, i);
		else
			SetBit(buffer, i);
		while (HAL_GPIO_ReadPin(DHT11_GPIO_Port, DHT11_Pin));
	}
}


bool _is_read_valid(uint8_t buffer[DHT11_N_BYTES])
{
	return (buffer[IDX_BYTE_CHK] != 0 &&
		   (buffer[IDX_BYTE_IRH] + buffer[IDX_BYTE_DRH] + buffer[IDX_BYTE_ITP] + buffer[IDX_BYTE_DTP]) == buffer[IDX_BYTE_CHK]);
}


void DHT11_to_post(char *buffer, size_t len, SampleDHT11 sample, char *endpoint, char *host)
{
	char json[JSON_LENGTH] = {"\0"};
    snprintf(json, JSON_LENGTH, "{\"temperature\":%f,\"humidity\":%f,\"station_id\":%d}", sample.temperature, sample.humidity, sample.station_id);
    snprintf(buffer, len, "POST %s HTTP/1.1\r\nHost: %s\r\nContent-Type: application/json\r\nContent-Length: %d\r\n\r\n%s\r\n\r\n", endpoint, host, strlen(json), json);
}
