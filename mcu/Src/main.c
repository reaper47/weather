/* USER CODE BEGIN Header */
/**
  ******************************************************************************
  * @file           : main.c
  * @brief          : Main program body
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

/* Includes ------------------------------------------------------------------*/
#include "main.h"

/* Private includes ----------------------------------------------------------*/
/* USER CODE BEGIN Includes */

/* USER CODE END Includes */

/* Private typedef -----------------------------------------------------------*/
/* USER CODE BEGIN PTD */

/* USER CODE END PTD */

/* Private define ------------------------------------------------------------*/
/* USER CODE BEGIN PD */

/* USER CODE END PD */

/* Private macro -------------------------------------------------------------*/
/* USER CODE BEGIN PM */

/* USER CODE END PM */

/* Private variables ---------------------------------------------------------*/
TIM_HandleTypeDef htim6;

UART_HandleTypeDef huart2;
UART_HandleTypeDef huart3;

/* USER CODE BEGIN PV */

/* USER CODE END PV */

/* Private function prototypes -----------------------------------------------*/
void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_USART2_UART_Init(void);
static void MX_USART3_UART_Init(void);
static void MX_TIM6_Init(void);
/* USER CODE BEGIN PFP */
/* USER CODE END PFP */

/* Private user code ---------------------------------------------------------*/
/* USER CODE BEGIN 0 */
char ESP_answer[MAX_ANSWER_LENGTH];
char post[POST_LENGTH] = {"\0"};

char current_rx_byte = 0;
uint8_t ESP_answer_write_point = 0;
uint8_t ESP_TotalReadByteCounter = 0;

uint8_t sample_counter_live = 0;
uint16_t new_sample_counter_graph = 0;
/* USER CODE END 0 */

/**
  * @brief  The application entry point.
  * @retval int
  */
int main(void)
{
  /* USER CODE BEGIN 1 */

  /* USER CODE END 1 */
  

  /* MCU Configuration--------------------------------------------------------*/

  /* Reset of all peripherals, Initializes the Flash interface and the Systick. */
  HAL_Init();

  /* USER CODE BEGIN Init */

  /* USER CODE END Init */

  /* Configure the system clock */
  SystemClock_Config();

  /* USER CODE BEGIN SysInit */

  /* USER CODE END SysInit */

  /* Initialize all configured peripherals */
  MX_GPIO_Init();
  MX_USART2_UART_Init();
  MX_USART3_UART_Init();
  MX_TIM6_Init();
  /* USER CODE BEGIN 2 */
  CoreDebug->DEMCR |= CoreDebug_DEMCR_TRCENA_Msk;
  DWT->CYCCNT = 0;
  DWT->CTRL |= DWT_CTRL_CYCCNTENA_Msk;
  HAL_TIM_Base_Start_IT(&htim6);

  HAL_UART_Transmit(&huart2, (uint8_t*)"\r\nProgram Started\r\n", (uint16_t) strlen("\r\nProgram Started\r\n"), HAL_MAX_DELAY);
  DHT11_sample();
  while (ESP8266_wake_up() != ESP_WAKEUP_SUCCESS);
  /* USER CODE END 2 */

  /* Infinite loop */
  /* USER CODE BEGIN WHILE */
  while (1) {
      if (new_sample_counter_graph >= COUNTER_NEW_SAMPLE_GRAPH) {
    	  new_sample_counter_graph = 0;
    	  sample_and_post_dht(ENDPOINT_NEW_SAMPLE);
      }

      if (sample_counter_live >= COUNTER_NEW_SAMPLE_LIVE) {
    	  sample_counter_live = 0;
    	  sample_and_post_dht(ENDPOINT_LIVE_SAMPLE);
      }
    /* USER CODE END WHILE */

    /* USER CODE BEGIN 3 */
  }
  /* USER CODE END 3 */
}


/**
  * @brief System Clock Configuration
  * @retval None
  */
