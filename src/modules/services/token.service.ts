import Token from "database/models/final/Token.model";
import { nanoid } from "nanoid";

export default class TokenService {

    static async createTokenByLogin(login: string) {
        return (await Token.create({
            login: login,
            token: nanoid(128),
        }));
    }

    static async destroyToken(token: Token) {
        await token.destroy();
    }
}