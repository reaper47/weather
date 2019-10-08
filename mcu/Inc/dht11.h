#ifndef __DHT11_H
#define __DHT11_H

#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include "stm32f3xx_hal.h"
#include "gpio_ext.h"
#include "time_ext.h"

#define DHT11_N_BITS     40
#define DHT11_N_BYTES    5
#define DHT11_Pin GPIO_PIN_5
#define DHT11_GPIO_Port GPIOC
#define IDX_BYTE_IRH 0
#define IDX_BYTE_DRH 1
#define IDX_BYTE_ITP 2
#define IDX_BYTE_DTP 3
#define IDX_BYTE_CHK 4
#define IDX_HUMIDITY 0
#define IDX_TEMP     1
#define JSON_LENGTH 100
#define SetBit(A,k)   ( A[(k/8)] |= (1 << (7-(k%8))) )
#define ClearBit(A,k) ( A[(k/8)] &= ~(1 << (7-(k%8))) )

typedef struct SamplesDHT11 {
	uint8_t station_id;
	float humidity;
	float temperature;
} SampleDHT11;

struct SamplesDHT11 DHT11_sample();
void DHT11_to_post(char *buffer, size_t len, SampleDHT11 sample, char *endpoint, char *host);
void _start_signal(void);
bool _is_response_valid(void);
void _read(uint8_t buffer[DHT11_N_BYTES]);
bool _is_read_valid(uint8_t buffer[DHT11_N_BYTES]);

#endif /* __DHT11_H */
