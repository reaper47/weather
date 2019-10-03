from app import db


def commit(obj):
    if isinstance(obj, list):
        db.session.add_all(obj)
    else:
        db.session.add(obj)
    db.session.commit()
