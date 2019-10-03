from unittest import mock

MOCK_GET_SAMPLES_FOR_DAY = 'app.live.routes.get_samples_for_day'


"""
INDEX TESTS
"""


@mock.patch(MOCK_GET_SAMPLES_FOR_DAY)
def test_send_current_samples_to_template(mock_get_samples, test_client):
    """
    WHEN a user requests the Live module
    THEN the function fetching the samples in the db is called
    """
    mock_get_samples.return_value = []
    test_client.get(f'/')

    assert mock_get_samples.called
