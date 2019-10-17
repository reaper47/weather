from datetime import datetime, timedelta
from app.models.sampling import Station, DHT, get_samples_for_day, add_new_sample
from app.utils.database import commit
from app.utils.dto import Sample
from tests.conftest import (A_STATION_NAME, A_TEMPERATURE_C, A_TEMPERATURE_F,
                            A_HUMIDITY, A_HEAT_INDEX_C, A_HEAT_INDEX_F)


def test_format_station():
    """
    GIVEN a station
    WHEN the station is converted to a string
    THEN the string is formatted correctly
    """
    station = Station(id=1, lat=123.123, lng=321.321, name=A_STATION_NAME)
    format_expected = f'<Station #1 ({A_STATION_NAME}): [123.123, 321.321]>'

    format_actual = str(station)

    assert format_expected == format_actual


def test_format_dht(a_sample):
    """
    WHEN the dht is converted to a string
    THEN the string is formatted correctly
    """
    format_expected = (f'<DHT #1.1 -\n'
                       f' Temperature: {A_TEMPERATURE_C} ({A_TEMPERATURE_F}) <>\n'
                       f' RH: {A_HUMIDITY} <>\n'
                       f' HI: {A_HEAT_INDEX_C} ({A_HEAT_INDEX_F}) <>\n'
                       f' Date: {a_sample.date}>')

    format_actual = str(a_sample)

    assert format_expected == format_actual


def test_get_sample_for_day(a_station, a_sample):
    """
    GIVEN samples for five different days
    WHEN the sample for a given day are requested
    THEN return the expected sample
    """
    dates = [datetime.today() - timedelta(days=i) for i in range(5)]
    for date in dates:
        sample = DHT(station=a_sample.station, temperature_c=A_TEMPERATURE_C, temperature_f=A_TEMPERATURE_F,
                     humidity=A_HUMIDITY, heat_index_c=A_HEAT_INDEX_C, heat_index_f=A_HEAT_INDEX_F, date=date)
        commit(sample)

    samples_actual = get_samples_for_day(dates[2])

    num_samples_expected = 1
    assert num_samples_expected == len(samples_actual)


def test_add_new_sample(a_station):
    """
    WHEN adding a new sample to the db
    THEN the sample is added
    """
    a_sample = Sample(station=a_station.id, temperature_c=99.53, temperature_f=99.43,
                      heat_index_c=100.3, heat_index_f=110.7, humidity=77.25,
                      date=str(datetime.now() - timedelta(days=5)))
    add_new_sample(a_sample)

    new_sample = DHT.query.all()[-1]
    assert new_sample.station.id == a_sample.station
    assert new_sample.temperature_c == a_sample.temperature_c
    assert new_sample.temperature_f == a_sample.temperature_f
    assert new_sample.heat_index_c == a_sample.heat_index_c
    assert new_sample.heat_index_f == a_sample.heat_index_f
    assert new_sample.humidity == a_sample.humidity
    assert str(new_sample.date).split('.')[0] == str(a_sample.date).split('.')[0]
