import Task from "database/models/final/Task.model";
import User from "database/models/final/User.model";
import MMUserTask from "database/models/relations/MMUserTask.model";
import { TaskDto } from "modules/dto/task.dto";
import { where } from "sequelize";

export default class TaskService {
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

  static async createNewToDo(dto: TaskDto, user: User) {
    const newtask = await Task.create({
      parentId: dto.parentId,
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
  static async deleteTask(id: string) {
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
