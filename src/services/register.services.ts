import { Return } from '../interfaces/types.interface';
import { NewUser } from '../models/newUser.model';
import { User } from '../models/user.model';
import { IAuthenticateUser, ICreateUser } from '../interfaces/register.interface';
const { prisma } = require('../prisma/prismaClient');

// Classe que representa os serviços de registro
export class RegisterService implements ICreateUser, IAuthenticateUser {

    // Método que representa a criação de um novo usuário no sistema
    async createUser(username: string, fullname: string, password: string): Promise<Return> {

        try {
            // Inicializo uma instância de um novo usuário
            const newUser = new NewUser(username, fullname, password)

            // Subo o novo usuário para o banco
            await newUser.saveUser();

            //Retorna a mensagem de sucesso
            return { status: 200, message: "Usuário cadastrado com sucesso!" };

        } catch (error: any) {
            return { status: error.status, message: error.message };
        }
    }

    // Método que realiza o login no sistema
    async authenticateUser(username: string,  password: string) : Promise<Return> {

        // Verifica se foi informado alguma senha
        if (!password || !username ) {
            return { status: 422, message: "Usuário ou senha não informados." };
        }

        // Faz a consulta desse login usando o Prisma
        const userData = await prisma.users.findUnique({
            where: {
                username
            },
        });

        // Se não encontrar o login na base retorna erro
        if (!userData) {
            return { status: 404, message: "Usuário não encontrado." };
        }

        // Cria uma instância de User para poder comparar a senha
        const user = new User(userData.id, userData.username, userData.fullname, userData.password);
        const isCorrectPassword = await user.checkPassword(password);

        // Erro de senha inválida
        if (!isCorrectPassword ) {
            return { status: 401, message: "Usuário ou senha inválidos." };
        }

        // Gera o token jwt para o usuário (Bearer Token)
        const authToken = user.generateToken();

        // Retorna o código de operação concluída
        return { status: 200, message: "Usuário autenticado!", data:{authToken:authToken} }

    }
}