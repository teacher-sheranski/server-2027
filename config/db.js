import { connect } from "mongoose";
import { env } from "./env";

export const connectDB = async () => {
    try {
        const mongo_uri = env.MONGO_URI;
        await connect(mongo_uri);
        console.log('mongo connected successfully');
    } catch (error) {
        console.log(error.message);
    }
};