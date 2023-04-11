import { ApiController, PATCH } from "core/api-decorators";
import BaseRequest from "modules/base/base.request";
import { NextFunction, Response } from 'express';
import { dtoValidator } from "middlewares/validate";
import { ChangePassDto } from "modules/dto/change-pass.dto";
import UserService from "modules/services/user.service";
import PassService from "modules/services/pass.service";

@ApiController('/api/pass')
class PassController {

    @PATCH('/changepass', {
        handlers: [dtoValidator(ChangePassDto)],
    })
    async changepass(req: BaseRequest, res: Response, next: NextFunction) {
        const dto: ChangePassDto = req.body;
        if (!await PassService.comparePasswords(dto.lastPassword, req.user.pass)) {
            res.status(400).json({ message: "Not ok" })
        }
        await UserService.updateUser(req.user.login, dto.newPassword)
        res.json({ message: "Ok" })
    }
}