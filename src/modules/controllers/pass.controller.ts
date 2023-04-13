import { ApiController, PATCH } from "core/api-decorators";
import BaseRequest from "modules/base/base.request";
import { NextFunction, Response } from 'express';
import { dtoValidator } from "middlewares/validate";
import { ChangePassDto } from "modules/dto/change-pass.dto";
import UserService from "modules/services/user.service";
import PassService from "modules/services/pass.service";
import { requireToken } from "middlewares/require-token";

@ApiController('/api/pass')
class PassController {

    @PATCH('/changepass', {
        handlers: [requireToken, dtoValidator(ChangePassDto)],
    })
    async changepass(req: BaseRequest, res: Response, next: NextFunction) {
        const dto: ChangePassDto = req.body;
        if (!await PassService.comparePasswords(dto.lastPassword, req.user.pass)) {
            throw Error("Not ok")
        }
        await UserService.updateUser(req.user.login, dto.newPassword)
        res.json({ message: "Ok" })
    }
}

export default new PassController();