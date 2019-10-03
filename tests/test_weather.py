from weather import make_shell_context


def test_shell_context():
    """
    WHEN making the shell context
    THEN return a dictionary of the db and the models
    """
    keys_expected = ['db', 'Station', 'DHT']

    context = make_shell_context()

    for key in context:
        assert key in keys_expected
