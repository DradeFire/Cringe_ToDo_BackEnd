import Group from "database/models/final/Group.model";
import User from "database/models/final/User.model";
import MMUserGroup from "database/models/relations/MMUserGroup.model";
import { ChangeInfoGroupDto } from "modules/dto/change-informationGroup";
import { ChangeRoleGroupDto } from "modules/dto/change-roleGroup";
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
      role: dto.role,
    });
    return newgroup;
  }

  static async getGroupbyId(id: string) {
    const group = await Group.findOne({
      where: {
        id: id,
      },
    });
    return group;
  }

  static async getAllGroup(user: User) {
    const itemList = await MMUserGroup.findAll({
      where: {
        userId: user.id,
      },
    });
    const listgroup = [];
    for (let i = 0; i < itemList.length; i++) {
      listgroup.push(
        await Group.findOne({
          where: {
            id: itemList[i].groupId,
          },
        })
      );
    }

    return listgroup;
  }
  static async updateGroupInfo(id: string, dto: ChangeInfoGroupDto) {
    await Group.update(
      {
        title: dto.title,
        description: dto.description,
      },
      {
        where: {
          id: id,
        },
      }
    );
  }
  static async updateGroupRole(
    id: string,
    dto: ChangeRoleGroupDto,
    user: User
  ) {
    await MMUserGroup.update(
      {
        role: dto.role,
      },
      {
        where: {
          userId: user.id,
          groupId: id,
        },
      }
    );
  }
  static async isValid(id: string, user: User) {
    const isValid = await MMUserGroup.findOne({
      where: { userId: user.id, groupId: id },
    });
    return isValid;
  }
  static async getRoleGroupbyId(id: string) {
    const role = await MMUserGroup.findOne({
      where: { groupId: id },
    });
    return role;
  }
  static async getListUserGroup(id: string, user: User) {
    const itemList = await MMUserGroup.findAll({
      where: {
        groupId: id,
      },
    });
    const list = [];
    for (let i = 0; i < itemList.length; i++) {
      const user = await User.findOne({
        where: {
          id: itemList[i].userId,
        },
      });
      list.push(user?.login);
    }

    return list;
  }
  static async getListGroup(user: User) {
    const itemList = await MMUserGroup.findAll({
      where: {
        userId: user.id,
      },
    });
    const list = [];

    for (let i = 0; i < itemList.length; i++) {
      list.push(
        await Group.findOne({
          where: {
            id: itemList[i].groupId,
          },
        })
      );
    }

    return list;
  }
}
