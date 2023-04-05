export class UserModel {
    login: string | undefined
    pass: string | undefined
}


export class TokenModel {
    login: string | undefined
    token: string | undefined
}


export class IdParamModel {
    login!: string
    id!: string
    token!: string
}

export class ChangePassModel {
    lastPassword: string | undefined
    newPassword: string | undefined
}