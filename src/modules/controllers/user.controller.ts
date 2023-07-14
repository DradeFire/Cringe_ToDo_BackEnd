import { ApiController, DELETE, GET, PATCH, POST } from "core/api-decorators";
import BaseRequest from "modules/base/base.request";
import { NextFunction, Response } from "express";
import UserService from "modules/services/user.service";
import { ChangeLoginDto } from "modules/dto/change-login.dto";
import { dtoValidator } from "middlewares/validate";
// import PassService from "modules/services/pass.service";
// import TokenService from "modules/services/token.service";
import { requireToken } from "middlewares/require-token";
import { AddUserInGroup } from "modules/dto/add-user-in-group.dto";
import GroupService from "modules/services/group.service";
import { DeleteUserFromGroupDto } from "modules/dto/delete-user-from-group.dto";
import { UserDto } from "modules/dto/user.dto";
import { DeleteUserDto } from "modules/dto/delete-user.dto";
import PassService from "modules/services/pass.service";

@ApiController("/api/user")
class UserController {
  @GET("/me", {
    handlers: [requireToken],
  })
  async me(req: BaseRequest, res: Response, next: NextFunction) {
    const user = await UserService.getUserByLogin(req.user.login);
    res.json(user?.toJSON());
  }

  @GET("/", {
    handlers: [requireToken],
  })
  async mewithoutprivate(req: BaseRequest, res: Response, next: NextFunction) {
    const user = await UserService.getUserByLoginWithoutPass(req.user.login);
    res.json({ login: user });
  }

  @PATCH("/changelogin", {
    handlers: [requireToken, dtoValidator(ChangeLoginDto)],
  })
  async changepass(req: BaseRequest, res: Response, next: NextFunction) {
    const dto: ChangeLoginDto = req.body;
    if (dto.lastLogin !== req.user.login) {
      throw Error("Старый логин не совпадает!");
    }
    if (await UserService.getUserByLogin(dto.newLogin)) {
      throw Error("Такий логин уже занят");
    }
    await UserService.updateUserLogin(
      dto.lastLogin,
      dto.newLogin,
      req.token.token
    );
    res.json({ message: "Ok" });
  }

  @POST("/adduseringroup", {
    handlers: [requireToken, dtoValidator(AddUserInGroup)],
  })
  async addsrngrp(req: BaseRequest, res: Response, next: NextFunction) {
    const dto: AddUserInGroup = req.body;
    const isValid = await GroupService.getRoleGroupbyId(dto.groupId, req.user);
    if (!isValid) {
      throw Error("Not ok");
    }
    if (!isValid.role) {
      throw Error("Not true");
    }
    const usr = await UserService.getUserById(dto.userId);
    if (!usr) {
      throw Error("User not faund");
    }
    await UserService.addUsInGr(dto);
    res.json({ message: "Ok" });
  }

  @DELETE("/deleteuseringroup", {
    handlers: [requireToken, dtoValidator(DeleteUserFromGroupDto)],
  })
  async deletesrngrp(req: BaseRequest, res: Response, next: NextFunction) {
    const dto: DeleteUserFromGroupDto = req.body;
    const isValid = await GroupService.getRoleGroupbyId(dto.groupId, req.user);
    if (!isValid) {
      throw Error("Not ok");
    }
    if (!isValid.role) {
      throw Error("Not true");
    }
    const usr = await UserService.getUserById(dto.userId);
    if (!usr) {
      throw Error("User not faund");
    }
    await UserService.deleteUsFmGr(dto);
    res.json({ message: "Ok" });
  }

  @DELETE("/deleteuser", {
    handlers: [requireToken, dtoValidator(DeleteUserDto)],
  })
  async deleteuser(req: BaseRequest, res: Response, next: NextFunction) {
    const dto: DeleteUserDto = req.body;

    if (!(await PassService.comparePasswords(dto.pass, req.user.pass))) {
      throw Error("Неверный пароль");
    }
    await UserService.deleteUs(req.user);
    res.json({ message: "Ok" });
  }
}

export default new UserController();
