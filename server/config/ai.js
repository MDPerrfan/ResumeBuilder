import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI({

    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"

});


export default openai;