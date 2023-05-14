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
  @GET("/allgroupbyUser", {
    handlers: [requireToken],
  })
  async getAllGroup(req: BaseRequest, res: Response, next: NextFunction) {
    const allgroup = await GroupService.getAllGroup(req.user);
    if (!allgroup) {
      throw Error("Not ok");
    }
    res.json(allgroup);
  }
  @GET("/groupbyID/:id", {
    handlers: [requireToken],
  })
  async getOneGroup(req: BaseRequest, res: Response, next: NextFunction) {
    const isAccessGroup = await GroupService.isValid(req.params.id, req.user);
    if (!isAccessGroup) {
      throw Error("Not ok");
    }

    const group = await GroupService.getGroupbyId(req.params.id);
    if (!group) {
      throw Error("Not ok");
    }
    res.json(group);
  }
  @GET("/rolegroupbyID/:id", {
    handlers: [requireToken],
  })
  async getGroup(req: BaseRequest, res: Response, next: NextFunction) {
    const isAccessGroup = await GroupService.isValid(req.params.id, req.user);
    if (!isAccessGroup) {
      throw Error("Not ok");
    }

    const role = await GroupService.getRoleGroupbyId(req.params.id);
    if (!role) {
      throw Error("Not ok");
    }
    res.json(role.role);
  }
}

export default new GroupController();
