export const env = {
    PORT: process.env.PORT ?? 4000,
    MONGO_URI: process.env.MONGO_URI ?? 'mongodb://localhost:27017/test',
    SALT_ROUNDS: +process.env.SALT_ROUNDS ?? 8,
    JWT_SECRET: process.env.JWT_SECRET ?? 'secret',
};