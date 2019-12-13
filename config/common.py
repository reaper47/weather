import os
from pathlib import Path
from dotenv import load_dotenv

base_dir = Path(__file__).resolve().parent.parent


class Config:
    load_dotenv(f'{base_dir}/.env')
    SECRET_KEY = os.environ.get('SECRET_KEY', 'you-will-never-guess')

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_RECORD_QUERIES = True

    @staticmethod
    def init_app(app):
        pass
