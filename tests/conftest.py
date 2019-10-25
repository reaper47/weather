import json
import pytest
from app import create_app, db
from app.models.sampling import Station, DHT, DS18B20, FC37, TEMT6000, BME280, Temperature, HeatIndex
from app.utils.database import commit

A_STATION_NAME = 'Home - Backyard'
A_TEMPERATURE_C = 23.6
A_TEMPERATURE_F = 72.6
A_HEAT_INDEX_C = 25.5
A_HEAT_INDEX_F = 70.5
A_HUMIDITY = 56.0
A_LUX = 333
A_PRESSURE = 100170

A_JSON_SAMPLE = json.dumps({'station_id': 1, 'RH': 55.1, 'T_C': 23.8, 'T_F': 76.2, 'HI_C': 24, 'HI_F': 74.2})
A_JSON_SAMPLE = json.dumps({'station_id': 1, 'RH': 44.2, 'T_C': 30.2, 'T_F': 77.9, 'HI_C': 33.2, 'HI_F': 81.2})


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
    commit([Temperature(celsius=A_TEMPERATURE_C, fahrenheit=A_TEMPERATURE_F),
            HeatIndex(celsius=A_HEAT_INDEX_C, fahrenheit=A_HEAT_INDEX_F)])
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
def a_heat_index(test_client, init_database):
    return HeatIndex.query.all()[0]


@pytest.fixture(scope='function')
def a_dht_sample(test_client, init_database, a_station, a_temperature, a_heat_index):
    dht = DHT(station=a_station, temperature=a_temperature, humidity=A_HUMIDITY, heat_index=a_heat_index)
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
def a_bme280(test_client, init_database, a_temperature):
    bme280 = BME280(temperature=a_temperature, humidity=A_HUMIDITY, pressure=A_PRESSURE)
    commit(bme280)
    return BME280.query.all()[0]
