# Weather Station

*Your personal weather station solution*

## Overview


## Installation

### Hardware


### Software

1. `git clone https://github.com/reaper47/weather.git && cd weather`
1. Run the install command: `yarn run it`
1. Activate the virtual environment: `. ./venv/bin/activate`
1. Create a `.env` file containing sensitive information. See below for its content.
1. Run the application: `python weather.py`

The `.env` file should contain the following key-value pairs:

```
SECRET_KEY=some secret key for Flask's Configuration

DATABASE_URI='mysql://user:password@localhost/weather' (Used in production)
DEV_DATABASE_URI='mysql://user:password@localhost/weather_dev' (Used during development)
TEST_DATABASE_URI='mysql://user:password@localhost/weather_test' (Used while running the tests)
```

The application will default to a SQLite database sitting at the root of the folder if no database URIs are specified. The database can be something other than MySQL

## Contributing


## Credits


## How to use with an Arduino


## Roadmap

- [ ] Add a wind sensor
- [ ] Develop a history module to display the weather over a specific frame
- [ ] Develop a prediction module to predict the weather based on the data stored in the database
