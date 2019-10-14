#ifndef __ESP8266_H
#define __ESP8266_H

#include <string.h>
#include "stm32f3xx_hal.h"

#define AT                    "AT\r\n"
#define AT_RST                "AT+RST\r\n"
#define ATE0                  "ATE0\r\n"
#define AT_CIFSR              "AT+CIFSR\r\n"
#define AT_CIPMUX0            "AT+CIPMUX=0\r\n"
#define AT_CIPMODE0           "AT+CIPMODE=0\r\n"
#define AT_CIPCLOSE           "AT+CIPCLOSE\r\n"
#define AT_CIPSTATUS          "AT+CIPSTATUS\r\n"
#define AT_IS_CONNECTED       "AT+CWJAP?\r\n"
#define WIFI_UP               "Wifi connection established\r\n"
#define TCP_CONNECTION_FAILED "ERROR: TCP connection failed\r\n"

#define OK    "OK"
#define ERROR "ERROR"

#define AT_OK      0
#define AT_ERROR   1
#define AT_TIMEOUT 2
#define DATA_SENT     0
#define DATA_NOT_SENT 1
#define ESP_START_SUCCESS 0
#define ESP_START_FAILURE 1


#define ESP_MSG_START_SUCCESS "SUCCESS: ESP8266 wake up\r\n"
#define ERROR_MSG_AT          "ERROR: AT command failed on device wakeup\r\n"
#define ERROR_MSG_ATE0        "ERROR: ATE0 command failed on device wakeup\r\n"
#define ERROR_MSG_CIPMUX0     "ERROR: AT+CIPMUX=0 command failed on device wakeup\r\n"
#define ERROR_MSG_CIPMODE0    "ERROR: AT+CIPMODE=0 command failed on device wakeup\r\n"
#define ERROR_MSG_WIFI        "ERROR: Cannot connect to SSID\r\n"

#define SSID_LENGTH        20
#define PASSWORD_LENGTH    50
#define CWJAP_LENGTH       SSID_LENGTH + PASSWORD_LENGTH
#define TCP_ADDRESS_LENGTH 15
#define CIPSTART_LENGTH    TCP_ADDRESS_LENGTH + 35
#define HOST_LENGTH        20
#define MAX_ANSWER_LENGTH  250


typedef struct {
	UART_HandleTypeDef *huart_device;
	UART_HandleTypeDef *huart_external; // An external UART like FT232RL
	char ssid[SSID_LENGTH];
	char password[PASSWORD_LENGTH];
	char at_cwjap[CWJAP_LENGTH];
	char tcp_address[TCP_ADDRESS_LENGTH];
	uint16_t tcp_port;
	char at_cipstart[CIPSTART_LENGTH];
	char host[HOST_LENGTH];
	char current_rx_byte;
	uint8_t counter_total_bytes_read;
	uint8_t answer_write_point;
	char answer[MAX_ANSWER_LENGTH];
} ESP8266_HandleTypeDef;


void ESP8266_init(ESP8266_HandleTypeDef *hesp, UART_HandleTypeDef *huart_device, UART_HandleTypeDef *huart_external,
		          char *ssid, char *password, char *tcp_address, uint16_t tcp_port);
void ESP8266_update_wifi_info(ESP8266_HandleTypeDef *hesp, char *ssid, char *password);
void ESP8266_update_tcp_info(ESP8266_HandleTypeDef *hesp, char *address, uint16_t port);
uint8_t ESP8266_start(ESP8266_HandleTypeDef *hesp);
uint8_t ESP8266_send_data(ESP8266_HandleTypeDef *hesp, const char *data);
uint8_t ESP8266_send_cmd(ESP8266_HandleTypeDef *hesp, const char *cmd, const char *examcode);
uint8_t _open_tcp_port(ESP8266_HandleTypeDef *hesp);
uint8_t _check_wifi_connection(ESP8266_HandleTypeDef *hesp);
uint8_t _AT_command_error(UART_HandleTypeDef *huart, uint8_t error_val, char *message);
uint8_t _AT_check_response(ESP8266_HandleTypeDef *hesp, const char *expected_text, uint16_t delay_s);
void _answer_clear(ESP8266_HandleTypeDef *hesp);
void ESP8266_receive_answer(ESP8266_HandleTypeDef *hesp);

#endif /* __ESP8266_H */
