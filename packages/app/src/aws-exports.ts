import type { ResourcesConfig } from "aws-amplify";
const awsConfig = {
	Auth: {
		Cognito: {
			userPoolId: import.meta.env.VITE_AWS_USER_POOLS_ID,
			userPoolClientId: import.meta.env.VITE_AWS_USER_POOLS_WEB_CLIENT_ID,
			identityPoolId: import.meta.env.VITE_AWS_IDENTITY_POOL_ID,
			loginWith: {
				email: true,
			},
		},
	},
	Storage: {
		S3: {
			buckets: {
				my_images: {
					bucketName: import.meta.env.VITE_AWS_BUCKET_NAME,
					region: "ap-northeast-1",
					paths: {
						"*": {
							authenticated: ["get", "list", "write", "delete"],
						},
					},
				},
			},
		},
	},
} satisfies ResourcesConfig;
export default awsConfig;
