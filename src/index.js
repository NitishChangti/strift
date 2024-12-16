import dotenv from 'dotenv';
import { DB_NAME } from './constants.js';
import connectionDB from './db/index.js';
import { app } from './app.js';

dotenv.config({
    path: '../.env'
})

connectionDB()
    .then(() => {
        app.on('error', (error) => {
            console.log("err", error)
            throw error
        })
        app.listen(process.env.PORT || 8080, () => {
            console.log(`server is running on port ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log('MONGODB db connection failed !!!', error)
    })