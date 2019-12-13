# Weather Station

[[ Image of the app in action! ]]

*Your personal weather station solution*

Have you ever wished to have a weather station in your backyard where you can check the weather on a beautiful interface without having to leave the couch? If so, this is for you. 

The station takes temperature, heat index, humidity, rain, light and pressure measurements on a regular basis defined by you. The data from the station is transmitted to your server by WiFi. Your server will store the data in your database, and will send a live update to your browser.

## Features

* Clean interface focused on your data
* Live tiles for every measurement
* Graphs of Time vs Measurement for the entire day
* Choose between imperial and metric units

## Installation

Your personal weather station has a hardware and software part to it.

If you have git installed, clone this repository. Otherwise download it.
```
$ git clone https://github.com/reaper47/weather.git && cd weather
```

### Hardware

1. The first step is to connect the sensors and the ESP8266 WiFi microchip to the STM32.

The following sensors are supported. 

* [DHT11](https://www.mouser.com/datasheet/2/758/DHT11-Technical-Data-Sheet-Translated-Version-1143054.pdf)
* [DHT22](https://www.sparkfun.com/datasheets/Sensors/Temperature/DHT22.pdf)
* [BME280](https://ae-bst.resource.bosch.com/media/_tech/media/datasheets/BST-BME280-DS002.pdf)
* [DS18B20](https://datasheets.maximintegrated.com/en/ds/DS18B20.pdf)
* [TEMT6000](https://www.sparkfun.com/datasheets/Sensors/Imaging/TEMT6000.pdf)
* [FC-37](https://randomnerdtutorials.com/guide-for-rain-sensor-fc-37-or-yl-83-with-arduino/)

Sensors that are not available should have their initialization and sampling code removed [from the core](https://github.com/reaper47/weather/blob/master/mcu/Src/core.c). For example, if you do not have a FC-37 rain sensor, then you would remove `#include "fc37.h"` from the [core's header file](https://github.com/reaper47/weather/blob/master/mcu/Inc/core.h#L10), `FC37_Init();` from [core.c](https://github.com/reaper47/weather/blob/master/mcu/Src/core.c#L26), and `FC37_Sample(); FC37_ToJson_Partial(json_fc37);` from [core.c](https://github.com/reaper47/weather/blob/master/mcu/Src/core.c#L50).

2. Open the [microcontroller's source code](https://github.com/reaper47/weather/tree/master/mcu).

3. Modify GPIO port/pin number in the header file for each driver used. Refer to a sensor's [documentation](https://github.com/reaper47/stm32-device-libraries/wiki) for additional information. 

4. Build the project, and flash the image.

Notes:
* If you use a  different STM32 microcontroller, then replace the <stm32f3xx> header files with the appropriate ones. 
* If you use a STM32F7 board, then add `DWT->LAR = 0xC5ACCE55;` to the [DWT's initialization function](https://github.com/reaper47/weather/blob/master/mcu/Drivers/Extensions/Src/time_ext.c#L4).
* A live sample is sent to the server every 21s whereas a sample stored in the database is sent every ~15m. If you wish to use different time intervals, then modify the `COUNTER_GRAPH_SAMPLE_SECONDS` and `COUNTER_LIVE_SAMPLE_SECONDS` defines in the [main header file](https://github.com/reaper47/weather/blob/master/mcu/Inc/main.h#L89).

### Software

The application requires Python 3.7 or later because it makes use of basic dataclasses. If you wish to use a version lower than 3.7, remove the dataclass import and add an __init__ method to each class in [utils/dto.py](https://github.com/reaper47/weather/blob/master/app/utils/dto.py).

Run the install command once the repository has been clones. Python's dependencies are installed under a virtual environment in the `venv` folder.
```
$ yarn run it
```

Activate the virtual environment.
```
$ . ./venv/bin/activate
```
Create a `.env` file containing sensitive information. It should contain the following key-value pairs.
```
SECRET_KEY=some secret key for Flask's Configuration

DATABASE_URI='mysql://user:password@localhost/weather' (Used in production)
DEV_DATABASE_URI='mysql://user:password@localhost/weather_dev' (Used during development)
TEST_DATABASE_URI='mysql://user:password@localhost/weather_test' (Used while running the tests)
```

The application will default to a SQLite database sitting at the root of the folder if no database URIs are specified. The database can be something other than MySQL

Finally, run the web application.

```
$ python weather.py
```

You can now access the web interface through your browser.

## Contributing

Send me [an email](mailto:macpoule@gmail.com) or open [an issue](https://github.com/reaper47/weather/issues) for any of the following points.

* Do you wish your station had a sensor not currently supported? 
* Have you discovered any bugs?
* Is there a feature you wish your station had?
* Do you have any general improvement ideas?
* Is there something that bugs you?

Feel free to contribute to this project! All ideas are welcome.

### Arduino Support

There is no support for Arduino yet. However, it should be easy to port from the STM32 considering there are libraries for every sensor. The important part is to send JSON from the ESP8266 to the server in the expected format. Refer to the [documentation for each sensor](https://github.com/reaper47/stm32-device-libraries/wiki) and code for the implementation.

## Roadmap

- [ ] Add a wind sensor
- [ ] Develop a history module to display the weather over a specific frame
- [ ] Develop a prediction module to predict the weather based on the data stored in the database
- [ ] Check whether simplifying the installation down to an executable is a good idea
- [ ] Improve the firwre with power management
- [ ] Find a way to transmit the data with a way other than WiFi

## Credits

Credits are due to:

1. Bosch for their [BME280 driver](https://github.com/BoschSensortec/BME280_driver)
1. Lamik for his [STM32F4 DS18B20 driver](https://github.com/lamik/DS18B20_STM32_HAL)
