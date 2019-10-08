from dataclasses import dataclass


@dataclass
class Sample:
    station: int
    temperature: float
    humidity: float
    date: str
