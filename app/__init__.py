import importlib
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_assets import Environment
from flask_socketio import SocketIO
from config import config

db = SQLAlchemy()
migrate = Migrate()
assets = Environment()
socketio = SocketIO()


def create_app(config_name='default'):
    app = Flask(__name__, static_url_path='')
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    __register_extensions(app, [db, assets, socketio])
    __register_blueprints(app, ['live'])

    from app.utils.assets import bundles
    assets.register('main_css', bundles['main_css'])
    assets.register('main_js', bundles['main_js'])

    from app.cli import test, coverage, clean, lint
    app.cli.add_command(test)
    app.cli.add_command(coverage)
    app.cli.add_command(clean)
    app.cli.add_command(lint)

    return app


def __register_extensions(app, extensions):
    for extension in extensions:
        extension.init_app(app)
    migrate.init_app(app, db)


def __register_blueprints(app, modules):
    for module in modules:
        bp = getattr(importlib.import_module(f'app.{module}'), 'bp')
        app.register_blueprint(bp)
