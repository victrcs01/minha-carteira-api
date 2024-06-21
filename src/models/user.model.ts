import { AppError } from '../errors/appErros';
import { Password } from './password.model';
import { JWT } from './jwt.model';
const { prisma } = require('../prisma/prismaClient');
//import { prisma } from '../prisma/prismaClient';

export class User {

    protected _id: number;
    protected _username: string;
    protected _fullname: string;
    protected _password: string;

    constructor(id:number, username: string, fullname: string, password: string) {
        this._id = id;
        this._username = username;
        this._fullname = fullname;
        this._password = password;
    }

    // Método para poder fazer a comparação da senha
    async checkPassword(plainPassword: string) : Promise<boolean> {
        return await Password.comparePasswords(plainPassword, this._password);
    }

    // Método para poder gerar um token jwt para o usuário
    generateToken() : string {
        return JWT.generateToken(this._id);
    }
};