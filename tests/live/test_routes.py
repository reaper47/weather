from unittest import mock
from tests.conftest import A_JSON_SAMPLE

MOCK_REQUEST = 'app.live.routes.request'
MOCK_GET_SAMPLES_FOR_DAY = 'app.live.routes.get_samples_for_day'
MOCK_ADD_NEW_SAMPLE = 'app.live.routes.add_new_sample'
MOCK_SOCKETIO_EMIT = 'app.live.routes.socketio'


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


@mock.patch(MOCK_REQUEST)
@mock.patch(MOCK_ADD_NEW_SAMPLE)
def test_newsample_add_new_sample_called(mock_add_new_sample, mock_request, test_client):
    """
    WHEN posting sensor data to newsample
    THEN the json sample received is added to the db
    """
    test_client.post('/newsample', data=A_JSON_SAMPLE, content_type='application/json')

    assert mock_add_new_sample.called


@mock.patch(MOCK_REQUEST)
@mock.patch(MOCK_ADD_NEW_SAMPLE)
@mock.patch(MOCK_SOCKETIO_EMIT)
def test_newsample_send_message(mock_socketio, mock_add_new_sample, mock_request, test_client):
    """
    WHEN posting sensor data to newsample
    THEN a SocketIO message is sent to the client
    """
    mock_add_new_sample.return_value = []
    test_client.post('/newsample', data=A_JSON_SAMPLE, content_type='application/json')

    assert mock_socketio.emit.called


def test_show_NA_sensor_data_on_page_load_no_data(test_client, init_database):
    """
    GIVEN no samples in the database
    WHEN a user load the live weather page
    THEN minuses
    """
    response = test_client.get('/', follow_redirects=True)
    data = response.get_data(as_text=True)

    assert response.status_code == 200
    assert 'N/A' in data
