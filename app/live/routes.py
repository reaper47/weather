from datetime import datetime
from flask import render_template, request
import json
import requests
from app import socketio
from app.live import bp
from app.models.sampling import get_samples_for_day, add_new_sample
from app.utils.dto import (Sample, DHT_Dto, DS18B20_Dto, FC37_Dto, Wind_Dto,
                           TEMT6000_Dto, BME280_Dto, Averages_Dto)

WEMOS_SERVER_ADDRESS = 'http://192.168.0.122/'

graphs = ['temperature', 'heat-index', 'humidity', 'wind', 'rain', 'light', 'pressure',
          '', 'temperature-heat-index', 'temperature-humidity',
          'temperature-rain', 'temperature-light', 'temperature-pressure', '',
          'heat-index-humidity', 'heat-index-rain', 'heat-index-light',
          'heat-index-pressure', '', 'rain-humidity', 'rain-light', '',
          'light-humidity', '', 'pressure-humidity', 'pressure-rain',
          'pressure-light']


@bp.route('/', methods=['GET', 'POST'])
def index():
    samples = get_samples_for_day(datetime.now())
    return render_template('index.html', title='Live',
                           samples=samples, graphs=graphs)


@bp.route('/newsample', methods=['POST'])
def newsample():
    json_ = request.get_json()
    add_wind_to_json(json_)

    dht = DHT_Dto(station_id=json_['DHT']['station_id'],
                  humidity=json_['DHT']['RH'], t_c=json_['DHT']['T_C'],
                  t_f=json_['DHT']['T_F'], hi_c=json_['DHT']['HI_C'],
                  hi_f=json_['DHT']['HI_F'])
    ds18b20 = DS18B20_Dto(t_c=json_['DS18B20']['0']['T_C'],
                          t_f=json_['DS18B20']['0']['T_F'])
    fc37 = FC37_Dto(rain=json_['FC37']['rain'])
    temt6000 = TEMT6000_Dto(lux=json_['TEMT6000']['lux'])
    bme280 = BME280_Dto(t_c=json_['BME280']['T_C'], t_f=json_['BME280']['T_F'],
                        humidity=json_['BME280']['RH'],
                        pa=json_['BME280']['P'], kpa=json_['BME280']['P_kPa'],
                        mb=json_['BME280']['P_mb'])
    wind = Wind_Dto(ms=json_['Wind']['ms'], kmph=json_['Wind']['kmph'],
                    mph=json_['Wind']['mph'])
    averages = Averages_Dto(t_c=json_['T']['C'], t_f=json_['T']['F'])
    date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    json_['date'] = date

    sample = Sample(dht, ds18b20, fc37, temt6000, bme280, wind, averages, date)
    add_new_sample(sample)
    socketio.emit('update_graph', json_)
    return ''


@bp.route('/livesample', methods=['POST'])
def livesample():
    json_ = request.get_json()
    add_wind_to_json(json_)
    socketio.emit('update_live', json_)
    return ''


def add_wind_to_json(json_):
    try:
        wind_json = json.loads(requests.get(WEMOS_SERVER_ADDRESS).text)
    except requests.exceptions.ConnectionError:
        wind_json = {'wind': {'ms': 0, 'kmph': 0, 'mph': 0}}
    json_['Wind'] = wind_json['wind']
