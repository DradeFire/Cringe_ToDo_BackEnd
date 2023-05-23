import User from "database/models/final/User.model";
import Token from "database/models/final/Token.model";
import bcrypt from "bcryptjs";
import PassService from "./pass.service";
import { where } from "sequelize";
import { AddUserInGroup } from "modules/dto/addUserInGroup.dto";
import MMUserGroup from "database/models/relations/MMUserGroup.model";
import TaskService from "./task.service";
import MMUserTask from "database/models/relations/MMUserTask.model";

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

  static async getUserbyId(id: string) {
    const user = await User.findOne({
      where: {
        id: id,
      },
    });
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

  static async addUserforTask(id: string, user: User, idSlave: string){
    const list = await TaskService.getTaskByIDParent(id, user);
    for (let i = 0; i < list.length; i++) {
      await MMUserTask.create({
        userId: idSlave,
        taskId: list[i].id
      })
      UserService.addUserforTask(list[i].id, user, idSlave)
    }
    
  }

  static async addUser(dto: AddUserInGroup, user: User) {
    await MMUserGroup.create({
      userId: dto.userId,
      groupId: dto.groupId,
      role: dto.role,
    });
    await UserService.addUserforTask(dto.groupId, user, dto.userId)
  }
}
