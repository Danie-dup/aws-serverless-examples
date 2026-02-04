# Event-Driven Architecture with AWS CDK

This example demonstrates how to implement an event-driven architecture using AWS CDK, EventBridge, Lambda, and DynamoDB.

## Architecture Overview

![Architecture Diagram](architecture.png)

The architecture includes:

1. **Event Publisher Lambda**: Publishes events to EventBridge
2. **EventBridge Rule**: Routes events based on pattern matching
3. **Event Processor Lambda**: Processes the events
4. **DynamoDB Table**: Stores event data with advanced querying capabilities

## Features

- **Fully typed infrastructure** with TypeScript
- **Serverless event processing** using Lambda functions
- **Scalable event routing** with EventBridge
- **Persistent event storage** using DynamoDB
- **GSI for efficient queries** by event type and timestamp
- **X-Ray tracing** for observability

## CDK Constructs Used

- `events.Rule`: For EventBridge rule creation
- `events.EventPattern`: For defining event matching criteria
- `lambda.Function`: For serverless compute
- `dynamodb.Table`: For persistent storage
- `iam.PolicyStatement`: For fine-grained permissions

## Event Pattern

The EventBridge rule is configured to match events with this pattern:

```json
{
  "source": ["custom.myapp"],
  "detail-type": ["order_placed"],
  "detail": {
    "status": ["PLACED"]
  }
}
```

## Deployment

1. Install dependencies:

```bash
npm install
```

2. Build the TypeScript code:

```bash
npm run build
```

3. Deploy the stack:

```bash
cdk deploy
```

## Testing

After deployment, you can invoke the Event Publisher Lambda to publish a test event:

```bash
# Get the function name
PUBLISHER_FUNCTION=$(aws cloudformation describe-stacks --stack-name EventDrivenStack --query "Stacks[0].Outputs[?OutputKey=='EventPublisherFunctionName'].OutputValue" --output text)

# Invoke the function with a test payload
aws lambda invoke \
  --function-name $PUBLISHER_FUNCTION \
  --payload '{"orderId":"TEST-1234","customer":"John Doe","items":[{"id":"product-123","quantity":2}]}' \
  response.json

# Check the response
cat response.json

# You can also check the logs of the processor function
PROCESSOR_FUNCTION=$(aws cloudformation describe-stacks --stack-name EventDrivenStack --query "Stacks[0].Outputs[?OutputKey=='OrderProcessorFunctionName'].OutputValue" --output text)
aws logs describe-log-streams --log-group-name "/aws/lambda/$PROCESSOR_FUNCTION" --order-by LastEventTime --descending --limit 1
```

## Benefits of CDK for Event-Driven Architecture

1. **Type Safety**: Detect issues at compile time rather than deployment time
2. **Infrastructure as Code**: Version control and collaborate on infrastructure
3. **Code Reuse**: Create reusable event patterns and processing logic
4. **Testing**: Write unit tests for your infrastructure
5. **Developer Experience**: Use your favorite IDE and tooling

## Best Practices Implemented

- **Decoupling**: Producers and consumers are fully decoupled
- **Single Responsibility**: Each Lambda performs a specific task
- **Observability**: X-Ray tracing and CloudWatch logs
- **Error Handling**: DLQ pattern can be easily added
- **IAM Least Privilege**: Fine-grained permissions for resources

## Cleanup

```bash
cdk destroy
```