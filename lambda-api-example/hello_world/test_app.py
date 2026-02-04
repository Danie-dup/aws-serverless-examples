import json
import pytest
import app

# Mock Lambda context object
class MockContext:
    def __init__(self):
        self.aws_request_id = "test-request-id"
    
    def get_remaining_time_in_millis(self):
        return 10000

@pytest.fixture
def lambda_context():
    return MockContext()

def test_lambda_handler_default_name(lambda_context):
    # Test with no query parameters
    event = {"queryStringParameters": None}
    response = app.lambda_handler(event, lambda_context)
    
    assert response["statusCode"] == 200
    body = json.loads(response["body"])
    assert body["message"] == "Hello, World!"
    assert "timestamp" in body
    assert body["request_id"] == "test-request-id"

def test_lambda_handler_custom_name(lambda_context):
    # Test with name parameter
    event = {"queryStringParameters": {"name": "Alice"}}
    response = app.lambda_handler(event, lambda_context)
    
    assert response["statusCode"] == 200
    body = json.loads(response["body"])
    assert body["message"] == "Hello, Alice!"
    assert "timestamp" in body
    assert body["request_id"] == "test-request-id"