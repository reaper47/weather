#include <esp8266.h>


void ESP8266_init(ESP8266_HandleTypeDef *hesp, UART_HandleTypeDef *huart_device, UART_HandleTypeDef *huart_external,
		            char *ssid, char *password, char *tcp_address, uint16_t tcp_port)
{
	char host[HOST_LENGTH];
	snprintf(host, sizeof host, "%s:%d", tcp_address, tcp_port);

	hesp->huart_device = huart_device;
	hesp->huart_external = huart_external;
	ESP8266_update_wifi_info(hesp, ssid, password);
	ESP8266_update_tcp_info(hesp, tcp_address, tcp_port);
	strcpy(hesp->host, host);
	hesp->current_rx_byte = 0;
	hesp->counter_total_bytes_read = 0;
	hesp->answer_write_point = 0;
	memset(hesp->answer, 0, sizeof hesp->answer);
}


void ESP8266_update_wifi_info(ESP8266_HandleTypeDef *hesp, char *ssid, char *password)
{
	strcpy(hesp->ssid, ssid);
	strcpy(hesp->password, password);

	char at_cwjap[CWJAP_LENGTH];
	snprintf(at_cwjap, sizeof at_cwjap, "AT+CWJAP=\"%s\",\"%s\"\r\n", ssid, password);
	strcpy(hesp->at_cwjap, at_cwjap);
}


void ESP8266_update_tcp_info(ESP8266_HandleTypeDef *hesp, char *address, uint16_t port)
{
	strcpy(hesp->tcp_address, address);
	hesp->tcp_port = port;

	char at_cipstart[CIPSTART_LENGTH];
	snprintf(at_cipstart, sizeof at_cipstart, "AT+CIPSTART=\"TCP\",\"%s\",%d\r\n", address, port);
	strcpy(hesp->at_cipstart, at_cipstart);
}


uint8_t ESP8266_start(ESP8266_HandleTypeDef *hesp)
{
	HAL_UART_Receive_IT(hesp->huart_device, (uint8_t*)&hesp->current_rx_byte, 1); // Start Receiving
	_answer_clear(hesp);

	if (ESP8266_send_cmd(hesp, AT, OK) != AT_OK)
		return _AT_command_error(hesp->huart_external, ESP_START_FAILURE, ERROR_MSG_AT);

	ESP8266_send_cmd(hesp, AT_RST, "ready");

	if (ESP8266_send_cmd(hesp, ATE0, OK) != AT_OK)
		return _AT_command_error(hesp->huart_external, ESP_START_FAILURE, ERROR_MSG_ATE0);

	if (ESP8266_send_cmd(hesp, AT_CIPMUX0, OK) != AT_OK)
		return _AT_command_error(hesp->huart_external, ESP_START_FAILURE, ERROR_MSG_CIPMUX0);

	if (ESP8266_send_cmd(hesp, AT_CIPMODE0, OK) != AT_OK)
		return _AT_command_error(hesp->huart_external, ESP_START_FAILURE, ERROR_MSG_CIPMODE0);

	if (_check_wifi_connection(hesp) != AT_OK)
		return _AT_command_error(hesp->huart_external, ESP_START_FAILURE, ERROR_MSG_WIFI);

	HAL_UART_Transmit(hesp->huart_external, (uint8_t*)ESP_MSG_START_SUCCESS, (uint16_t) strlen(ESP_MSG_START_SUCCESS), HAL_MAX_DELAY);
	return ESP_START_SUCCESS;
}


uint8_t ESP8266_send_cmd(ESP8266_HandleTypeDef *hesp, const char *cmd, const char *examcode)
{
	HAL_UART_Transmit(hesp->huart_device, (uint8_t*)cmd, (uint16_t) strlen(cmd), HAL_MAX_DELAY);
	uint8_t at_state = _AT_check_response(hesp, examcode, 5);
	_answer_clear(hesp);
	return at_state;
}


uint8_t _AT_check_response(ESP8266_HandleTypeDef *hesp, const char *expected_text, uint16_t delay_s)
{
	uint8_t counter = 0;
	while (counter++ < delay_s) {
		if (strstr((char*)hesp->answer, expected_text) != NULL)
			return AT_OK;
		HAL_Delay(1000);
	}

	if (strstr((char*)hesp->answer, ERROR) != NULL)
		return AT_ERROR;
	return AT_TIMEOUT;
}


void _answer_clear(ESP8266_HandleTypeDef *hesp)
{
	memset(hesp->answer, 0, sizeof hesp->answer);
	hesp->answer_write_point = 0;
}


uint8_t ESP8266_send_data(ESP8266_HandleTypeDef *hesp, const char *data)
{
	if (_open_tcp_port(hesp) != AT_OK)
		return _AT_command_error(hesp->huart_external, ESP_START_FAILURE, TCP_CONNECTION_FAILED);

	uint8_t is_data_sent = DATA_NOT_SENT;
	uint16_t len = strlen(data);
	char msg[20] = {"\0"};
	snprintf(msg, sizeof msg, "AT+CIPSEND=%d\r\n", len);

	if (ESP8266_send_cmd(hesp, msg, ">") == AT_OK) {
		is_data_sent = DATA_SENT;
		HAL_UART_Transmit(hesp->huart_device, (uint8_t*)data, len, HAL_MAX_DELAY);
		HAL_UART_Transmit(hesp->huart_external, (uint8_t*)"Data sent\r\n", (uint16_t) strlen("Data sent\r\n"), HAL_MAX_DELAY);
	}

	return is_data_sent;
}


uint8_t _open_tcp_port(ESP8266_HandleTypeDef *hesp)
{
	if (_check_wifi_connection(hesp) != AT_OK)
		return _AT_command_error(hesp->huart_external, ESP_START_FAILURE, ERROR_MSG_WIFI);

	if (ESP8266_send_cmd(hesp, AT_CIPSTATUS, "4") == AT_OK ||
		ESP8266_send_cmd(hesp, AT_CIPSTATUS, "2") == AT_OK) {
		if (ESP8266_send_cmd(hesp, hesp->at_cipstart, "OK") != AT_OK)
			return AT_ERROR;
	}

	return AT_OK;
}


uint8_t _check_wifi_connection(ESP8266_HandleTypeDef *hesp)
{
	if (ESP8266_send_cmd(hesp, AT_IS_CONNECTED, hesp->ssid) != AT_OK) {
		if (ESP8266_send_cmd(hesp, hesp->at_cwjap, "WIFI GOT IP") != AT_OK) {
			if (ESP8266_start(hesp) != ESP_START_SUCCESS)
				return AT_ERROR;
		}
	}
	return AT_OK;
}


uint8_t _AT_command_error(UART_HandleTypeDef *huart, uint8_t error_val, char *message)
{
	HAL_UART_Transmit(huart, (uint8_t*)message, (uint16_t) strlen(message), HAL_MAX_DELAY);
	return error_val;
}


void ESP8266_receive_answer(ESP8266_HandleTypeDef *hesp)
{
	hesp->answer[hesp->answer_write_point] = hesp->current_rx_byte;
	if (hesp->answer_write_point < MAX_ANSWER_LENGTH - 1)
		hesp->answer_write_point++;
	else
		hesp->answer_write_point = 0;

	hesp->counter_total_bytes_read++;
	HAL_UART_Receive_IT(hesp->huart_device, (uint8_t*)&hesp->current_rx_byte, 1);
}
