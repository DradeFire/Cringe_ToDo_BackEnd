import { ApiController, GET, POST, PATCH, DELETE } from "core/api-decorators";
import BaseRequest from "modules/base/base.request";
import { NextFunction, Response } from 'express';
import TaskService from "modules/services/task.service";
import { TaskDto } from "modules/dto/task.dto";
import { dtoValidator } from "middlewares/validate";
//import PassService from "modules/services/pass.service";
//import TokenService from "modules/services/token.service";
import { requireToken } from "middlewares/require-token";

@ApiController('/api/todos')
class TodoController {

    @POST('/createToDo', {
        handlers: [requireToken, dtoValidator(TaskDto)],
    })
    async createToDo(req: BaseRequest, res: Response, next: NextFunction) {
        const dto: TaskDto = req.body;
        const newTask = await TaskService.createNewToDo(dto.title, dto.description, dto.isCompled, req.user);
        if (!newTask) {
            throw Error("Task not create")
        }
        res.json(newTask.toJSON())
    }
    @GET('/', {
        handlers: [requireToken],
    })
    async getAllToDo(req: BaseRequest, res: Response, next: NextFunction) {
        const allTask = await TaskService.getAllToDo(req.user);
        if (!allTask) {
            throw Error("Not ok")
        }
        res.json(allTask)
    }
    @GET('/:id', {
        handlers: [requireToken],
    })
    async getOneToDo(req: BaseRequest, res: Response, next: NextFunction) {
        const task = await TaskService.getTaskbyId(req.params.id, req.user);
        if (!task) {
            throw Error("Not ok")
        }
        res.json(task)
    }

    @PATCH('/changeTask/:id', {
        handlers: [requireToken, dtoValidator(TaskDto)],
    })
    async changepass(req: BaseRequest, res: Response, next: NextFunction) {
        const dto: TaskDto = req.body;
        const task = await TaskService.getTaskbyId(req.params.id, req.user);
        if (!task) {
            throw Error("Таска с таким id не существует")
        }
        await TaskService.updateTask(req.params.id, dto.title, dto.description, dto.isCompled)
        res.json({ message: "Ok" })
    }

    @DELETE('/deleteTask/:id', {
        handlers: [requireToken],
    })
    async deleteToDo(req: BaseRequest, res: Response, next: NextFunction) {
        const task = await TaskService.getTaskbyId(req.params.id, req.user);
        if (!task) {
            throw Error("Таска с таким id не существует")
        }
        await TaskService.deleteTask(req.params.id)
        res.json({ message: "Ok" })
    }

}

export default new TodoController();