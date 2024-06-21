import { Return } from '../interfaces/types.interface';

// Interface para criar um novo Usuário
export interface ICreateUser {
    createUser(username: string, fullname: string, password: string): Promise<Return>;
}

// Interface para Autenticar um usuário já existente
export interface IAuthenticateUser {
    authenticateUser(username: string,  password: string) : Promise<Return>;
}