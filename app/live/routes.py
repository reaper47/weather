from datetime import datetime
from flask import render_template, request
from app import socketio
from app.live import bp
from app.models.sampling import get_samples_for_day, add_new_sample
from app.utils.dto import Sample, DHT_Dto, DS18B20_Dto, FC37_Dto, TEMT6000_Dto, BME280_Dto, Averages_Dto

graphs = ['temperature', 'heat-index', 'humidity', 'rain', 'light', 'pressure', '', 'temperature-heat-index',
          'temperature-humidity', 'temperature-rain', 'temperature-light', 'temperature-pressure', '',
          'heat-index-humidity', 'heat-index-rain', 'heat-index-light', 'heat-index-pressure', '',
          'rain-humidity', 'rain-light', '', 'light-humidity', '', 'pressure-humidity', 'pressure-rain',
          'pressure-light']


@bp.route('/', methods=['GET', 'POST'])
def index():
    samples = get_samples_for_day(datetime.now())
    return render_template('index.html', title='Live', samples=samples, graphs=graphs)


@bp.route('/newsample', methods=['POST'])
def newsample():
    json = request.get_json()
    dht = DHT_Dto(station_id=json['DHT']['station_id'], humidity=json['DHT']['RH'], t_c=json['DHT']['T_C'],
                  t_f=json['DHT']['T_F'], hi_c=json['DHT']['HI_C'], hi_f=json['DHT']['HI_F'])
    ds18b20 = DS18B20_Dto(t_c=json['DS18B20']['0']['T_C'], t_f=json['DS18B20']['0']['T_F'])
    fc37 = FC37_Dto(rain=json['FC37']['rain'])
    temt6000 = TEMT6000_Dto(lux=json['TEMT6000']['lux'])
    bme280 = BME280_Dto(t_c=json['BME280']['T_C'], t_f=json['BME280']['T_F'], humidity=json['BME280']['RH'],
                        pa=json['BME280']['P'], kpa=json['BME280']['P_kPa'], mb=json['BME280']['P_mb'])
    averages = Averages_Dto(t_c=json['T']['C'], t_f=json['T']['F'])
    date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    json['date'] = date

    sample = Sample(dht, ds18b20, fc37, temt6000, bme280, averages, date)
    add_new_sample(sample)
    socketio.emit('update_graph', json)
    return ''


@bp.route('/livesample', methods=['POST'])
def livesample():
    socketio.emit('update_live', request.get_json())
    return ''
