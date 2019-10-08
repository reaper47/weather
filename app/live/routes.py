from datetime import datetime
from flask import render_template, request
from app import socketio
from app.live import bp
from app.models.sampling import get_samples_for_day, add_new_sample
from app.utils.dto import Sample


@bp.route('/', methods=['GET', 'POST'])
def index():
    samples = get_samples_for_day(datetime.now())
    return render_template('index.html', title='Live', samples=samples)


@bp.route('/newsample', methods=['POST'])
def newsample():
    json_sample = request.get_json()
    json_sample['date'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    sample = Sample(temperature=json_sample['temperature'], humidity=json_sample['humidity'],
                    station=json_sample['station_id'], date=json_sample['date'])
    add_new_sample(sample)
    socketio.emit('update_graph', json_sample)
    return ''


@bp.route('/livesample', methods=['POST'])
def livesample():
    socketio.emit('update_live', request.get_json())
    return ''
