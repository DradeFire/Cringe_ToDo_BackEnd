import Group from "database/models/final/Group.model";
import Task from "database/models/final/Task.model";
import User from "database/models/final/User.model";
import MMUserTask from "database/models/relations/MMUserTask.model";
import { TaskDto } from "modules/dto/task.dto";
import { where } from "sequelize";
import GroupService from "./group.service";

export default class TaskService {
  static async isinGroup(parentId: string): Promise<any> {
    if (!parentId) {
      return null;
    }
    const group = await Group.findOne({
      where: {
        id: parentId,
      },
    });
    if (!group) {
      const taskParent = await Task.findOne({
        where: {
          id: parentId,
        },
      });
      if (!taskParent) {
        throw Error("Not ok");
      }
      return await TaskService.isinGroup(parentId);
    }
    return group;
  }
  static async isValid(id: string, user: User) {
    const isValid = await MMUserTask.findOne({
      where: { userId: user.id, taskId: id },
    });
    return isValid;
  }

  static async getTaskbyId(id: string) {
    const task = await Task.findOne({
      where: {
        id: id,
      },
    });
    return task;
  }

  static async getAllToDo(user: User) {
    const itemList = await MMUserTask.findAll({
      where: {
        userId: user.id,
      },
    });
    const listTodo = [];
    for (let i = 0; i < itemList.length; i++) {
      listTodo.push(
        await Task.findOne({
          where: {
            id: itemList[i].taskId,
          },
        })
      );
    }

    return listTodo;
  }

  static async createNewToDo(dto: TaskDto) {
    const newtask = await Task.create({
      parentId: dto.parentId,
      title: dto.title,
      description: dto.description,
      isCompled: dto.isCompled,
      deadline: dto.deadline,
      priority: dto.priority,
      notification: dto.notification,
    });
    if (dto.parentId) {
      const ifGroup = await Group.findOne({
        where: {
          id: dto.parentId,
        },
      });
      if (ifGroup) {
        const user = await GroupService.getListUserGroup(dto.parentId);
        for (let i = 0; i < user.length; i++) {
          const userfromdb = await User.findOne({
            where: {
              login: user[i],
            },
          });
          if (userfromdb) {
            await MMUserTask.create({
              userId: userfromdb.id,
              taskId: newtask.id,
            });
          }
        }
      }
      const list = await MMUserTask.findAll({
        where: {
          taskId: dto.parentId,
        },
      });
      for (let i = 0; i < list.length; i++) {
        await MMUserTask.create({
          userId: list[i].userId,
          taskId: newtask.id,
        });
      }
    }
    return newtask;
  }

  static async updateTask(id: string, dto: TaskDto) {
    await Task.update(
      {
        parentId: dto.parentId,
        title: dto.title,
        description: dto.description,
        isCompled: dto.isCompled,
        deadline: dto.deadline,
        priority: dto.priority,
        notification: dto.notification,
      },
      {
        where: {
          id: id,
        },
      }
    );
  }
  static async deleteTask(id: string, user: User) {
    const list = await TaskService.getTaskByIDParent(id, user);
    for (let i = 0; i < list.length; i++) {
      await TaskService.deleteTask(list[i].id, user);
    }
    await Task.destroy({
      where: {
        id: id,
      },
    });
    await MMUserTask.destroy({
      where: {
        taskId: id,
      },
    });
  }
  static async getTaskByIDParent(id: string, user: User) {
    const itemList = await MMUserTask.findAll({
      where: {
        userId: user.id,
      },
    });
    const listTodo = [];
    for (let i = 0; i < itemList.length; i++) {
      const task = await Task.findOne({
        where: {
          id: itemList[i].taskId,
          parentId: id,
        },
      });
      if (task) {
        listTodo.push(task);
      }
    }

    return listTodo;
  }
}
