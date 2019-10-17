from dataclasses import dataclass


@dataclass
class Sample:
    station: int
    humidity: float
    temperature_c: float
    temperature_f: float
    heat_index_c: float
    heat_index_f: float
    date: str
