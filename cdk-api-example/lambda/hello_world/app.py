import json

def lambda_handler(event, context):
    """
    Simple Lambda function that returns a greeting
    
    Parameters:
    - event: API Gateway event data
    - context: Lambda context
    
    Returns:
    - API Gateway response object with 200 status code and JSON body
    """
    # Extract query parameters if present
    query_params = event.get("queryStringParameters", {}) or {}
    name = query_params.get("name", "World")
    
    # Prepare response body
    body = {
        "message": f"Hello, {name}!",
        "timestamp": context.get_remaining_time_in_millis(),
        "request_id": context.aws_request_id
    }
    
    # Return formatted response
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(body)
    }