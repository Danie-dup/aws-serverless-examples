#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ServerlessApiStack } from '../lib/serverless-api-stack';

const app = new cdk.App();
new ServerlessApiStack(app, 'ServerlessApiStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION 
  },
  
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/tagging.html */
  tags: {
    Environment: 'Production',
    Project: 'ServerlessApiExample'
  }
});

// Advanced multi-stack deployment example:
// Uncomment to create a development environment stack
/*
new ServerlessApiStack(app, 'ServerlessApiStackDev', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION 
  },
  tags: {
    Environment: 'Development',
    Project: 'ServerlessApiExample'
  }
});
*/