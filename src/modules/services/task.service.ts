import Group from "database/models/final/Group.model";
import Task from "database/models/final/Task.model";
import User from "database/models/final/User.model";
import MMUserTask from "database/models/relations/MMUserTask.model";
import { TaskDto } from "modules/dto/task.dto";
import { where } from "sequelize";
import GroupService from "./group.service";
import Group from "database/models/final/Group.model";
import { ChangeTaskDto } from "modules/dto/change-task.dto";

export default class TaskService {

  static async isValid(id: string, user: User) {
    const isValid = await MMUserTask.findOne({
      where: { userId: user.id, taskId: id },
    });
    return isValid;
  }

  static async getTaskbyId(id: string) {
    const task = await Task.findByPk(id);
    return task;
  }

  static async getGroupForTask(id: string) {
    const task = await Task.findByPk(id);
    if (task?.groupId) {
      const group = await Group.findByPk(task?.groupId);
      return group;
    }
    return null;
  }

  static async getAllToDoinGroup(user: User) {
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
        },
      });
      if (task?.groupId) {
        listTodo.push(task);
      }
    }

    return listTodo;
  }

  static async getAllToDowithoutGroup(user: User) {
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
        },
      });
      if (!task?.groupId) {
        listTodo.push(task);
      }
    }

    return listTodo;
  }

  static async createNewToDo(dto: TaskDto) {
    const newtask = await Task.create({
      parentId: dto.parentId,
      groupId: dto.groupId,
      title: dto.title,
      description: dto.description,
      isCompled: dto.isCompled,
      deadline: dto.deadline,
      priority: dto.priority,
      notification: dto.notification,
    });
    await MMUserTask.create({
      userId: user.id,
      taskId: newtask.id,
    });
    if (dto.groupId) {
      const users = await GroupService.getListUsersGroup(dto.groupId);
      for (let i = 0; i < users.length; i++) {
        if (users[i]?.id !== user.id) {
          await MMUserTask.create({
            userId: users[i]?.id,
            taskId: newtask.id,
          });
        }
      }
    }


    return newtask;
  }

  static async updateTask(id: string, dto: ChangeTaskDto) {
    await Task.update(
      {
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

  static async deleteTask(id: string) {
    const list = await Task.findAll({ where: { parentId: id } });
    for (let i = 0; i < list.length; i++) {
      await TaskService.deleteTask(list[i].id);
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
  
  static async getTaskByIDParent(id: string) {
    const listChild = await Task.findAll({ where: { parentId: id } });
    return listChild;
  }

  static async getTaskByIdGroup(id: string) {
    const itemList = await Task.findAll({
      where: {
        groupId: id,
      },
    });

    return itemList;
  }
}
