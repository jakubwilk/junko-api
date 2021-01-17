import { CanActivate, ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UsersAuthService } from "src/users-auth/users-auth.service";
import { serverFailureMessage } from "src/utils/messages/server-response-messages";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly authService: UsersAuthService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());

        if (!roles) return true;
    
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization;

        if (!token) serverFailureMessage(
            'Missing user token',
            'Unauthorized',
            HttpStatus.UNAUTHORIZED
        );

        const isValidToken = await this.authService.validateToken(token.replace('Bearer ', ''));
        if (!isValidToken) serverFailureMessage(
            'Unfortunately token is not valid',
            'Unauthorized',
            HttpStatus.UNAUTHORIZED
        );

        const userRoles = await this.authService.extractRolesFromToken(token.replace('Bearer ', ''));
        const matchRoles = () => userRoles.some(role => roles.includes(role));

        return matchRoles();
    }
}