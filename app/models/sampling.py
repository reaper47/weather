from datetime import datetime
from app import db
from app.utils.database import commit
from app.utils.dto import Sample


class Station(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)
    name = db.Column(db.String(length=50), nullable=False)

    def __hash__(self):
        return hash(self.name)

    def __repr__(self):
        return f'<Station #{self.id} ({self.name}): [{self.lat}, {self.lng}]>'


class DHT(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    station_id = db.Column(db.Integer, db.ForeignKey('station.id'))
    station = db.relationship('Station', backref='dht_station', uselist=False)
    temperature_c = db.Column(db.Float, nullable=False)
    temperature_f = db.Column(db.Float, nullable=False)
    humidity = db.Column(db.Float, nullable=False)
    heat_index_c = db.Column(db.Float, nullable=False)
    heat_index_f = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime(), default=datetime.utcnow)

    def __hash__(self):
        return hash(self.date)

    def __repr__(self):
        return (f'<DHT #{self.id}.{self.station_id} -\n'
                f' Temperature: {self.temperature_c} ({self.temperature_f}) <>\n'
                f' RH: {self.humidity} <>\n'
                f' HI: {self.heat_index_c} ({self.heat_index_f}) <>\n'
                f' Date: {self.date}>')


def get_samples_for_day(date):
    day_start = f'{date.year}-{date.month}-{date.day} 00:00:00'
    day_end = f'{date.year}-{date.month}-{date.day} 23:59:59'
    return DHT.query.filter(DHT.date.between(day_start, day_end)).all()


def add_new_sample(sample: Sample):
    station = Station.query.filter_by(id=sample.station).first()
    dht = DHT(station=station, temperature_c=sample.temperature_c, temperature_f=sample.temperature_f,
              heat_index_c=sample.heat_index_c, heat_index_f=sample.heat_index_f, humidity=sample.humidity,
              date=sample.date)
    commit(dht)
