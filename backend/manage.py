# manage.py
from flask.cli import FlaskGroup
from src import create_app, db

cli = FlaskGroup(create_app=create_app)

if __name__ == "__main__":
    cli()
