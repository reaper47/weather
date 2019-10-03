from app import create_app, db
from app.models.sampling import Station, DHT

app = create_app()


@app.shell_context_processor
def make_shell_context():
    return dict(db=db, Station=Station, DHT=DHT)
