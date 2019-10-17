import json
import pytest
from app import create_app, db
from app.models.sampling import Station, DHT
from app.utils.database import commit

A_STATION_NAME = 'Home - Backyard'
A_TEMPERATURE_C = 23.0
A_TEMPERATURE_F = 72.6
A_HUMIDITY = 56.0
A_HEAT_INDEX_C = 23.5
A_HEAT_INDEX_F = 72.3

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
    yield db
    db.session.remove()
    db.drop_all()


@pytest.fixture(scope='function')
def a_station(test_client, init_database):
    station = Station(lat=46.8187756, lng=-71.3603236, name=A_STATION_NAME)
    commit(station)
    return Station.query.all()[0]


@pytest.fixture(scope='function')
def a_sample(test_client, init_database, a_station):
    dht = DHT(station=a_station, temperature_c=A_TEMPERATURE_C, temperature_f=A_TEMPERATURE_F,
              humidity=A_HUMIDITY, heat_index_c=A_HEAT_INDEX_C, heat_index_f=A_HEAT_INDEX_F)
    commit(dht)
    return DHT.query.all()[0]
