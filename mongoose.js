import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const { USER, PASS, HOST } = process.env;

const uri = `mongodb+srv://${USER}:${PASS}@${HOST}/honk?retryWrites=true&w=majority`;

export const main = async () => {
    await mongoose.connect(uri);

    console.log(`mongoose connected at ${HOST}`);
}; 

export default mongoose;
