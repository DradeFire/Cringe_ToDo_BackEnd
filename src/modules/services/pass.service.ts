import bcrypt from "bcryptjs";

export default class PassService {

    private static readonly salt: string = bcrypt.genSaltSync(10);

    static async comparePasswords(lastPassword: string, currentPass: string) {
        return bcrypt.compareSync(lastPassword, currentPass);
    }

    static async genPassword(pass: string) {
        return bcrypt.hashSync(pass, this.salt);
    }

}