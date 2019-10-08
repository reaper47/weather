#ifndef __GPIO_EXT_H
#define __GPIO_EXT_H

#include "stm32f3xx_hal.h"

void gpio_set_output(GPIO_TypeDef *port, uint16_t pin);
void gpio_set_input(GPIO_TypeDef *port, uint16_t pin);

#endif /* __GPIO_EXT_H */
