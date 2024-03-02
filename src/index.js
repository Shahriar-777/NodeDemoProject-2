import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/DbConnect.js';

//env configuration
dotenv.config({path:'./.env'});



connectDB();

