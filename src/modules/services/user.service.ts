import User from "database/models/final/User.model";
import bcrypt from "bcryptjs";
import PassService from "./pass.service";

export default class UserService {

    static async getUserByLogin(login: string) {
        const user = await User.findOne({
            where: {
                login: login
            }
        })
        return user;
    }

    static async createNewUser(login: string, hashPassword: string) {
        const user = await User.create({
            login: login,
            pass: hashPassword
        });
        return user;
    }

    static async updateUser(login: string, pass: string) {
        await User.update(
            {
                pass: await PassService.genPassword(pass)
            },
            {
                where: {
                    login: login,
                },
            }
        );
    }
}