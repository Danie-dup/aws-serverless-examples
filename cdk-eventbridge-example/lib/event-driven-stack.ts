import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export class EventDrivenStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB table to store events
    const eventTable = new dynamodb.Table(this, 'EventsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT for production
      pointInTimeRecovery: true,
      timeToLiveAttribute: 'ttl',
    });
    
    // Add GSI for efficient querying
    eventTable.addGlobalSecondaryIndex({
      indexName: 'EventTypeIndex',
      partitionKey: { name: 'eventType', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Lambda function to process events
    const orderProcessor = new lambda.Function(this, 'OrderProcessorFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          console.log('Received event:', JSON.stringify(event, null, 2));
          
          // Extract order details from event
          const { detail } = event;
          
          // Process the order
          console.log(\`Processing order: \${detail.orderId}\`);
          
          // Return response
          return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Order processed successfully' }),
          };
        };
      `),
      tracing: lambda.Tracing.ACTIVE,
    });
    
    // Grant the Lambda function permission to write to DynamoDB
    eventTable.grantWriteData(orderProcessor);

    // Create EventBridge rule
    const orderPlacedRule = new events.Rule(this, 'OrderPlacedRule', {
      description: 'Rule for order placed events',
      eventPattern: {
        source: ['custom.myapp'],
        detailType: ['order_placed'],
        detail: {
          status: ['PLACED'],
        },
      },
    });
    
    // Add Lambda as target for the rule
    orderPlacedRule.addTarget(new targets.LambdaFunction(orderProcessor));

    // Function to publish events to EventBridge
    const eventPublisher = new lambda.Function(this, 'EventPublisherFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        const { EventBridgeClient, PutEventsCommand } = require('@aws-sdk/client-eventbridge');
        const eventBridge = new EventBridgeClient();
        
        exports.handler = async (event) => {
          try {
            const orderId = event.orderId || 'ORDER-' + Math.floor(Math.random() * 10000);
            
            const params = {
              Entries: [
                {
                  Source: 'custom.myapp',
                  DetailType: 'order_placed',
                  Detail: JSON.stringify({
                    orderId: orderId,
                    status: 'PLACED',
                    customer: event.customer || 'test-customer',
                    items: event.items || [{ id: 'item-1', quantity: 1 }],
                    timestamp: new Date().toISOString(),
                  }),
                },
              ],
            };
        
            const command = new PutEventsCommand(params);
            const response = await eventBridge.send(command);
            
            return {
              statusCode: 200,
              body: JSON.stringify({ message: 'Event published', eventId: response.Entries[0].EventId }),
            };
          } catch (error) {
            console.error('Error publishing event:', error);
            return {
              statusCode: 500,
              body: JSON.stringify({ message: 'Error publishing event', error: error.message }),
            };
          }
        };
      `),
    });
    
    // Grant permission to publish to EventBridge
    eventPublisher.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['events:PutEvents'],
        resources: ['*'], // Scope this down for production
      })
    );

    // Outputs
    new cdk.CfnOutput(this, 'EventsTableName', {
      value: eventTable.tableName,
      description: 'The name of the DynamoDB table where events are stored',
    });
    
    new cdk.CfnOutput(this, 'EventPublisherFunctionName', {
      value: eventPublisher.functionName,
      description: 'Function name of the event publisher Lambda',
    });
    
    new cdk.CfnOutput(this, 'OrderProcessorFunctionName', {
      value: orderProcessor.functionName,
      description: 'Function name of the order processor Lambda',
    });
  }
}