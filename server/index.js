const mongoose = require('mongoose');
const express = require('express');
const cors = require ('cors');
const routes = require('./routes');
const authRoutes = require('./auth');

require ('dotenv').config();

const app = express();
app.use(cors({
  origin: ['https://job-tracker-teal.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use('/api', routes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({message: 'Job Tracker API is running' });
});

const PORT = process.env.PORT || 5000;

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.log(error);
     } 
    }
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
