#include "dht.h"


void DHT_to_post(char *buffer, SampleDHT sample, char *endpoint, char *host)
{
	memset(buffer, 0, POST_LENGTH);
	char json[JSON_LENGTH] = {"\0"};
    snprintf(json, JSON_LENGTH, "{\"temperature\":%.1f,\"humidity\":%.1f,\"station_id\":%d}", sample.temperature, sample.humidity, sample.station_id);
    snprintf(buffer, POST_LENGTH, "POST %s HTTP/1.1\r\nHost: %s\r\nContent-Type: application/json\r\nContent-Length: %d\r\n\r\n%s\r\n\r\n", endpoint, host, strlen(json), json);
}


SampleDHT DHT_sample()
{
	uint8_t buffer[DHT_N_BYTES] = {0};

	_start_signal();
	if (_is_response_valid())
		_read(buffer);


	float temperature = 0.0;
	float humidity = 0.0;

	if (_is_read_valid(buffer)) {
		if (_is_DHT11(buffer)) {
			humidity = buffer[IDX_BYTE_IRH] + buffer[IDX_BYTE_DRH]/10.0;
			temperature = buffer[IDX_BYTE_ITP] + buffer[IDX_BYTE_DTP]/10.0;
		} else {
			humidity = ((buffer[IDX_BYTE_IRH] << 8) | buffer[IDX_BYTE_DRH])*0.1;
			temperature = (((buffer[IDX_BYTE_ITP] & 0x7F) << 8) | buffer[IDX_BYTE_DTP])*0.1;
			if (buffer[IDX_BYTE_ITP] & 0x80)
				temperature *= -1;
		}
	}

	SampleDHT sample = {.station_id = 1, .humidity = humidity, .temperature = temperature};
	return sample;
}


void _start_signal(void)
{
	gpio_set_output(DHT_GPIO_Port, DHT_Pin);
	HAL_GPIO_WritePin(DHT_GPIO_Port, DHT_Pin, 0);
	DWT_delay_us(18000);
	HAL_GPIO_WritePin(DHT_GPIO_Port, DHT_Pin, 1);
	DWT_delay_us(40);
	gpio_set_input(DHT_GPIO_Port, DHT_Pin);
}


bool _is_response_valid(void)
{
	bool is_checked = false;
	if (!(HAL_GPIO_ReadPin(DHT_GPIO_Port, DHT_Pin))) {
		DWT_delay_us(80);
		is_checked = HAL_GPIO_ReadPin (DHT_GPIO_Port, DHT_Pin);
		DWT_delay_us(80);
	}
	return is_checked;
}


void _read(uint8_t buffer[DHT_N_BYTES])
{
	for (uint8_t i = 0; i < DHT_N_BITS; i++) {
		while (!(HAL_GPIO_ReadPin (DHT_GPIO_Port, DHT_Pin)));
		DWT_delay_us(40);
		if (HAL_GPIO_ReadPin(DHT_GPIO_Port, DHT_Pin) == 0)
			ClearBit(buffer, i);
		else
			SetBit(buffer, i);
		while (HAL_GPIO_ReadPin(DHT_GPIO_Port, DHT_Pin));
	}
}


bool _is_read_valid(uint8_t buffer[DHT_N_BYTES])
{
	uint8_t sum = buffer[IDX_BYTE_IRH] + buffer[IDX_BYTE_DRH] + buffer[IDX_BYTE_ITP] + buffer[IDX_BYTE_DTP];
	return sum == buffer[IDX_BYTE_CHK];
}


bool _is_DHT11(uint8_t buffer[DHT_N_BYTES])
{
	return (buffer[IDX_BYTE_DRH] == 0 && buffer[IDX_BYTE_DTP] == 0);
}
