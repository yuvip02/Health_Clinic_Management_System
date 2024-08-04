import mongoose from 'mongoose';
import { config } from 'dotenv';
//must import evertime
config({ path: './.env' });
 // Log the environment variable

export const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URL, {
        dbName: `Hostpital`,
    })
    .then(() => {
        console.log('Connected to db');
    })
    .catch((err) => {
        console.error('Not connected to db', err);
    });
};
