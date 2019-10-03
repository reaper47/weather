from flask import Blueprint

bp = Blueprint('main', __name__)

from app.live import routes  # noqa
