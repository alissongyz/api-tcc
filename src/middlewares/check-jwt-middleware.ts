import * as jwt from "jsonwebtoken";

export class JwtMiddleware {
    public getParsedToken(token: string) {
        token = String(token)
            .replace("", "")
            .replace("Bearer", "")
            .replace("bearer", "");

        return jwt.decode(token, { complete: true });
    }

    public validateAuth(authorization: string) {
        const parsedToken = this.getParsedToken(authorization);

        if(!parsedToken) {
            return false
        };

        return true;
    }
}