void SystemClock_Config(void)
{
  RCC_OscInitTypeDef RCC_OscInitStruct = {0};
  RCC_ClkInitTypeDef RCC_ClkInitStruct = {0};
  RCC_PeriphCLKInitTypeDef PeriphClkInit = {0};

  /** Initializes the CPU, AHB and APB busses clocks 
  */
  RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_HSI;
  RCC_OscInitStruct.HSIState = RCC_HSI_ON;
  RCC_OscInitStruct.HSICalibrationValue = RCC_HSICALIBRATION_DEFAULT;
  RCC_OscInitStruct.PLL.PLLState = RCC_PLL_ON;
  RCC_OscInitStruct.PLL.PLLSource = RCC_PLLSOURCE_HSI;
  RCC_OscInitStruct.PLL.PLLMUL = RCC_PLL_MUL9;
  RCC_OscInitStruct.PLL.PREDIV = RCC_PREDIV_DIV1;
  if (HAL_RCC_OscConfig(&RCC_OscInitStruct) != HAL_OK)
  {
    Error_Handler();
  }
  /** Initializes the CPU, AHB and APB busses clocks 
  */
  RCC_ClkInitStruct.ClockType = RCC_CLOCKTYPE_HCLK|RCC_CLOCKTYPE_SYSCLK
                              |RCC_CLOCKTYPE_PCLK1|RCC_CLOCKTYPE_PCLK2;
  RCC_ClkInitStruct.SYSCLKSource = RCC_SYSCLKSOURCE_PLLCLK;
  RCC_ClkInitStruct.AHBCLKDivider = RCC_SYSCLK_DIV1;
  RCC_ClkInitStruct.APB1CLKDivider = RCC_HCLK_DIV2;
  RCC_ClkInitStruct.APB2CLKDivider = RCC_HCLK_DIV1;

  if (HAL_RCC_ClockConfig(&RCC_ClkInitStruct, FLASH_LATENCY_2) != HAL_OK)
  {
    Error_Handler();
  }
  PeriphClkInit.PeriphClockSelection = RCC_PERIPHCLK_USART2|RCC_PERIPHCLK_USART3;
  PeriphClkInit.Usart2ClockSelection = RCC_USART2CLKSOURCE_PCLK1;
  PeriphClkInit.Usart3ClockSelection = RCC_USART3CLKSOURCE_PCLK1;
  if (HAL_RCCEx_PeriphCLKConfig(&PeriphClkInit) != HAL_OK)
  {
    Error_Handler();
  }
}

/**
  * @brief TIM6 Initialization Function
  * @param None
  * @retval None
  */
