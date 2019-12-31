import json
import pytest
from app import create_app, db
from app.models.sampling import (Station, DHT, DS18B20, FC37, TEMT6000, Wind,
                                 BME280, Temperature, HeatIndex, Pressure)
from app.utils.database import commit

A_STATION_NAME = 'Home - Backyard'
A_TEMPERATURE_C = 23.6
A_TEMPERATURE_F = 72.6
A_HEAT_INDEX_C = 25.5
A_HEAT_INDEX_F = 70.5
A_HUMIDITY = 56.0
A_LUX = 333
A_PRESSURE = 100170.0
A_PRESSURE_KPA = 100.2
A_PRESSURE_MB = 1002
A_SPEED_MS = 24.5
A_SPEED_KMPH = 88.2
A_SPEED_MPH = 54.8

A_JSON_SAMPLE = json.dumps({
    'DHT': {'station_id': 1, 'RH': 51.3, 'T_C': 21.9, 'T_F': 71.4,
            'HI_C': 21.5, 'HI_F': 70.7},
    'DS18B20': {0: {'T_C': 21.81, 'T_F': 71.26}}, 'FC37': {'rain': 'N'},
    'TEMT600': {'lux': 7},
    'BME280': {'H_C': 21.67, 'H_F': 71.01, 'RH': 41.05, 'P': 100297.2,
               'P_kPa': 100.3, 'P_mb': 1003},
    'T': {'C': 21.8, 'F': 71.23},
    'Wind': {'ms': '0.50', 'kmph': '1.79', 'mph': '1.12'}
})


@pytest.fixture(scope='function')
def test_client():
    app = create_app('testing')
    client = app.test_client()
    ctx = app.app_context()
    ctx.push()
    yield client
    ctx.pop()


@pytest.fixture(scope='function')
def init_database():
    db.create_all()
    commit([Temperature(A_TEMPERATURE_C, A_TEMPERATURE_F),
            HeatIndex(A_HEAT_INDEX_C, A_HEAT_INDEX_F),
            Pressure(A_PRESSURE, A_PRESSURE_KPA, A_PRESSURE_MB)])
    yield db
    db.session.remove()
    db.drop_all()


@pytest.fixture(scope='function')
def a_station(test_client, init_database):
    station = Station(lat=46.8187756, lng=-71.3603236, name=A_STATION_NAME)
    commit(station)
    return Station.query.all()[0]


@pytest.fixture(scope='function')
def a_temperature(test_client, init_database):
    return Temperature.query.all()[0]


@pytest.fixture(scope='function')
def a_pressure(test_client, init_database):
    return Pressure.query.all()[0]


@pytest.fixture(scope='function')
def a_heat_index(test_client, init_database):
    return HeatIndex.query.all()[0]


@pytest.fixture(scope='function')
def a_dht_sample(test_client, init_database, a_station,
                 a_temperature, a_heat_index):
    dht = DHT(station=a_station, temperature=a_temperature,
              humidity=A_HUMIDITY, heat_index=a_heat_index)
    commit(dht)
    return DHT.query.all()[0]


@pytest.fixture(scope='function')
def a_ds18b20(test_client, init_database, a_temperature):
    ds18b20 = DS18B20(temperature=a_temperature)
    commit(ds18b20)
    return DS18B20.query.all()[0]


@pytest.fixture(scope='function')
def a_fc37(test_client, init_database, a_temperature):
    fc37 = FC37(rain="N")
    commit(fc37)
    return FC37.query.all()[0]


@pytest.fixture(scope='function')
def a_temt6000(test_client, init_database):
    temt6000 = TEMT6000(lux=A_LUX)
    commit(temt6000)
    return TEMT6000.query.all()[0]


@pytest.fixture(scope='function')
def a_bme280(test_client, init_database, a_temperature, a_pressure):
    bme280 = BME280(temperature=a_temperature, humidity=A_HUMIDITY,
                    pressure=a_pressure)
    commit(bme280)
    return BME280.query.all()[0]


@pytest.fixture(scope='function')
def a_wind(test_client, init_database):
    wind = Wind(ms=A_SPEED_MS, kmph=A_SPEED_KMPH, mph=A_SPEED_MS)
    commit(wind)
    return Wind.query.all()[0]