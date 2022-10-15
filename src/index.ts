import 'reflect-metadata'
import { createConnection } from 'typeorm'
import * as express from 'express'
import * as cors from 'cors'
import { Server } from 'typescript-rest'
//import routes from './routes/index-routes'

import bodyParser = require('body-parser');

//Connects to the Database -> then starts the express
createConnection()
    .then(async connection => {
        // Create a new express application instance
        const app: any = express();

        /* Inicializando o novo padrão de rotas da API */
        Server.useIoC();
        Server.loadServices(app, 'resources/*', __dirname);

        app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header('Access-Control-Allow-Methods');
            res.header('Access-Control-Allow-Headers');
            next();
        });

        app.use(cors());
        app.use(bodyParser.json({ limit: '100mb' }));
        app.use(bodyParser.urlencoded({ extended: false, limit: '100mb', parameterLimit: 100000 }));

        // Set all routes from routes folder
        /*app.use("/v1", routes)*/

        app.listen(3010, () => {
            console.log("Server started on port 3010.")
        })

    })
    .catch(error => console.log(error));