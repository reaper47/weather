import pytest
from app import create_app, db
from app.models.sampling import Station, DHT
from app.utils.database import commit

A_STATION_NAME = 'Home - Backyard'
A_TEMPERATURE = 23.0
A_HUMIDITY = 56.0


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
    dht = DHT(station=a_station, temperature=A_TEMPERATURE, humidity=A_HUMIDITY)
    commit(dht)
    return DHT.query.all()[0]
