const AWS = require('aws-sdk');
const b64 = require('base64-js');
const encryptionSdk = require('@aws-crypto/client-node');
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

// Configure the encryption SDK client with the KMS key from the environment variables.
const { encrypt, decrypt } = encryptionSdk.buildClient(encryptionSdk.CommitmentPolicy.REQUIRE_ENCRYPT_ALLOW_DECRYPT);
const generatorKeyId = process.env.KEY_ALIAS;
const keyIds = [process.env.KEY_ARN];
const keyring = new encryptionSdk.KmsKeyringNode({ generatorKeyId, keyIds });

exports.handler = async (event) => {
  console.log(event);


  let plainTextCode;
  if (event.request.code) {
    console.log('Decrypt the secret code using encryption SDK.');
    const { plaintext } = await decrypt(keyring, b64.toByteArray(event.request.code));
    plainTextCode = plaintext;
    console.log(`Decrypted value: ${plaintext}`);
  }

  const sesClient = new SESClient();

  // PlainTextCode now contains the decrypted secret.
  if (event.triggerSource == 'CustomEmailSender_SignUp') {
    console.log('Send the email to sign up');
    // Send an email message to your user via a custom provider.
    // Include the temporary password in the message.
  }
  else if (event.triggerSource == 'CustomEmailSender_ResendCode') {
  }
  else if (event.triggerSource == 'CustomEmailSender_ForgotPassword') {
  }
  else if (event.triggerSource == 'CustomEmailSender_UpdateUserAttribute') {
  }
  else if (event.triggerSource == 'CustomEmailSender_VerifyUserAttribute') {
  }
  else if (event.triggerSource == 'CustomEmailSender_AdminCreateUser') {
    console.log('Send the email to create user by admin');

    const command = new SendEmailCommand({
      Source: 'fake@email.com',
      Destination: {
        ToAddresses: ['fake@email.com']
      },
      Message: {
        Subject: {
          Data: 'Welcome to this fake app',
          Charset: 'UTF-8'
        },
        Body: {
          Html: {
            Data: `<div><h1>Welcome ${event.userName}.</h1><br />This is your temporal password: ${plainTextCode}</div>`,
            Charset: 'UTF-8'
          }
        }
      }
    });

    try {
      const response = await sesClient.send(command);
      console.log('ses response :>> ');
      console.log(response);
    } catch (error) {
      console.log(`Send email error: ${error}`);
    }
  }
  else if (event.triggerSource == 'CustomEmailSender_AccountTakeOverNotification') {
  }

  return;
};