/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_AWS_USER_POOLS_ID: string;
	readonly VITE_AWS_USER_POOLS_WEB_CLIENT_ID: string;
	readonly VITE_AWS_IDENTITY_POOL_ID: string;
	readonly VITE_AWS_BUCKET_NAME: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
