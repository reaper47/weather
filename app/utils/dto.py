from dataclasses import dataclass


@dataclass
class DHT_Dto:
    station_id: int
    humidity: float
    t_c: float
    t_f: float
    hi_c: float
    hi_f: float


@dataclass
class DS18B20_Dto:
    t_c: float
    t_f: float


@dataclass
class FC37_Dto:
    rain: str


@dataclass
class TEMT6000_Dto:
    lux: int


@dataclass
class BME280_Dto:
    t_c: float
    t_f: float
    humidity: float
    pa: float
    kpa: float
    mb: int


@dataclass
class Averages_Dto:
    t_c: float
    t_f: float


@dataclass
class Wind_Dto:
    ms: float
    kmph: float
    mph: float


@dataclass
class Sample:
    dht: DHT_Dto
    ds18b20: DS18B20_Dto
    fc37: FC37_Dto
    temt6000: TEMT6000_Dto
    bme280: BME280_Dto
    wind: Wind_Dto
    averages: Averages_Dto
    date: str
