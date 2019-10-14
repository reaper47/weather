#ifndef __DHT11_H
#define __DHT11_H

#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include "stm32f3xx_hal.h"
#include "gpio_ext.h"
#include "time_ext.h"

#define DHT_Pin GPIO_PIN_5
#define DHT_GPIO_Port GPIOC
#define DHT_N_BITS     40
#define DHT_N_BYTES    5
#define IDX_BYTE_IRH 0
#define IDX_BYTE_DRH 1
#define IDX_BYTE_ITP 2
#define IDX_BYTE_DTP 3
#define IDX_BYTE_CHK 4
#define JSON_LENGTH 100
#define POST_LENGTH 500
#define SetBit(A,k)   ( A[(k/8)] |= (1 << (7-(k%8))) )
#define ClearBit(A,k) ( A[(k/8)] &= ~(1 << (7-(k%8))) )

typedef struct SamplesDHT {
	uint8_t station_id;
	float humidity;
	float temperature;
} SampleDHT;

struct SamplesDHT DHT_sample();
void DHT_to_post(char *buffer, SampleDHT sample, char *endpoint, char *host);
void _start_signal(void);
bool _is_response_valid(void);
void _read(uint8_t buffer[DHT_N_BYTES]);
bool _is_read_valid(uint8_t buffer[DHT_N_BYTES]);
bool _is_DHT11(uint8_t buffer[DHT_N_BYTES]);

#endif /* __DHT11_H */
