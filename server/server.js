import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors'
import summarizerRoutes from './routes/Summarizer.js';

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))

app.use('/api/invictus/rusted/summarizer', summarizerRoutes);

app.get('/', (req,res) => {
    res.send("<h1>Youtube Summarizer extention</h1>")
})

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})