/**
 * @file Implements an Express Node HTTP server.
 */
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import UserController from './Controllers/UserController';
import UserDao from './mongoose/UserDao';
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/tuitDB');

const userDao = new UserDao();
new UserController(app, userDao);

app.get('/', (req: Request, res: Response) =>
    res.send('Welcome to Foundation of Software Engineering!!!!'));

app.get('/hello', (req: Request, res: Response) =>
    res.send('Welcome to Foundation of Software Engineering!'));

/**
 * Start a server listening at port 4000 locally
 * but use environment variable PORT on Heroku if available.
 */
const PORT = 4000;
app.listen(process.env.PORT || PORT, () => {
    console.log("Up and Running!");
});
