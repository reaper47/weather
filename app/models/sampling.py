import math
from datetime import datetime
from app import db
from app.utils.database import commit
from app.utils.dto import Sample
from sqlalchemy.schema import UniqueConstraint


class Station(db.Model):
    __tablename__ = 'station'

    id = db.Column(db.Integer, primary_key=True)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)
    name = db.Column(db.String(length=50), nullable=False)

    def __eq__(self, other):
        return (self.lat == other.lat and
                self.lng == other.lng and
                self.name == other.name)

    def __hash__(self):
        return hash(self.name)

    def __repr__(self):
        return f'<Station #{self.id} ({self.name}): [{self.lat}, {self.lng}]>'


class Temperature(db.Model):
    __tablename__ = 'temperature'

    id = db.Column(db.Integer, primary_key=True)
    celsius = db.Column(db.Float, nullable=False)
    fahrenheit = db.Column(db.Float, nullable=False)
    __table_args__ = (UniqueConstraint('celsius', 'fahrenheit', name='unique_temperature'),)

    def __init__(self, celsius, fahrenheit):
        self.celsius = celsius
        self.fahrenheit = fahrenheit

    def __eq__(self, other):
        celsius_result = math.fabs(self.celsius - other.celsius)
        fahrenheit_result = math.fabs(self.fahrenheit - other.fahrenheit)
        return celsius_result <= 0.001 and fahrenheit_result <= 0.001

    def __hash__(self):
        return hash(self.celsius)

    def __repr__(self):
        return f'<Temperature #{self.id}: [{self.celsius},{self.fahrenheit}]>'


class HeatIndex(db.Model):
    __tablename__ = 'heat_index'

    id = db.Column(db.Integer, primary_key=True)
    celsius = db.Column(db.Float, nullable=False)
    fahrenheit = db.Column(db.Float, nullable=False)
    __table_args__ = (UniqueConstraint('celsius', 'fahrenheit', name='unique_heat_index'),)

    def __init__(self, celsius, fahrenheit):
        self.celsius = celsius
        self.fahrenheit = fahrenheit

    def __eq__(self, other):
        celsius_result = math.fabs(self.celsius - other.celsius)
        fahrenheit_result = math.fabs(self.fahrenheit - other.fahrenheit)
        return celsius_result <= 0.001 and fahrenheit_result <= 0.001

    def __hash__(self):
        return hash(self.celsius)

    def __repr__(self):
        return f'<Heat Index #{self.id}: [{self.celsius},{self.fahrenheit}]>'


class Pressure(db.Model):
    __tablename__ = 'pressure'

    id = db.Column(db.Integer, primary_key=True)
    pascal = db.Column(db.Float, nullable=False)
    kilopascal = db.Column(db.Float, nullable=False)
    mbar = db.Column(db.Integer, nullable=False)
    __table_args__ = (UniqueConstraint('pascal', 'kilopascal', 'mbar', name='unique_pressure'),)

    def __init__(self, pa, kpa, mb):
        self.pascal = pa
        self.kilopascal = kpa
        self.mbar = mb

    def __eq__(self, other):
        pascal_result = math.fabs(self.pascal - other.pascal)
        kilopascal_result = math.fabs(self.kilopascal - other.kilopascal)
        return pascal_result <= 0.001 and kilopascal_result <= 0.001 and self.mbar == other.mbar

    def __hash__(self):
        return hash(self.pascal)

    def __repr__(self):
        return f'<Pressure #{self.id}: [{self.pascal},{self.kilopascal},{self.mbar}]'


class DHT(db.Model):
    __tablename__ = 'dht'

    id = db.Column(db.Integer, primary_key=True)
    station_id = db.Column(db.Integer, db.ForeignKey('station.id'))
    station = db.relationship('Station', backref='dht_station', uselist=False)
    temperature_id = db.Column(db.Integer, db.ForeignKey('temperature.id'))
    temperature = db.relationship('Temperature', backref='dht_temperature', uselist=False)
    humidity = db.Column(db.Float, nullable=False)
    heat_index_id = db.Column(db.Integer, db.ForeignKey('heat_index.id'))
    heat_index = db.relationship('HeatIndex', backref='dht_heat_index', uselist=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)

    def __eq__(self, other):
        return (self.station == other.station and
                self.temperature == other.temperature and
                self.humidity == other.humidity and
                self.heat_index == other.heat_index and
                str(self.date) == str(other.date))

    def __hash__(self):
        return hash(self.date)

    def __repr__(self):
        return (f'<DHT #{self.id}.{self.station_id} -\n'
                f'  Temperature: {self.temperature}\n'
                f'  RH: {self.humidity}\n'
                f'  HI: {self.heat_index}\n'
                f'  Date: {self.date}>')


