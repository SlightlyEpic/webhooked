declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: string
        GITHUB_CLIENT_ID: string
        GITHUB_CLIENT_SECRET: string
        NEXTAUTH_URL: string
        NEXTAUTH_SECRET: string
        MONGODB_URI:string
    }
}
