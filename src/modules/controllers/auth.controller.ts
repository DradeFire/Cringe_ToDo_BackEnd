import { ApiController, GET, POST } from "core/api-decorators";
import BaseRequest from "modules/base/base.request";
import { NextFunction, Response } from 'express';
import UserService from "modules/services/user.service";
import { UserDto } from "modules/dto/user.dto";
import { dtoValidator } from "middlewares/validate";
import PassService from "modules/services/pass.service";
import TokenService from "modules/services/token.service";
import { requireToken } from "middlewares/require-token";

@ApiController('/api/auth')
class AuthController {

    @GET('/me', {
        handlers: [requireToken],
    })
    async me(req: BaseRequest, res: Response, next: NextFunction) {
        const user = await UserService.getUserByLogin(req.user.login);
        res.json(user?.toJSON())
    }

    @POST('/login', {
        handlers: [dtoValidator(UserDto)],
    })
    async login(req: BaseRequest, res: Response, next: NextFunction) {
        const dto: UserDto = req.body;
        const candidate = await UserService.getUserByLogin(dto.login)
        if (!candidate) {
            throw Error("Not ok")
        }
        if (!await PassService.comparePasswords(dto.pass, candidate!.pass)) {
            throw Error("Not ok")
        }
        const token = await TokenService.createTokenByLogin(req.user.login);
        res.json(token.toJSON())
    }

    @GET('/logout', {
        handlers: [requireToken],
    })
    async logout(req: BaseRequest, res: Response, next: NextFunction) {
        await TokenService.destroyToken(req.token);
        res.json({ message: "Ok" });
    }

    @GET('/registration', {
        handlers: [dtoValidator(UserDto)],
    })
    async registration(req: BaseRequest, res: Response, next: NextFunction) {
        const dto: UserDto = req.body;
        const candidate = await UserService.getUserByLogin(dto.login)
        if (candidate) {
            throw Error("Not ok")
        }
        const user = await UserService.createNewUser(dto.login, dto.pass);
        res.json(user.toJSON())
    }
}

export default new AuthController();