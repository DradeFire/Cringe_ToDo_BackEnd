import Group from "database/models/final/Group.model";
import User from "database/models/final/User.model";
import MMUserGroup from "database/models/relations/MMUserGroup.model";
import { GroupDto } from "modules/dto/group.dto";
import { where } from "sequelize";

export default class GroupService {
  static async createNewGroup(dto: GroupDto, user: User) {
    const newgroup = await Group.create({
      title: dto.title,
      description: dto.description,
    });
    await MMUserGroup.create({
      userId: user.id,
      groupId: newgroup.id,
    });
    return newgroup;
  }
}
