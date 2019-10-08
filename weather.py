from app import create_app, db, socketio
from app.models.sampling import Station, DHT
from werkzeug.serving import WSGIRequestHandler

app = create_app()


@app.shell_context_processor
def make_shell_context():
    return dict(db=db, Station=Station, DHT=DHT)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port='8090')
