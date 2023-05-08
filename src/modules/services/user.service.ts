import User from "database/models/final/User.model";
import Token from "database/models/final/Token.model"
import bcrypt from "bcryptjs";
import PassService from "./pass.service";
import { where } from "sequelize";

export default class UserService {

    
    static async updateUserLogin(lastLogin: string, newLogin: string, token: string) {
        await User.update(
            {
                login: newLogin
            },
            {
                where: {
                    login: lastLogin,
                },
            }
        );
        await Token.update({
            login: newLogin
        },
        {
            where: {
                token: token
            }
        }
        );
    }

    static async getUserByLoginWithoutPass(login: string) {
        const user = await User.findOne({
            where: {
                login: login
            }
        })
        return user?.login;
    }

    static async getUserByLogin(login: string) {
        const user = await User.findOne({
            where: {
                login: login
            }
        })
        return user;
    }

    static async createNewUser(login: string, password: string) {
        const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
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