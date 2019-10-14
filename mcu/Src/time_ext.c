#include "stm32f3xx_hal.h"
#include "time_ext.h"

void DWT_init()
{
	CoreDebug->DEMCR |= CoreDebug_DEMCR_TRCENA_Msk;
	DWT->CYCCNT = 0;
	DWT->CTRL |= DWT_CTRL_CYCCNTENA_Msk;
}


#pragma GCC push_options
#pragma GCC optimize ("O3")
void DWT_delay_us(uint32_t us)
{
	volatile uint32_t cycles = (SystemCoreClock/1000000L)*us;
	volatile uint32_t start = DWT->CYCCNT;
	while (DWT->CYCCNT - start < cycles);
}
#pragma GCC pop_options
