from datetime import datetime
from app import db


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
    temperature = db.Column(db.Float, nullable=False)
    humidity = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime(), default=datetime.utcnow)

    def __hash__(self):
        return hash(self.date)

    def __repr__(self):
        return (f'<DHT #{self.id}.{self.station_id}: [{self.temperature}, '
                f'{self.humidity}, {self.date}]>')


def get_samples_for_day(date):
    day_start = f'{date.year}-{date.month}-{date.day} 00:00:00'
    day_end = f'{date.year}-{date.month}-{date.day} 23:59:59'
    return DHT.query.filter(DHT.date.between(day_start, day_end)).all()
