import os
from typing import List
from flask.cli import with_appcontext
import click

COV_BADGE = './tests/.caverage.svg'


def execute(commands: List[str], name: str):
    for command in commands:
        if os.system(command):
            raise RuntimeError(f'{name} command failed')


@click.command()
@with_appcontext
def test():
    """Execute all tests."""
    # add --ignore=tests/__init__.py later
    execute(['pytest -vv --cov=.'], 'test all')
    commands = ['pip install alembic cssmin flask-assets jsmin mysqlclient sqlalchemy webassets']
    execute(commands, 'pip install removed packages')


@click.command()
@with_appcontext
def coverage():
    """Generate the test coverage files under '/htmlcov/index.html'."""
    commands = ['pytest -vv --cov=. --cov-report=html',
                f'rm -f {COV_BADGE}',
                f'coverage-badge -o {COV_BADGE}']

    execute(commands, 'test coverage')


@click.command()
@with_appcontext
def lint():
    """Lint all Python files with Flake8."""
    ignore = '--ignore=E402,W504'
    exclude = '--exclude=venv*'
    execute([f'flake8 {exclude} --statistics {ignore}'], 'lint')


@click.group()
@with_appcontext
def clean():
    """Cleaning commands to remove junk."""
    pass


@clean.command()
@with_appcontext
def all():
    """Remove all the junk."""
    commands = ["rm -fr build/",
                "rm -fr dist/",
                "rm -fr .eggs/",
                "find . -name '*.egg-info' -exec rm -fr {} +",
                "find . -name '*.egg' -exec rm -f {} +",
                "find . -name '*.pyc' -exec rm -f {} +",
                "find . -name '*.pyo' -exec rm -f {} +",
                "find . -name '*~' -exec rm -f {} +",
                "find . -name '__pycache__' -exec rm -fr {} +",
                "rm -rf .tox/",
                "rm -rf .coverage",
                "rm -rf htmlcov/"]

    execute(commands, 'clean all')


@clean.command()
@with_appcontext
def build():
    """Clean the build."""
    commands = ['rm -fr build/', 'rm -fr dist/', 'rm -fr .eggs/',
                "find . -name '*.egg-info' -exec rm -fr {} +",
                "find . -name '*.egg' -exec rm -f {} +"]

    execute(commands, 'clean build')


@clean.command()
@with_appcontext
def pyc():
    """Remove Python's compiled bytecode."""
    commands = ["find . -name '*.pyc' -exec rm -f {} +",
                "find . -name '*.pyo' -exec rm -f {} +",
                "find . -name '*~' -exec rm -f {} +",
                "find . -name '__pycache__' -exec rm -fr {} +"]

    execute(commands, 'clean pyc')


@clean.command()
@with_appcontext
def tests():
    """Remove files related to tests."""
    commands = ['rm -fr .tox/', 'rm -f .coverage', 'rm -fr htmlcov/']
    execute(commands, 'clean test')
