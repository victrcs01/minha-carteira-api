import { Password } from './password.model';
import { JWT } from './jwt.model';

export class User {

    protected id: number;
    protected username: string;
    protected fullname: string;
    protected password: string;

    constructor(id:number, username: string, fullname: string, password: string) {
        this.id = id;
        this.username = username;
        this.fullname = fullname;
        this.password = password;
    }

    // Método para poder fazer a comparação da senha
    async checkPassword(plainPassword: string) : Promise<boolean> {
        return await Password.comparePasswords(plainPassword, this.password);
    }

    // Método para poder gerar um token jwt para o usuário
    generateToken() : string {
        return JWT.generateToken(this.id);
    }
};