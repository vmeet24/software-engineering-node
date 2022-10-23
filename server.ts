/**
 * @file Implements an Express Node HTTP server.
 */
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import LikeController from './Controllers/LikeController';
import TuitController from './Controllers/TuitController';
import UserController from './Controllers/UserController';
import LikeDao from './mongoose/LikeDao';
import TuitDao from './mongoose/TuitDao';
import UserDao from './mongoose/UserDao';
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/tuitDB');

const userDao = new UserDao();
new UserController(app, userDao);

const tuitDao = new TuitDao();
new TuitController(app, tuitDao);

const likesDao = new LikeDao();
new LikeController(app, likesDao);

app.get('/', (req: Request, res: Response) =>
    res.send('Welcome to Foundation of Software Engineering!!!!'));

app.get('/hello', (req: Request, res: Response) =>
    res.send('Welcome to Foundation of Software Engineering!'));

/**
 * Start a server listening at port 4001 locally
 * but use environment variable PORT on Heroku if available.
 */
const PORT = 4001;
app.listen(process.env.PORT || PORT, () => {
    console.log("Up and Running!");
});