static void MX_TIM6_Init(void)
{

  /* USER CODE BEGIN TIM6_Init 0 */

  /* USER CODE END TIM6_Init 0 */

  TIM_MasterConfigTypeDef sMasterConfig = {0};

  /* USER CODE BEGIN TIM6_Init 1 */

  /* USER CODE END TIM6_Init 1 */
  htim6.Instance = TIM6;
  htim6.Init.Prescaler = 35999;
  htim6.Init.CounterMode = TIM_COUNTERMODE_UP;
  htim6.Init.Period = 1999;
  htim6.Init.AutoReloadPreload = TIM_AUTORELOAD_PRELOAD_DISABLE;
  if (HAL_TIM_Base_Init(&htim6) != HAL_OK)
  {
    Error_Handler();
  }
  sMasterConfig.MasterOutputTrigger = TIM_TRGO_UPDATE;
  sMasterConfig.MasterSlaveMode = TIM_MASTERSLAVEMODE_DISABLE;
  if (HAL_TIMEx_MasterConfigSynchronization(&htim6, &sMasterConfig) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN TIM6_Init 2 */

  /* USER CODE END TIM6_Init 2 */

}

/**
  * @brief USART2 Initialization Function
  * @param None
  * @retval None
  */
static void MX_USART2_UART_Init(void)
{

  /* USER CODE BEGIN USART2_Init 0 */

  /* USER CODE END USART2_Init 0 */

  /* USER CODE BEGIN USART2_Init 1 */

  /* USER CODE END USART2_Init 1 */
  huart2.Instance = USART2;
  huart2.Init.BaudRate = 38400;
  huart2.Init.WordLength = UART_WORDLENGTH_8B;
  huart2.Init.StopBits = UART_STOPBITS_1;
  huart2.Init.Parity = UART_PARITY_NONE;
  huart2.Init.Mode = UART_MODE_TX_RX;
  huart2.Init.HwFlowCtl = UART_HWCONTROL_NONE;
  huart2.Init.OverSampling = UART_OVERSAMPLING_16;
  huart2.Init.OneBitSampling = UART_ONE_BIT_SAMPLE_DISABLE;
  huart2.AdvancedInit.AdvFeatureInit = UART_ADVFEATURE_NO_INIT;
  if (HAL_UART_Init(&huart2) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN USART2_Init 2 */

  /* USER CODE END USART2_Init 2 */

}

/**
  * @brief USART3 Initialization Function
  * @param None
  * @retval None
  */
static void MX_USART3_UART_Init(void)
{

  /* USER CODE BEGIN USART3_Init 0 */

  /* USER CODE END USART3_Init 0 */

  /* USER CODE BEGIN USART3_Init 1 */

  /* USER CODE END USART3_Init 1 */
  huart3.Instance = USART3;
  huart3.Init.BaudRate = 115200;
  huart3.Init.WordLength = UART_WORDLENGTH_8B;
  huart3.Init.StopBits = UART_STOPBITS_1;
  huart3.Init.Parity = UART_PARITY_NONE;
  huart3.Init.Mode = UART_MODE_TX_RX;
  huart3.Init.HwFlowCtl = UART_HWCONTROL_NONE;
  huart3.Init.OverSampling = UART_OVERSAMPLING_16;
  huart3.Init.OneBitSampling = UART_ONE_BIT_SAMPLE_DISABLE;
  huart3.AdvancedInit.AdvFeatureInit = UART_ADVFEATURE_NO_INIT;
  if (HAL_UART_Init(&huart3) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN USART3_Init 2 */

  /* USER CODE END USART3_Init 2 */

}

/**
  * @brief GPIO Initialization Function
  * @param None
  * @retval None
  */
static void MX_GPIO_Init(void)
{
  GPIO_InitTypeDef GPIO_InitStruct = {0};

  /* GPIO Ports Clock Enable */
  __HAL_RCC_GPIOC_CLK_ENABLE();
  __HAL_RCC_GPIOF_CLK_ENABLE();
  __HAL_RCC_GPIOA_CLK_ENABLE();
  __HAL_RCC_GPIOB_CLK_ENABLE();

  /*Configure GPIO pin Output Level */
  HAL_GPIO_WritePin(LD2_GPIO_Port, LD2_Pin, GPIO_PIN_RESET);

  /*Configure GPIO pin Output Level */
  HAL_GPIO_WritePin(DHT11_GPIO_Port, DHT11_Pin, GPIO_PIN_RESET);

  /*Configure GPIO pin : B1_Pin */
  GPIO_InitStruct.Pin = B1_Pin;
  GPIO_InitStruct.Mode = GPIO_MODE_IT_FALLING;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  HAL_GPIO_Init(B1_GPIO_Port, &GPIO_InitStruct);

  /*Configure GPIO pin : LD2_Pin */
  GPIO_InitStruct.Pin = LD2_Pin;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(LD2_GPIO_Port, &GPIO_InitStruct);

  /*Configure GPIO pin : DHT11_Pin */
  GPIO_InitStruct.Pin = DHT11_Pin;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(DHT11_GPIO_Port, &GPIO_InitStruct);

}

/**************************************************/
/* USER CODE BEGIN 4 ******************************/
/**************************************************/
void sample_and_post_dht(char *endpoint)
{
	SampleDHT11 sample = DHT11_sample();
	DHT11_to_post(post, POST_LENGTH, sample, endpoint, HOST);
	ESP8266_send_data(post, ADDRESS, PORT);
	memset(post, 0, sizeof post);
}


uint8_t ESP8266_wake_up()
{
	HAL_UART_Receive_IT(&huart3, (uint8_t*)&current_rx_byte, 1); // Start Receiving
	ESP_answer_clear();

	if (ESP8266_send_cmd(AT, "OK") != AT_OK)
		return ESP8266_AT_command_error(ESP_WAKEUP_FAILURE, "ERROR: AT command failed on device wakeup\r\n");

	ESP8266_send_cmd(AT_RST, "ready");

	if (ESP8266_send_cmd(ATE0, "OK") != AT_OK)
		return ESP8266_AT_command_error(ESP_WAKEUP_FAILURE, "ERROR: ATE0 command failed on device wakeup\r\n");

	if (ESP8266_send_cmd(AT_CIPMUX0, "OK") != AT_OK)
		return ESP8266_AT_command_error(ESP_WAKEUP_FAILURE, "ERROR: AT+CIPMUX=0 command failed on device wakeup\r\n");

	if (ESP8266_check_wifi_connection() != AT_OK)
		return ESP8266_AT_command_error(ESP_WAKEUP_FAILURE, "ERROR: Cannot connect to SSID on device wakeup\r\n");

	return ESP_WAKEUP_SUCCESS;
}


uint8_t ESP8266_open_tcp_port()
{
	if (ESP8266_check_wifi_connection() != AT_OK)
		return AT_ERROR;

	if (ESP8266_send_cmd(AT_CIPSTATUS, ADDRESS) != AT_OK) {
		if (ESP8266_send_cmd(AT_CIPSTART_TCP, "OK") != AT_OK)
			return AT_ERROR;
	}

	return AT_OK;
}


uint8_t ESP8266_check_wifi_connection()
{
	if (ESP8266_send_cmd(AT_CIFSR, "192.168") != AT_OK) {
		if (ESP8266_send_cmd(AT, "OK") != AT_OK)
			while (ESP8266_wake_up() != ESP_WAKEUP_SUCCESS);

		if (ESP8266_send_cmd(AT_CWJAP, "WIFI GOT IP") != AT_OK)
			return AT_ERROR;

		HAL_UART_Transmit(&huart2, (uint8_t*)WIFI_UP, (uint16_t) strlen(WIFI_UP), HAL_MAX_DELAY);
	}
	HAL_GPIO_WritePin(LD2_GPIO_Port, LD2_Pin, 0x0);
	return AT_OK;
}


uint8_t ESP8266_send_data(const char *data, const char *address, uint16_t port)
{
	if (ESP8266_open_tcp_port() != AT_OK)
		return ESP8266_AT_command_error(ESP_WAKEUP_FAILURE, TCP_CONNECTION_FAILED);

	uint8_t is_data_sent = DATA_NOT_SENT;
	uint16_t len = strlen(data);
	char msg[20] = {"\0"};
	sprintf(msg, "AT+CIPSEND=%d\r\n", len);

	if (ESP8266_send_cmd(msg, ">") == AT_OK) {
		is_data_sent = DATA_SENT;
		HAL_UART_Transmit(&huart3, (uint8_t*)data, len, HAL_MAX_DELAY);
		HAL_UART_Transmit(&huart2, (uint8_t*)"Data sent\r\n", (uint16_t) strlen("Data sent\r\n"), HAL_MAX_DELAY);
	}

	return is_data_sent;
}


uint8_t ESP8266_send_cmd(const char *cmd, const char *examcode)
{
	HAL_UART_Transmit(&huart3, (uint8_t*)cmd, (uint16_t) strlen(cmd), HAL_MAX_DELAY);
	uint8_t at_state = ESP8266_AT_check_response(examcode, 10);
	ESP_answer_clear();
	return at_state;
}


uint8_t ESP8266_AT_check_response(char const *expected_text, uint16_t delay_s)
{
	uint8_t counter = 0;
	while (counter++ < delay_s) {
		if (strstr((char*)ESP_answer, expected_text) != NULL)
			return AT_OK;

		HAL_Delay(1000);
	}

	if (strstr((char*)ESP_answer, "ERROR") != NULL)
		return AT_ERROR;
	return AT_TIMEOUT;
}


void ESP_answer_clear()
{
	memset(ESP_answer, 0, sizeof ESP_answer);
	ESP_answer_write_point = 0;
}


uint8_t ESP8266_AT_command_error(uint8_t error_val, char *message)
{
	HAL_UART_Transmit(&huart2, (uint8_t*)message, (uint16_t) strlen(message), HAL_MAX_DELAY);
	HAL_GPIO_WritePin(LD2_GPIO_Port, LD2_Pin, 0x1);
	return error_val;
}


void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)
{
	if (huart->Instance == USART3) {
		ESP_answer[ESP_answer_write_point] = current_rx_byte;
		if (ESP_answer_write_point < MAX_ANSWER_LENGTH - 1)
			ESP_answer_write_point++;
		else
			ESP_answer_write_point = 0;

		ESP_TotalReadByteCounter++;
		HAL_UART_Receive_IT(&huart3, (uint8_t*)&current_rx_byte, 1);
	}
}


void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim)
{
	if (htim->Instance == TIM6) {
		new_sample_counter_graph++;
		sample_counter_live++;
	}
}

/* USER CODE END 4 */

/**
  * @brief  This function is executed in case of error occurrence.
  * @retval None
  */
void Error_Handler(void)
{
  /* USER CODE BEGIN Error_Handler_Debug */
  /* User can add his own implementation to report the HAL error return state */

  /* USER CODE END Error_Handler_Debug */
}

#ifdef  USE_FULL_ASSERT
/**
  * @brief  Reports the name of the source file and the source line number
  *         where the assert_param error has occurred.
  * @param  file: pointer to the source file name
  * @param  line: assert_param error line source number
  * @retval None
  */
void assert_failed(char *file, uint32_t line)
{ 
  /* USER CODE BEGIN 6 */
  /* User can add his own implementation to report the file name and line number,
     tex: printf("Wrong parameters value: file %s on line %d\r\n", file, line) */
  /* USER CODE END 6 */
}
#endif /* USE_FULL_ASSERT */

/************************ (C) COPYRIGHT STMicroelectronics *****END OF FILE****/
