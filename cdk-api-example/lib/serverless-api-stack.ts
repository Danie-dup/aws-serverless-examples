import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as path from 'path';

export class ServerlessApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Lambda function
    const helloFunction = new lambda.Function(this, 'HelloWorldFunction', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'app.lambda_handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/hello_world')),
      memorySize: 128,
      timeout: cdk.Duration.seconds(3),
      logRetention: logs.RetentionDays.ONE_WEEK,
      environment: {
        // Add environment variables if needed
        ENVIRONMENT: 'production'
      },
      tracing: lambda.Tracing.ACTIVE, // Enable X-Ray tracing
    });
    
    // Create API Gateway
    const api = new apigw.RestApi(this, 'HelloWorldApi', {
      description: 'Example API Gateway for Hello World function',
      deployOptions: {
        stageName: 'prod',
        metricsEnabled: true,
        loggingLevel: apigw.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
      }
    });
    
    // Add Lambda integration to API Gateway
    const helloIntegration = new apigw.LambdaIntegration(helloFunction, {
      proxy: true,
      // Advanced options
      requestTemplates: {
        'application/json': JSON.stringify({ 
          statusCode: 200 
        })
      }
    });
    
    // Add resource and method
    const helloResource = api.root.addResource('hello');
    helloResource.addMethod('GET', helloIntegration, {
      apiKeyRequired: false,
      methodResponses: [
        {
          statusCode: '200',
          responseModels: {
            'application/json': apigw.Model.EMPTY_MODEL,
          },
        }
      ]
    });
    
    // Create outputs
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: `${api.url}hello`,
      description: 'The endpoint URL of the API Gateway',
      exportName: 'HelloWorldApiEndpoint'
    });
    
    new cdk.CfnOutput(this, 'FunctionArn', {
      value: helloFunction.functionArn,
      description: 'The ARN of the Lambda function',
      exportName: 'HelloWorldFunctionArn'
    });
  }
}