class DS18B20(db.Model):
    __tablename__ = 'ds18b20'

    id = db.Column(db.Integer, primary_key=True)
    temperature_id = db.Column(db.Integer, db.ForeignKey('temperature.id'))
    temperature = db.relationship('Temperature', backref='ds18b20_temperature', uselist=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)

    def __eq__(self, other):
        return (self.temperature == other.temperature and
                str(self.date) == str(other.date))

    def __hash__(self):
        return hash(self.date)

    def __repr__(self):
        return (f'<DS18B20 #{self.id} -\n'
                f'  Temperature: {self.temperature}\n'
                f'  Date: {self.date}>')


class FC37(db.Model):
    __tablename__ = 'fc37'

    id = db.Column(db.Integer, primary_key=True)
    rain = db.Column(db.CHAR(length=1), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)

    def __eq__(self, other):
        return (self.rain == other.rain and
                str(self.date) == str(other.date))

    def __hash__(self):
        return hash(self.date)

    def __repr__(self):
        return (f'<FC37 #{self.id} -\n'
                f'  Rain: {self.rain}\n'
                f'  Date: {self.date}>')


class TEMT6000(db.Model):
    __tablename__ = 'temt6000'

    id = db.Column(db.Integer, primary_key=True)
    lux = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)

    def __eq__(self, other):
        return (self.lux == other.lux and
                str(self.date) == str(other.date))

    def __hash__(self):
        return hash(self.date)

    def __repr__(self):
        return (f'<TEMT6000 #{self.id} -\n'
                f'  Lux: {self.lux}\n'
                f'  Date: {self.date}>')


class BME280(db.Model):
    __tablename__ = 'bme280'

    id = db.Column(db.Integer, primary_key=True)
    temperature_id = db.Column(db.Integer, db.ForeignKey('temperature.id'))
    temperature = db.relationship('Temperature', backref='bme280_temperature', uselist=False)
    humidity = db.Column(db.Float, nullable=False)
    pressure_id = db.Column(db.Integer, db.ForeignKey('pressure.id'))
    pressure = db.relationship('Pressure', backref='bme280_pressure', uselist=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)

    def __eq__(self, other):
        return (self.temperature == other.temperature and
                (self.humidity - other.humidity) <= 0.001 and
                self.pressure == other.pressure and
                str(self.date) == str(other.date))

    def __hash__(self):
        return hash(self.date)

    def __repr__(self):
        return (f'<BME280 #{self.id} -\n'
                f'  Temperature: {self.temperature}\n'
                f'  Humidity: {self.humidity}\n'
                f'  Pressure: {self.pressure}\n'
                f'  Date: {self.date}>')


class Wind(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ms = db.Column(db.Float, nullable=False)
    kmph = db.Column(db.Float, nullable=False)
    mph = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)

    def __eq__(self, other):
        return ((self.ms - other.ms) <= 0.001 and
                (self.kmph - other.kmph) <= 0.001 and
                (self.mph - other.mph) <= 0.001 and
                str(self.date) == str(other.date))

    def __hash__(self):
        return hash(self.date)

    def __repr__(self):
        return (f'<Wind #{self.id} -\n'
                f'  m/s: {self.ms}\n'
                f'  km/h: {self.kmph}\n'
                f'  mph: {self.mph}>')


class Averages(db.Model):
    __tablename__ = 'averages'

    id = db.Column(db.Integer, primary_key=True)
    temperature_id = db.Column(db.Integer, db.ForeignKey('temperature.id'))
    temperature = db.relationship('Temperature', backref='averages_temperature', uselist=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)


