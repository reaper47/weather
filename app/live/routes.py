from datetime import datetime
from flask import render_template, request
from app import socketio
from app.live import bp
from app.models.sampling import get_samples_for_day, add_new_sample
from app.utils.dto import Sample

graphs = [('temperature', 'Temperature'), ('heat-index', 'Heat Index'), ('humidity', 'Humidity'),
          ('rain', 'Rain'), ('light', 'Light'), ('', ''), ('temperature-heat-index', 'Temperature + Heat Index'),
          ('temperature-humidity', 'Temperature + Humidity'), ('temperature-rain', 'Temperature + Rain'),
          ('temperature-light', 'Temperature + Light'), ('', ''),
          ('heat-index-humidity', 'Heat Index + Humidity'), ('heat-index-rain', 'Heat Index + Rain'),
          ('heat-index-light', 'Heat Index + Light'), ('', ''), ('rain-humidity', 'Rain + Humidity'),
          ('rain-light', 'Rain + Light'), ('', ''), ('light-humidity', 'Light + Humidity')]


@bp.route('/', methods=['GET', 'POST'])
def index():
    samples = get_samples_for_day(datetime.now())
    return render_template('index.html', title='Live', samples=samples, graphs=graphs)


@bp.route('/newsample', methods=['POST'])
def newsample():
    json_sample = request.get_json()
    json_sample['date'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    sample = Sample(station=json_sample['DHT']['station_id'],
                    humidity=json_sample['DHT']['RH'],
                    temperature_c=json_sample['T']['C'],
                    temperature_f=json_sample['T']['F'],
                    heat_index_c=json_sample['DHT']['HI_C'],
                    heat_index_f=json_sample['DHT']['HI_F'],
                    date=json_sample['date'])
    add_new_sample(sample)
    socketio.emit('update_graph', json_sample)
    return ''


@bp.route('/livesample', methods=['POST'])
def livesample():
    socketio.emit('update_live', request.get_json())
    return ''
