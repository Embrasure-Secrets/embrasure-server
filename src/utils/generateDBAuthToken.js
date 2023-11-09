import '../../loadEnv.js';
import { Signer } from '@aws-sdk/rds-signer';
//  https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_rds_signer.html

/* 
Given an AWS accessKeyId, AWS secretAccessKey,
db region, db hostname, db port, and db username
all as strings, generateDBAuthToken will 
generate an IAM Auth token for the current IAM user
to connect to the IAM auth enabled database
*/

async function generateDBAuthToken(region, hostname, port, username) {
    try {
        const signerCreds = {
            // AWS credentials of iam user
            credentials: {
                accessKeyId: process.env.LOGS_WORKER_ACCESS_KEY,
                secretAccessKey: process.env.LOGS_WORKER_SECRET_ACCESS_KEY,
            },
            // region of database e.g. "us-east-1"
            region,
            // db endpoint
            hostname,
            // db port e.g. "5432"
            port,
            // db username associated with iam user e.g. "iamuser"
            username,
        };
        console.log('signercreds is: ', signerCreds);
        const signer = new Signer(signerCreds);

        const authToken = await signer.getAuthToken();
        return authToken;
    } catch (error) {
        console.error('Error in generating token: ', error);
        throw error;
    }
}

export default generateDBAuthToken;
