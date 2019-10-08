#include "gpio_ext.h"


void gpio_set_output(GPIO_TypeDef *port, uint16_t pin)
{
	GPIO_InitTypeDef GPIO_InitStruct = {0};
	GPIO_InitStruct.Pin = pin;
	GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
	HAL_GPIO_Init(port, &GPIO_InitStruct);
}


void gpio_set_input(GPIO_TypeDef *port, uint16_t pin)
{
	GPIO_InitTypeDef GPIO_InitStruct = {0};
	GPIO_InitStruct.Pin = pin;
	GPIO_InitStruct.Mode = GPIO_MODE_INPUT;
	HAL_GPIO_Init(port, &GPIO_InitStruct);
}
