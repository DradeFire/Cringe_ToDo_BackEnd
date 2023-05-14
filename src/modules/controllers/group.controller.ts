import { ApiController, GET, POST, PATCH, DELETE } from "core/api-decorators";
import BaseRequest from "modules/base/base.request";
import { NextFunction, Response } from "express";
import GroupService from "modules/services/group.service";
import { GroupDto } from "modules/dto/group.dto";
import { dtoValidator } from "middlewares/validate";
import { requireToken } from "middlewares/require-token";

@ApiController("/api/group")
class GroupController {
  @POST("/createGroup", {
    handlers: [requireToken, dtoValidator(GroupDto)],
  })
  async createGroup(req: BaseRequest, res: Response, next: NextFunction) {
    const dto: GroupDto = req.body;
    const newGroup = await GroupService.createNewGroup(dto, req.user);
    if (!newGroup) {
      throw Error("Group not create");
    }
    res.json(newGroup.toJSON());
  }
}

export default new GroupController();
