from datetime import datetime
from flask import render_template
from app.live import bp
from app.models.sampling import get_samples_for_day


@bp.route('/', methods=['GET', 'POST'])
def index():
    samples = get_samples_for_day(datetime.now())
    return render_template('index.html', title='Live', samples=samples)
