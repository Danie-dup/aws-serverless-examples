# CDK Serverless API Example

This example demonstrates how to build a serverless REST API using AWS CDK (Cloud Development Kit) with TypeScript. The architecture consists of API Gateway and Lambda function.

## Architecture

The following AWS resources are created:

- **API Gateway REST API** with CORS enabled
- **Lambda Function** in Python 3.9 with X-Ray tracing
- **CloudWatch Logs** with one week retention
- **IAM Roles** and permissions

## Prerequisites

- AWS CLI configured
- Node.js and npm
- AWS CDK Toolkit (`npm install -g aws-cdk`)
- TypeScript (`npm install -g typescript`)

## Project Structure

```
.
├── bin/
│   └── app.ts              # CDK app entry point
├── lib/
│   └── serverless-api-stack.ts  # Main stack definition
├── lambda/
│   └── hello_world/        # Lambda function code
│       └── app.py          # Python handler
├── cdk.json                # CDK configuration
├── package.json            # npm dependencies
└── tsconfig.json           # TypeScript configuration
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

4. After deployment, the API endpoint URL will be displayed in the outputs.

## Testing

You can test the API using curl or any API client:

```bash
# Get the API URL from the CDK outputs
API_URL=$(aws cloudformation describe-stacks --stack-name ServerlessApiStack --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" --output text)

# Test the API
curl $API_URL
curl "$API_URL?name=YourName"
```

## CDK Advantages for Serverless

Using CDK for serverless applications provides several advantages over SAM or CloudFormation:

1. **Type Safety**: TypeScript offers compile-time type checking, reducing runtime errors
2. **Abstraction Level**: Higher-level constructs simplify complex infrastructure
3. **Code Reuse**: Easily create reusable components and patterns
4. **Full Programming Language**: Utilize loops, conditionals, and functions in infrastructure code
5. **Testing**: Unit test your infrastructure code with Jest
6. **Custom Constructs**: Create your own abstractions for common patterns

## Cleanup

To avoid incurring charges, delete the stack when you're done:

```bash
cdk destroy
```