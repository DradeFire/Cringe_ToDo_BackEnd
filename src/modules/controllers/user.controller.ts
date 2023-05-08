import { ApiController, GET, PATCH } from "core/api-decorators";
import BaseRequest from "modules/base/base.request";
import { NextFunction, Response } from 'express';
import UserService from "modules/services/user.service";
import { ChangeLoginDto } from "modules/dto/change-login.dto";
import { dtoValidator } from "middlewares/validate";
// import PassService from "modules/services/pass.service";
// import TokenService from "modules/services/token.service";
import { requireToken } from "middlewares/require-token";

@ApiController('/api/user')
class UserController {

    @GET('/me', {
        handlers: [requireToken],
    })
    async me(req: BaseRequest, res: Response, next: NextFunction) {
        const user = await UserService.getUserByLogin(req.user.login);
        res.json(user?.toJSON())
    }
    @GET('/', {
        handlers: [requireToken],
    })
    async mewithoutprivate(req: BaseRequest, res: Response, next: NextFunction) {
        const user = await UserService.getUserByLoginWithoutPass(req.user.login);
        res.json({login: user})
    }


    @PATCH('/changelogin', {
        handlers: [requireToken, dtoValidator(ChangeLoginDto)],
    })
    async changepass(req: BaseRequest, res: Response, next: NextFunction) {
        const dto: ChangeLoginDto = req.body;
        if (!await UserService.getUserByLogin(dto.lastLogin)) {
            throw Error("Старый логин не совпадает!")
        }
        if (await UserService.getUserByLogin(dto.newLogin)) {
            throw Error("Такий логин уже занят")
        }
        await UserService.updateUserLogin(dto.lastLogin, dto.newLogin, req.token.token)
        res.json({ message: "Ok" })
    }

    
}

export default new UserController();