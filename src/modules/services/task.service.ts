import Task from "database/models/final/Task.model";
import User from "database/models/final/User.model";


export default class TaskService {

    static async getTaskbyId(id: string, user: User) {
        const task = await Task.findOne({
            where: {
                id: id,
                loginUser: user.login
            }
        })
        return task;
    }

    static async getAllToDo(user: User) {
        const alltask = await Task.findAll({
            where:{
                loginUser: user.login
            }
        })
        return alltask;
    }
    
    static async createNewToDo(title: string, description: string, isCompled: boolean, user: User) {
        const newtask = await Task.create({
            loginUser: user.login,
            title: title,
            description: description,
            isCompled: isCompled
        });
        return newtask;
    }

    static async updateTask(id: string, title: string, description: string, isCompled: boolean) {
        await Task.update(
            {
                title: title,
                description: description,
                isCompled: isCompled
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
                id: id
            }
        })
    }
}