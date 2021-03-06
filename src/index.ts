import 'reflect-metadata'
import { createConnection } from 'typeorm'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import routes from './routes/index-routes'

//Connects to the Database -> then starts the express
createConnection()
    .then(async connection => {
        // Create a new express application instance
        const app = express()

        // Call middlewares
        app.use(cors())
        app.use(bodyParser.json())

        // Set all routes from routes folder
        app.use("/v1", routes)

        app.listen(3010, () => {
            console.log("Server started on port 3010.")
        })

    })
    .catch(error => console.log(error));