from datetime import datetime, timedelta
from app.models.sampling import (Station, DHT, Temperature, Pressure, HeatIndex, DS18B20, FC37, TEMT6000, BME280,
                                 get_samples_for_day, add_new_sample, find_temperature, find_pressure)
from app.utils.database import commit
from app.utils.dto import Sample, DHT_Dto, DS18B20_Dto, FC37_Dto, TEMT6000_Dto, BME280_Dto, Averages_Dto
from tests.conftest import (A_STATION_NAME, A_TEMPERATURE_C, A_TEMPERATURE_F, A_HUMIDITY, A_HEAT_INDEX_C,
                            A_HEAT_INDEX_F, A_PRESSURE, A_PRESSURE_KPA, A_PRESSURE_MB)


"""
TESTS - FORMAT
"""


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


def test_format_dht(a_dht_sample):
    """
    WHEN the dht is converted to a string
    THEN the string is formatted correctly
    """
    format_expected = ('<DHT #1.1 -\n'
                       f'  Temperature: <Temperature #1: [{A_TEMPERATURE_C},{A_TEMPERATURE_F}]>\n'
                       f'  RH: {A_HUMIDITY}\n'
                       f'  HI: <Heat Index #1: [{A_HEAT_INDEX_C},{A_HEAT_INDEX_F}]>\n'
                       f'  Date: {a_dht_sample.date}>')

    format_actual = str(a_dht_sample)

    assert format_expected == format_actual


def test_format_ds18b20(a_ds18b20):
    """
    WHEN the DS18B20 is converted to a string
    THEN the string is formatted correctly
    """
    format_expected = (f'<DS18B20 #1 -\n'
                       f'  Temperature: <Temperature #1: [{A_TEMPERATURE_C},{A_TEMPERATURE_F}]>\n'
                       f'  Date: {a_ds18b20.date}>')

    format_actual = str(a_ds18b20)

    assert format_expected == format_actual


def test_format_fc37(a_fc37):
    """
    WHEN the FC37 is converted to a string
    THEN the string is formatted correctly
    """
    format_expected = (f'<FC37 #1 -\n'
                       f'  Rain: N\n'
                       f'  Date: {a_fc37.date}>')

    format_actual = str(a_fc37)

    assert format_actual == format_expected


def test_format_temt6000(a_temt6000):
    """
    WHEN the TEMT6000 is converted to a string
    THEN the string is formatted correctly
    """
    format_expected = (f'<TEMT6000 #1 -\n'
                       f'  Lux: {a_temt6000.lux}\n'
                       f'  Date: {a_temt6000.date}>')

    format_actual = str(a_temt6000)

    assert format_actual == format_expected


def test_format_bme280(a_bme280):
    """
    WHEN the BME280 is converted to a string
    THEN the string is formatted correctly
    """
    format_expected = (f'<BME280 #1 -\n'
                       f'  Temperature: <Temperature #1: [{A_TEMPERATURE_C},{A_TEMPERATURE_F}]>\n'
                       f'  Humidity: {a_bme280.humidity}\n'
                       f'  Pressure: <Pressure #1: [{A_PRESSURE},{A_PRESSURE_KPA},{A_PRESSURE_MB}]\n'
                       f'  Date: {a_bme280.date}>')

    format_actual = str(a_bme280)

    assert format_actual == format_expected


"""
TESTS - FUNCTIONS
"""


def test_get_sample_for_day(a_dht_sample):
    """
    GIVEN samples for five different days
    WHEN the sample for a given day are requested
    THEN return the expected sample
    """
    dates = [datetime.today() - timedelta(days=i) for i in range(5)]
    for date in dates:
        sample = DHT(station=a_dht_sample.station, humidity=A_HUMIDITY,
                     temperature=a_dht_sample.temperature, heat_index=a_dht_sample.heat_index, date=date)
        commit(sample)

    samples_actual = get_samples_for_day(dates[2])

    num_sensors_expected = 7
    num_samples_expected = 1
    assert num_sensors_expected == len(samples_actual)
    for key in samples_actual['DHT']:
        assert num_samples_expected == len(samples_actual['DHT'][key])


def test_add_new_sample(a_station, a_dht_sample):
    """
    GIVEN a complete sample
    WHEN adding a new sample to the db
    THEN the every sensor has a new entry in the database
    """
    temperature = Temperature(celsius=99.53, fahrenheit=99.43)
    pressure = Pressure(100170, 100.2, 1002)
    heat_index = HeatIndex(celsius=100.3, fahrenheit=110.7)
    dht = DHT_Dto(station_id=a_station.id, humidity=A_HUMIDITY, t_c=temperature.celsius,
                  t_f=temperature.fahrenheit, hi_c=heat_index.celsius, hi_f=heat_index.fahrenheit)
    ds18b20 = DS18B20_Dto(t_c=temperature.celsius, t_f=temperature.fahrenheit)
    fc37 = FC37_Dto(rain='N')
    temt6000 = TEMT6000_Dto(lux=333)
    bme280 = BME280_Dto(t_c=temperature.celsius, t_f=temperature.fahrenheit, humidity=A_HUMIDITY,
                        pa=pressure.pascal, kpa=pressure.kilopascal, mb=pressure.mbar)
    averages = Averages_Dto(t_c=44.25, t_f=110.5)
    date = str(datetime.now() - timedelta(days=5)).split('.')[0]
    a_sample = Sample(dht, ds18b20, fc37, temt6000, bme280, averages, date)

    add_new_sample(a_sample)

    temperature = find_temperature(Temperature, temperature.celsius, temperature.fahrenheit)
    heat_index = find_temperature(HeatIndex, heat_index.celsius, heat_index.fahrenheit)
    pressure = find_pressure(pressure.pascal, pressure.kilopascal, pressure.mbar)
    assert DHT.query.all()[-1] == DHT(station=a_station, temperature=temperature,
                                      heat_index=heat_index, humidity=a_sample.dht.humidity, date=date)
    assert DS18B20.query.all()[-1] == DS18B20(temperature=temperature, date=date)
    assert FC37.query.all()[-1] == FC37(rain="N", date=date)
    assert TEMT6000.query.all()[-1] == TEMT6000(lux=333, date=date)
    assert BME280.query.all()[-1] == BME280(temperature=temperature, humidity=77.25, pressure=pressure, date=date)
