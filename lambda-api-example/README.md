# Lambda-API Example

This example demonstrates a simple REST API built with Amazon API Gateway and AWS Lambda.

## Architecture

![Architecture Diagram](architecture.png)

- **API Gateway**: Exposes a REST API endpoint at `/hello`
- **Lambda Function**: Python function that returns a greeting
- **CloudWatch Logs**: Automatic logging for both API Gateway and Lambda

## Deployment

Deploy using the AWS Serverless Application Model (SAM) CLI:

```bash
# Build the application
sam build

# Deploy to AWS (first time)
sam deploy --guided

# Subsequent deployments
sam deploy
```

## Testing

After deployment, you can test the API using:

```bash
# Get the API URL from the outputs
API_URL=$(aws cloudformation describe-stacks --stack-name lambda-api-example --query "Stacks[0].Outputs[?OutputKey=='HelloWorldApi'].OutputValue" --output text)

# Test the API
curl $API_URL
curl "$API_URL?name=YourName"
```

## Key Learning Points

- **API Gateway Integration**: Lambda proxy integration pattern
- **Query Parameter Handling**: Extracting and using query parameters
- **Error Handling**: Best practices for Lambda error management
- **CloudFormation/SAM**: Infrastructure as Code for serverless applications