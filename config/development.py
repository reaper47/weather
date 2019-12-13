import os
from config.common import Config, base_dir


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URI', f'sqlite:///{base_dir}/data-dev.sqlite')
