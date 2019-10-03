from datetime import datetime, timedelta
from app.models.sampling import Station, DHT, get_samples_for_day
from app.utils.database import commit
from tests.conftest import A_STATION_NAME, A_TEMPERATURE, A_HUMIDITY


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
    format_expected = f'<DHT #1.1: [{A_TEMPERATURE}, {A_HUMIDITY}, {a_sample.date}]>'

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
        sample = DHT(station=a_sample.station, temperature=A_TEMPERATURE, humidity=A_HUMIDITY, date=date)
        commit(sample)

    samples_actual = get_samples_for_day(dates[2])

    num_samples_expected = 1
    assert num_samples_expected == len(samples_actual)
