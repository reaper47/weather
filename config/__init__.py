from config.development import DevelopmentConfig
from config.testing import TestingConfig
from config.production import ProductionConfig

config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
