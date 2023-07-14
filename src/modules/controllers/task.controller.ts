import { ApiController, GET, POST, PATCH, DELETE } from "core/api-decorators";
import BaseRequest from "modules/base/base.request";
import { NextFunction, Response } from "express";
import TaskService from "modules/services/task.service";
import { TaskDto } from "modules/dto/task.dto";
import { dtoValidator } from "middlewares/validate";
//import PassService from "modules/services/pass.service";
//import TokenService from "modules/services/token.service";
import { requireToken } from "middlewares/require-token";
import GroupService from "modules/services/group.service";
import { ChangeTaskDto } from "modules/dto/change-task.dto";

@ApiController("/api/todos")
class TodoController {
  
  @POST("/createToDo", {
    handlers: [requireToken, dtoValidator(TaskDto)],
  })
  async createToDo(req: BaseRequest, res: Response, next: NextFunction) {
    const dto: TaskDto = req.body;
    if (dto.groupId) {
      const isValidGroup = await GroupService.getRoleGroupbyId(
        dto.groupId,
        req.user
      );
      if (!isValidGroup) {
        throw Error("Not ok");
      }
      if (!isValidGroup.role) {
        throw Error("Not Rights On Write");
      }
    }
    if (dto.parentId) {
      const isValid = await TaskService.isValid(dto.parentId, req.user);
      if (!isValid) {
        throw Error("Not ok");
      }
    }
    const newTask = await TaskService.createNewToDo(dto, req.user);
    if (!newTask) {
      throw Error("Task not create");
    }
    res.json(newTask.toJSON());
  }

  @GET("/inGroup", {
    handlers: [requireToken],
  })
  async getAllToDoinGroup(req: BaseRequest, res: Response, next: NextFunction) {
    const allTask = await TaskService.getAllToDoinGroup(req.user);
    if (!allTask) {
      throw Error("Not ok");
    }
    res.json(allTask);
  }

  @GET("/withoutGroup", {
    handlers: [requireToken],
  })
  async getAllToDowithoutGroup(
    req: BaseRequest,
    res: Response,
    next: NextFunction
  ) {
    const allTask = await TaskService.getAllToDowithoutGroup(req.user);
    if (!allTask) {
      throw Error("Not ok");
    }
    res.json(allTask);
  }

  @GET("/:id", {
    handlers: [requireToken],
  })
  async getOneToDo(req: BaseRequest, res: Response, next: NextFunction) {
    const isValid = await TaskService.isValid(req.params.id, req.user);
    if (!isValid) {
      throw Error("Not ok");
    }

    const task = await TaskService.getTaskbyId(req.params.id);
    if (!task) {
      throw Error("Not ok");
    }
    res.json(task);
  }

  @PATCH("/changeTask/:id", {
    handlers: [requireToken, dtoValidator(ChangeTaskDto)],
  })
  async changepass(req: BaseRequest, res: Response, next: NextFunction) {
    const dto: ChangeTaskDto = req.body;
    const isValid = await TaskService.isValid(req.params.id, req.user);
    if (!isValid) {
      throw Error("Not ok");
    }

    const isGroup = await TaskService.getGroupForTask(req.params.id);
    if (isGroup) {
      const isValidGroup = await GroupService.getRoleGroupbyId(
        isGroup.id,
        req.user
      );
      if (!isValidGroup) {
        throw Error("Not ok");
      }
      if (!isValidGroup.role) {
        throw Error("Not Rights On Write");
      }
    }
    await TaskService.updateTask(req.params.id, dto);
    res.json({ message: "Ok" });
  }

  @DELETE("/deleteTask/:id", {
    handlers: [requireToken],
  })
  async deleteToDo(req: BaseRequest, res: Response, next: NextFunction) {
    const isValid = await TaskService.isValid(req.params.id, req.user);
    if (!isValid) {
      throw Error("Not ok");
    }
    const isGroup = await TaskService.getGroupForTask(req.params.id);
    if (isGroup) {
      const isValidGroup = await GroupService.getRoleGroupbyId(
        isGroup.id,
        req.user
      );
      if (!isValidGroup) {
        throw Error("Not ok");
      }
      if (!isValidGroup.role) {
        throw Error("Not Rights On Write");
      }
    }
    await TaskService.deleteTask(req.params.id);
    res.json({ message: "Ok" });
  }

  @GET("/getTaskByIDParent/:id", {
    handlers: [requireToken],
  })
  async getTaskByIDParent(req: BaseRequest, res: Response, next: NextFunction) {
    const isValid = await TaskService.isValid(req.params.id, req.user);
    if (!isValid) {
      throw Error("Not ok");
    }
    const ChildTask = await TaskService.getTaskByIDParent(req.params.id);
    if (!ChildTask) {
      throw Error("Not ok");
    }

    res.json(ChildTask);
  }
}

export default new TodoController();
