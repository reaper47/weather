import os
from typing import List
import pytest
from click.testing import CliRunner
import app.cli as cli

SUCCESS = 0


class FilesHelper:
    __slots__ = ['dirs', 'cwd', 'tmp', 'files']

    def __init__(self, dirs: List[str], files=[]):
        self.dirs = dirs + ['tmp']
        self.cwd = os.getcwd()
        self.tmp = f'{self.cwd}/tmp'
        self.files = [f'{self.tmp}/{f}' for f in files]

    def mk_dirs_and_files(self):
        for dir_ in self.dirs:
            if not os.path.isdir(dir_):
                os.mkdir(dir_)

        for f in self.files:
            if not os.path.exists(f):
                with open(f, 'w'):
                    pass

        assert self.are_dirs_and_files()

    def are_dirs_and_files(self):
        for dir_ in self.dirs:
            if os.path.isdir(dir_) and dir_ != 'tmp':
                return True
        return os.listdir(self.tmp)


@pytest.fixture
def runner():
    return CliRunner()


def test_lint(runner):
    """
    WHEN invoking lint
    THEN lint all files
    """
    result = runner.invoke(cli.lint)

    assert SUCCESS == result.exit_code


def test_lint_failure():
    """
    GIVEN a Python file with lint errors
    WHEN lint is invoked
    THEN raise an error
    """
    cwd = os.getcwd()
    fname = 'wrong.py'
    path = f'{cwd}/{fname}'
    with open(path, 'w') as f:
        f.write("def g(): print('s');\n\n\n")

    with pytest.raises(RuntimeError):
        cli.execute(['flake8 --statistics'], 'lint')

    os.remove(path)


def are_files_correct(exit_code: int, helper: FilesHelper) -> bool:
    assert exit_code == SUCCESS
    assert not helper.are_dirs_and_files()
    os.rmdir(f'{helper.cwd}/tmp')
    return True


def test_all(runner):
    """
    GIVEN the following directories and files:
        - build/
        - dist/
        - .eggs/
        - __pycache__
        - htmlcov/
        - .tox/
        - tmp/test.egg
        - tmp/test.egg-info
        - tmp/test.pyc
        - tmp/test.pyo
        - tmp/test.~
    WHEN clean all is invoked
    THEN delete all the aforementionned files and folders
    """
    helper = FilesHelper(dirs=['build', 'dist', '__pycache__', 'htmlcov', '.tox', '.eggs'],
                         files=['test.egg', 'test.egg-info', 'test.pyc', 'test.pyo', 'test.~'])
    helper.mk_dirs_and_files()

    result = runner.invoke(cli.all)

    assert are_files_correct(result.exit_code, helper)


def test_build(runner):
    """
    GIVEN the following directories and files:
        - build/
        - dist/
        - .eggs/
        - tmp/test.egg-info
        - tmp/test.egg
    WHEN clean build is invoked
    THEN delete all the aforementionned files and directories
    """
    helper = FilesHelper(dirs=['build', 'dist', '.eggs'], files=['test.egg-info', 'test.egg'])
    helper.mk_dirs_and_files()

    result = runner.invoke(cli.build)

    assert are_files_correct(result.exit_code, helper)


def test_pyc(runner):
    """
    GIVEN the following directories and files:
        - __pycache__/
        - tmp/test.pyc
        - tmp/test.pyo
        - tmp/test.~
    WHEN clean pyc is invoked
    THEN delete all aforementionned files and directories
    """
    helper = FilesHelper(dirs=['__pycache__'], files=['test.pyc', 'test.pyo', 'test.~'])
    helper.mk_dirs_and_files()

    result = runner.invoke(cli.pyc)

    assert are_files_correct(result.exit_code, helper)


def test_tests(runner):
    """
    GIVEN the following directories:
        - .tox/
        - htmlcov/
    WHEN clean tests is invoked
    THEN delete all aforementionned directories
    """
    helper = FilesHelper(dirs=['.tox', 'htmlcov'])
    helper.mk_dirs_and_files()

    result = runner.invoke(cli.tests)

    assert are_files_correct(result.exit_code, helper)