def get_samples_for_day(date):
    day_start = f'{date.year}-{date.month}-{date.day} 00:00:00'
    day_end = f'{date.year}-{date.month}-{date.day} 23:59:59'

    data = {
        'DHT': {'T_C': [], 'T_F': [], 'HI_C': [], 'HI_F': [], 'RH': []},
        'DS18B20': {'T_C': [], 'T_F': []},
        'FC37': {'Rain': []},
        'TEMT6000': {'Light': []},
        'BME280': {'T_C': [], 'T_F': [], 'RH': [], 'P_Pa': [], 'P_kPa': [], 'P_mb': []},
        'Wind': {'ms': [], 'kmph': [], 'mph': []},
        'Averages': {'T_C': [], 'T_F': []},
        'dates': []
    }

    samples = DHT.query.filter(DHT.date.between(day_start, day_end)).all()
    data['dates'] = [str(x.date) for x in samples]
    data['DHT']['T_C'] = [x.temperature.celsius for x in samples]
    data['DHT']['T_F'] = [x.temperature.fahrenheit for x in samples]
    data['DHT']['HI_C'] = [x.heat_index.celsius for x in samples]
    data['DHT']['HI_F'] = [x.heat_index.fahrenheit for x in samples]
    data['DHT']['RH'] = [x.humidity for x in samples]

    samples = DS18B20.query.filter(DS18B20.date.between(day_start, day_end)).all()
    data['DS18B20']['T_C'] = [x.temperature.celsius for x in samples]
    data['DS18B20']['T_F'] = [x.temperature.fahrenheit for x in samples]

    map_rain = {'N': 0, 'L': 1, 'M': 2, 'H': 3}
    samples = FC37.query.filter(FC37.date.between(day_start, day_end)).all()
    data['FC37']['Rain'] = [map_rain[x.rain] for x in samples]

    samples = TEMT6000.query.filter(TEMT6000.date.between(day_start, day_end)).all()
    data['TEMT6000']['Light'] = [x.lux for x in samples]

    samples = BME280.query.filter(BME280.date.between(day_start, day_end)).all()
    data['BME280']['T_C'] = [x.temperature.celsius for x in samples]
    data['BME280']['T_F'] = [x.temperature.fahrenheit for x in samples]
    data['BME280']['RH'] = [x.humidity for x in samples]
    data['BME280']['P'] = [x.pressure.pascal for x in samples]
    data['BME280']['P_kPa'] = [x.pressure.kilopascal for x in samples]
    data['BME280']['P_mb'] = [x.pressure.mbar for x in samples]

    samples = Wind.query.filter(Wind.date.between(day_start, day_end)).all()
    data['Wind']['ms'] = [x.ms for x in samples]
    data['Wind']['kmph'] = [x.kmph for x in samples]
    data['Wind']['mph'] = [x.mph for x in samples]

    samples = Averages.query.filter(Averages.date.between(day_start, day_end)).all()
    data['Averages']['T_C'] = [x.temperature.celsius for x in samples]
    data['Averages']['T_F'] = [x.temperature.fahrenheit for x in samples]

    return data


def add_new_sample(sample: Sample):
    t = find_temperature(Temperature, sample.dht.t_c, sample.dht.t_f)
    hi = find_temperature(HeatIndex, sample.dht.hi_c, sample.dht.hi_f)
    station = Station.query.filter_by(id=sample.dht.station_id).first()
    dht = DHT(station=station, temperature=t, heat_index=hi, humidity=sample.dht.humidity, date=sample.date)

    t = find_temperature(Temperature, sample.ds18b20.t_c, sample.ds18b20.t_f)
    ds18b20 = DS18B20(temperature=t, date=sample.date)

    fc37 = FC37(rain=sample.fc37.rain, date=sample.date)
    temt6000 = TEMT6000(lux=sample.temt6000.lux, date=sample.date)

    t = find_temperature(Temperature, sample.bme280.t_c, sample.bme280.t_f)
    p = find_pressure(sample.bme280.pa, sample.bme280.kpa, sample.bme280.mb)
    bme280 = BME280(temperature=t, humidity=sample.bme280.humidity, pressure=p, date=sample.date)

    wind = Wind(ms=sample.wind.ms, kmph=sample.wind.kmph, mph=sample.wind.mph, date=sample.date)

    t = find_temperature(Temperature, sample.averages.t_c, sample.averages.t_f)
    averages = Averages(temperature=t, date=sample.date)

    commit([dht, ds18b20, fc37, temt6000, bme280, wind, averages])


def find_temperature(Entity, celsius, fahrenheit):
    for x in Entity.query.all():
        if x == Entity(celsius, fahrenheit):
            entry = x
            break
    else:
        entry = None

    if entry is None:
        entry = Entity(celsius, fahrenheit)
        commit(entry)
    return entry


def find_pressure(pascal, kilopascal, mbar):
    for x in Pressure.query.all():
        if x == Pressure(pascal, kilopascal, mbar):
            entry = x
            break
    else:
        entry = None

    if entry is None:
        entry = Pressure(pascal, kilopascal, mbar)
        commit(entry)
    return entry
