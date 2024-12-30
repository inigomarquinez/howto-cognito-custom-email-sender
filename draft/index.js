import {
  CognitoIdentityProviderClient,
  DescribeUserPoolCommand,
  UpdateUserPoolCommand
} from '@aws-sdk/client-cognito-identity-provider';

(async () => {
  const client = new CognitoIdentityProviderClient();

  console.info('Get user pool description...')

  let describeUserPoolResults;

  const describeUserPoolCommand = new DescribeUserPoolCommand({
    UserPoolId: '<user-pool-id>',
  });

  try {
    describeUserPoolResults = await client.send(describeUserPoolCommand);
    console.log(describeUserPoolResults.UserPool);
  } catch (err) {
    console.error(err);
    process.exit(-1);
  }

  console.info('Update user pool description...')

  const updateUserPoolCommand = new UpdateUserPoolCommand({
    ...describeUserPoolResults.UserPool,
    AdminCreateUserConfig: {
      ...describeUserPoolResults.UserPool.AdminCreateUserConfig,
      UnusedAccountValidityDays: undefined
    },
    UserPoolId: '<user-pool-id>',
    LambdaConfig: {
      CustomEmailSender: {
        LambdaVersion: 'V1_0',
        LambdaArn: '<lambda-arn>'},
      KMSKeyID: '<kms-key-id>',
    },
  });

  try {
    const updateUserPoolResults = await client.send(updateUserPoolCommand);
    console.log(updateUserPoolResults);
  } catch (err) {
    console.error(err);
    process.exit(-1);
  }

  console.info('Get new current user pool description...')

  describeUserPoolResults = await client.send(describeUserPoolCommand);

  try {
    console.log(describeUserPoolResults.UserPool);
  } catch (err) {
    console.error(err);
    process.exit(-1);
  }
})();