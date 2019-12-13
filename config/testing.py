import os
from config.common import Config


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URI', 'sqlite://')
    WTF_CRSR_ENABLED = False
