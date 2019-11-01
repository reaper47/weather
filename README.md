# Weather Station

*Your personal weather station solution*

## Overview


## Installation

### Hardware


### Software

The application requires Python 3.7 or later because it makes use of basic dataclasses. If you wish to use a version lower than 3.7, remove the dataclass import and add an __init__ method to each class in [utils/dto.py](https://github.com/reaper47/weather/blob/master/app/utils/dto.py).

If you have git installed, clone this repository. Otherwise download it.

```
$ git clone https://github.com/reaper47/weather.git && cd weather
```

Run the install command. Python's dependencies are installed under a virtual environment in the `venv` folder.

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

You can now access the web interface with your browser.

## Contributing


## Credits


## How to use with an Arduino


## Roadmap

- [ ] Add a wind sensor
- [ ] Develop a history module to display the weather over a specific frame
- [ ] Develop a prediction module to predict the weather based on the data stored in the database
