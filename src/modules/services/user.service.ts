import User from "database/models/final/User.model";
import Token from "database/models/final/Token.model";
import bcrypt from "bcryptjs";
import PassService from "./pass.service";
import { where } from "sequelize";
import { AddUserInGroup } from "modules/dto/add-user-in-group.dto";
import MMUserGroup from "database/models/relations/MMUserGroup.model";
import MMUserTask from "database/models/relations/MMUserTask.model";
import TaskService from "./task.service";
import GroupService from "./group.service";
import { DeleteUserFromGroupDto } from "modules/dto/delete-user-from-group.dto";
import Task from "database/models/final/Task.model";
import Group from "database/models/final/Group.model";

export default class UserService {

  static async updateUserLogin(
    lastLogin: string,
    newLogin: string,
    token: string
  ) {
    await User.update(
      {
        login: newLogin,
      },
      {
        where: {
          login: lastLogin,
        },
      }
    );
    await Token.update(
      {
        login: newLogin,
      },
      {
        where: {
          token: token,
        },
      }
    );
  }

  static async getUserByLoginWithoutPass(login: string) {
    const user = await User.findOne({
      where: {
        login: login,
      },
    });
    return user?.login;
  }
  static async getUserById(id: string) {
    const user = await User.findByPk(id);
    return user;
  }

  static async getUserByLogin(login: string) {
    const user = await User.findOne({
      where: {
        login: login,
      },
    });
    return user;
  }

  static async createNewUser(login: string, password: string) {
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const user = await User.create({
      login: login,
      pass: hashPassword,
    });
    return user;
  }

  static async updateUser(login: string, pass: string) {
    await User.update(
      {
        pass: await PassService.genPassword(pass),
      },
      {
        where: {
          login: login,
        },
      }
    );
  }

  static async addUsInGr(dto: AddUserInGroup) {
    const MMUG = await MMUserGroup.findOne({
      where: { groupId: dto.groupId, userId: dto.userId },
    });
    if (MMUG) {
      await MMUserGroup.update(
        {
          role: dto.role,
        },
        {
          where: {
            userId: dto.userId,
            groupId: dto.groupId,
          },
        }
      );
    } else {
      await MMUserGroup.create({
        groupId: dto.groupId,
        userId: dto.userId,
        role: dto.role,
      });
      const todos = await TaskService.getTaskByIdGroup(dto.groupId);
      for (let i = 0; i < todos.length; i++) {
        await MMUserTask.create({
          userId: dto.userId,
          taskId: todos[i].id,
        });
      }
    }
  }

  static async deleteUsFmGr(dto: DeleteUserFromGroupDto) {
    await MMUserGroup.destroy({
      where: { groupId: dto.groupId, userId: dto.userId },
    });

    const todos = await TaskService.getTaskByIdGroup(dto.groupId);
    for (let i = 0; i < todos.length; i++) {
      await MMUserTask.destroy({
        where: { userId: dto.userId, taskId: todos[i].id },
      });
    }
  }
  
  static async deleteUs(user: User) {
    const userGroup = await GroupService.getListGroup(user);
    for (let i = 0; i < userGroup.length; i++) {
      const idGroup = userGroup[i]?.id;
      if (idGroup) {
        const countUserInGroup = await GroupService.getListUsersGroup(idGroup);
        if (!(countUserInGroup.length > 1)) {
          await Task.destroy({ where: { groupId: idGroup } });
          await Group.destroy({ where: { id: idGroup } });
        }
      }
    }
    const taskList = await TaskService.getAllToDowithoutGroup(user);
    for (let i = 0; i < taskList.length; i++) {
      await Task.destroy({ where: { id: taskList[i]?.id } });
    }
    await MMUserGroup.destroy({ where: { userId: user.id } });
    await MMUserTask.destroy({ where: { userId: user.id } });
    await Token.destroy({ where: { login: user.login } });
    await User.destroy({ where: { login: user.login } });

  }
}
