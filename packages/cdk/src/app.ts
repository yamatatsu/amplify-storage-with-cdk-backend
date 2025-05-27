import * as cdk from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import {
	IdentityPool,
	UserPoolAuthenticationProvider,
} from "aws-cdk-lib/aws-cognito-identitypool";
import * as s3 from "aws-cdk-lib/aws-s3";

const app = new cdk.App();
const stack = new cdk.Stack(app, "AmplifyStorageWithCdkBackend");

// User pool
const userPool = new cognito.UserPool(stack, "Default", {
	selfSignUpEnabled: true,
	signInAliases: {
		username: false,
		email: true,
	},
	passwordPolicy: {
		tempPasswordValidity: cdk.Duration.days(7),
		requireLowercase: false,
		requireUppercase: false,
		requireDigits: false,
		requireSymbols: false,
		minLength: 8,
	},
	email: cognito.UserPoolEmail.withCognito(),
	accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
	deviceTracking: {
		challengeRequiredOnNewDevice: true,
		deviceOnlyRememberedOnUserPrompt: true,
	},

	removalPolicy: cdk.RemovalPolicy.DESTROY,
	deletionProtection: false,
});

const userPoolClient = userPool.addClient("UserPoolClient", {
	preventUserExistenceErrors: true,
	supportedIdentityProviders: [cognito.UserPoolClientIdentityProvider.COGNITO],
});

const identityPool = new IdentityPool(stack, "IdentityPool", {
	allowUnauthenticatedIdentities: false,
	authenticationProviders: {
		userPools: [
			new UserPoolAuthenticationProvider({ userPool, userPoolClient }),
		],
	},
});

const bucket = new s3.Bucket(stack, "Bucket", {
	encryption: s3.BucketEncryption.S3_MANAGED,
	blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
	enforceSSL: true,

	// ブラウザで動作するAmplifyからの要求に答えれるようにCORSの設定が必要
	cors: [
		{
			// AmplifyがブラウザからS3にリクエストする際に`access-control-allow-headers`ヘッダーの中で要求しているヘッダーたち
			allowedHeaders: [
				"amz-sdk-invocation-id",
				"amz-sdk-request",
				"authorization",
				"content-type",
				"x-amz-content-sha256",
				"x-amz-date",
				"x-amz-security-token",
				"x-amz-user-agent",
			],
			allowedMethods: [
				s3.HttpMethods.HEAD,
				s3.HttpMethods.GET,
				s3.HttpMethods.PUT,
				s3.HttpMethods.DELETE,
			],
			allowedOrigins: ["http://localhost:5173", "http://localhost:5174"],
		},
	],

	removalPolicy: cdk.RemovalPolicy.DESTROY,
	autoDeleteObjects: true,
});
bucket.grantReadWrite(identityPool.authenticatedRole);
