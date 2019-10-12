/* USER CODE BEGIN Header */
/**
  ******************************************************************************
  * @file           : main.h
  * @brief          : Header for main.c file.
  *                   This file contains the common defines of the application.
  ******************************************************************************
  * @attention
  *
  * <h2><center>&copy; Copyright (c) 2019 STMicroelectronics.
  * All rights reserved.</center></h2>
  *
  * This software component is licensed by ST under BSD 3-Clause license,
  * the "License"; You may not use this file except in compliance with the
  * License. You may obtain a copy of the License at:
  *                        opensource.org/licenses/BSD-3-Clause
  *
  ******************************************************************************
  */
/* USER CODE END Header */

/* Define to prevent recursive inclusion -------------------------------------*/
#ifndef __MAIN_H
#define __MAIN_H

#ifdef __cplusplus
extern "C" {
#endif

/* Includes ------------------------------------------------------------------*/
#include "stm32f3xx_hal.h"

/* Private includes ----------------------------------------------------------*/
/* USER CODE BEGIN Includes */
#include <string.h>
#include "dht.h"
/* USER CODE END Includes */

/* Exported types ------------------------------------------------------------*/
/* USER CODE BEGIN ET */

/* USER CODE END ET */

/* Exported constants --------------------------------------------------------*/
/* USER CODE BEGIN EC */

/* USER CODE END EC */

/* Exported macro ------------------------------------------------------------*/
/* USER CODE BEGIN EM */

/* USER CODE END EM */

/* Exported functions prototypes ---------------------------------------------*/
void Error_Handler(void);

/* USER CODE BEGIN EFP */
void sample_and_post_dht(char *endpoint);
void ESP_answer_clear();
uint8_t ESP8266_wake_up();
uint8_t ESP8266_send_cmd(const char *cmd, const char *examcode);
uint8_t ESP8266_AT_check_response(const char *expected_text, uint16_t delay_s);
uint8_t ESP8266_send_data(const char *data, const char *address, uint16_t port);
uint8_t ESP8266_start_connection(const char *cipstart);
uint8_t ESP8266_connect_wifi(const char *command);
uint8_t ESP8266_AT_command_error(uint8_t error_val, char *message);
uint8_t ESP8266_check_wifi_connection();
/* USER CODE END EFP */

/* Private defines -----------------------------------------------------------*/
#define B1_Pin GPIO_PIN_13
#define B1_GPIO_Port GPIOC
#define USART_TX_Pin GPIO_PIN_2
#define USART_TX_GPIO_Port GPIOA
#define USART_RX_Pin GPIO_PIN_3
#define USART_RX_GPIO_Port GPIOA
#define LD2_Pin GPIO_PIN_5
#define LD2_GPIO_Port GPIOA
#define DHT11_Pin GPIO_PIN_5
#define DHT11_GPIO_Port GPIOC
#define TMS_Pin GPIO_PIN_13
#define TMS_GPIO_Port GPIOA
#define TCK_Pin GPIO_PIN_14
#define TCK_GPIO_Port GPIOA
#define SWO_Pin GPIO_PIN_3
#define SWO_GPIO_Port GPIOB
/* USER CODE BEGIN Private defines */
#define SSID "your wifi"                <--- to update
#define PASSWORD "your wifi password"   <--- to update
#define ADDRESS "192.168.0.170"         <--- to update
#define PORT 8090                       <--- to update
#define HOST "192.168.0.170:8090"       <--- to update

#define AT "AT\r\n"
#define AT_RST "AT+RST\r\n"
#define ATE0 "ATE0\r\n"
#define AT_CIFSR "AT+CIFSR\r\n"
#define AT_CIPSERVER0 "AT+CIPSERVER=0\r\n"
#define AT_CIPMUX0 "AT+CIPMUX=0\r\n"
#define AT_CIPMODE0 "AT+CIPMODE=0\r\n"
#define AT_CIPCLOSE "AT+CIPCLOSE\r\n"
#define AT_CIPSTATUS "AT+CIPSTATUS\r\n"
#define AT_CIPSTART_TCP "AT+CIPSTART=\"TCP\",\"192.168.0.170\",8090\r\n" <--- to update
#define AT_CWJAP "AT+CWJAP=\"your wifi\",\"your wifi password\"\r\n"     <--- to update
#define AT_IS_CONNECTED "AT+CWJAP?\r\n"

#define MAX_ANSWER_LENGTH 250
#define POST_LENGTH 500

#define AT_OK      0
#define AT_ERROR   1
#define AT_TIMEOUT 2

#define COUNTER_NEW_SAMPLE_GRAPH 900
#define COUNTER_NEW_SAMPLE_LIVE  11

#define DATA_SENT     0
#define DATA_NOT_SENT 1

#define ESP_WAKEUP_SUCCESS 0
#define ESP_WAKEUP_FAILURE 1
#define ESP_WAKEUP_SUCCESS_MSG "SUCCESS: ESP8266 wake up\r\n"

#define WIFI_UP "Wifi connection established\r\n"
#define TCP_CONNECTION_FAILED "ERROR: TCP connection failed\r\n"

#define ENDPOINT_NEW_SAMPLE  "/newsample"
#define ENDPOINT_LIVE_SAMPLE "/livesample"
/* USER CODE END Private defines */

#ifdef __cplusplus
}
#endif

#endif /* __MAIN_H */

/************************ (C) COPYRIGHT STMicroelectronics *****END OF FILE****/
