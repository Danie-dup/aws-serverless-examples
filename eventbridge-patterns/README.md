# Serverless EventBridge Integration

This example demonstrates how to use Amazon EventBridge to build event-driven serverless architectures.

## Architecture Overview

1. EventBridge receives events from various sources
2. Rules match events and route them to targets
3. Lambda functions process the events accordingly
4. DynamoDB stores the event data for historical analysis

## Event Pattern

```json
{
  "source": ["custom.myapp"],
  "detail-type": ["order_placed"],
  "detail": {
    "status": ["PLACED"]
  }
}
```

## Benefits

- Loose coupling between service components
- Easier to add new event consumers without modifying producers
- Simple integration with AWS services and custom applications
- Support for cross-account event routing

## Related Services

- **EventBridge Pipes**: For point-to-point integrations with transformation
- **Step Functions**: For complex workflows triggered by events
- **SQS Dead Letter Queues**: For handling failed event processing