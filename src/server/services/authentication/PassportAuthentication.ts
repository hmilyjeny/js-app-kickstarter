import { IAuthenticationService } from './IAuthenticationService';
import TYPES from '../../constant/types';
import { provide } from '../../ioc/ioc';
import ROUTES from '../../config/routes';
import { Handler } from 'express-serve-static-core';
import passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

@provide(TYPES.IAuthenticationService)
export class PassportAuthentication implements IAuthenticationService {

    private passport: any;

    public setProvider(provider: any): void {
        this.passport = provider;
    }

    public authenticate(strategy: string, configuration: any, callback: Function = null): Handler {
        return this.passport.authenticate(strategy, configuration, callback);
    }

    public isAuthenticated(): Function {
        return ensureLoggedIn(ROUTES.authenticate);
    }

}
