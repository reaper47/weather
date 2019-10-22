#ifndef __CORE_H
#define __CORE_H

#include <stdbool.h>
#include "dht.h"
#include "ds18b20.h"
#include "esp8266.h"
#include "fc37.h"
#include "temt600.h"

#define SSID      "VIDEOTRON6379"
#define PASSWORD  "XY7XY7VCW3UVV"
#define ADDRESS   "192.168.0.170"
#define PORT      8090
#define TYPE	  TCP

#define NUM_ADC1_SENSORS   2
#define ADC1_BUFFER_LENGTH NUM_ADC1_SENSORS*4

#define JSON_LENGTH DHT_JSON_LENGTH + TEMT600_JSON_LENGTH + \
					FC37_JSON_LENGTH + DS18B20_JSON_LENGTH + 10
#define HTTP_HEADER_LENGTH 1024

// Public Functions
void start_sensors(UART_HandleTypeDef *huart_esp8266, UART_HandleTypeDef *huart_stm32, ADC_HandleTypeDef *hadc, TIM_HandleTypeDef *htim_temt);
void sample_and_post(char *endpoint, bool *is_conversion_completed);

// Private Functions
void _average_raw_values();
uint16_t _calculate_average(uint8_t channel, uint16_t buffer[ADC1_BUFFER_LENGTH]);

#endif /* __CORE_H */
