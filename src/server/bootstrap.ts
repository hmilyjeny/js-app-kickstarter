import { InversifyExpressServer, interfaces } from 'inversify-express-utils'
import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import expressSession = require('express-session');
import { kernel } from './ioc/ioc';
import * as config from './config';


// load all injectable entities.
// the @provide() annotation will then automatically register them.
import './ioc/loader';
import TYPES from './constant/types';
import { IAuthenticationService } from './services/authentication/IAuthenticationService';

// start the server
let server: interfaces.InversifyExpressServer = new InversifyExpressServer(kernel);
let authService: IAuthenticationService       = kernel
    .get<IAuthenticationService>(TYPES.IAuthenticationService);

server.setConfig((app) => {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(helmet());
    app.use(cookieParser());
    app.use(expressSession({
        secret:            config.app.secret,
        resave:            false,
        saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    authService.setProvider(passport);
    app.use('/' + config.path.public, express.static(path.resolve(__dirname, config.path.public)));
});

let app = server.build();
app.listen(config.url.port);
console.log(`Server started on port ${config.url.port} :)`);

exports = module.exports = app;
