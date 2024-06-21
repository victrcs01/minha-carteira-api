import { AppError } from '../errors/appErros';
import { Password } from './password.model';
import { User } from './user.model';
const { prisma } = require('../prisma/prismaClient');

export class NewUser extends User {

    constructor(username: string, fullname: string, password: string) {

        // Verifica se alguma informação está em branco 
        if (!password || !username || !fullname) {
            throw new AppError('Usuário ou senha ou nome não informados.', 422)
        }

        // Testa a segurança da senha
        const checkPassword: boolean = Password.validatePassword(password);
        if (!checkPassword) {
            throw new AppError('Senha não atende os padrões de segurança.', 422)
        }

        super(0, username, fullname, password);
    }

    // Método para fazer a criptografia da senha 
    private async encryptPassword(password: string): Promise<string> {
        const hashedPassword = await Password.generateHash(password);
        return hashedPassword;
    }

    // Método para fazer o registro do usuário no banco de dados
    async saveUser() : Promise<void> {
        try {
            // Aguarda a resolução da promise #password
            const hashedPassword = await this.encryptPassword(this.password);

            // Após a resolução da senha, faz o insert no banco de dados
            await prisma.users.create({
                data: {
                    username: this.username,
                    fullname: this.fullname,
                    password: hashedPassword
                }
            });
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new AppError('Username já cadastrado na base, tente um novo.', 422);
            } else {
                throw new AppError('Erro inesperado', 400);
            }
        }
    }
};