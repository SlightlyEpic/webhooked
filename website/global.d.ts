declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: string
        GITHUB_CLIENT_ID: string
        GITHUB_CLIENT_SECRET: string
        NEXTAUTH_URL: string
        NEXTAUTH_SECRET: string
        MONGODB_URI: string
        MONGODB_DATBASE: string
        MONGODB_COLLECTION_WEBHOOK: string
        MONGODB_COLLECTION_USERS: string
        MONGODB_COLLECTION_LOGS: string
    }
}
