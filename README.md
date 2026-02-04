# AWS CDK Serverless Examples

This repository contains examples and patterns for AWS serverless architectures implemented using the AWS Cloud Development Kit (CDK), designed to help with preparation for the AWS Solutions Architect Professional certification and as a reference for serverless best practices.

## Contents

- **CDK API Example**: REST API using API Gateway and Lambda, implemented with CDK in TypeScript
- **CDK EventBridge Example**: Event-driven architecture with EventBridge, Lambda, and DynamoDB
- **Advanced Patterns**: Coming soon - CDK patterns for complex serverless architectures

## Why CDK?

AWS CDK offers significant advantages over SAM or raw CloudFormation:

1. **Full Programming Language Power**: Use TypeScript/JavaScript, Python, Java, C# or Go
2. **Type Safety**: Catch errors at compile time rather than deployment time
3. **Abstraction**: Higher-level constructs for common patterns
4. **Reusability**: Create your own reusable components
5. **Testing**: Unit test your infrastructure code
6. **IDE Support**: Auto-completion, refactoring, and inline documentation

## Getting Started

Each directory contains specific examples with their own README files explaining the architecture and deployment instructions.

## Certification Tips

This repository includes CDK implementations that align with the AWS Solutions Architect Professional certification exam objectives, focusing on:

- Event-driven architecture
- Serverless design patterns
- Microservices approaches
- API design and implementation
- High availability and fault tolerance patterns

## Prerequisites

- Node.js and npm
- AWS CDK Toolkit (`npm install -g aws-cdk`)
- AWS CLI configured with appropriate credentials
- TypeScript (`npm install -g typescript`) for TypeScript examples