import { AppError } from "../errors/appErros";

export abstract class AbstractController {

    // Método para verificar se o formato que o token foi disponibilizado está correto
    protected getToken(authorization: string | undefined) : string {

        // Faz a validação se foi passado alguma informação de autenticação
        if (!authorization) {
            throw new AppError('Não foi passado a autorização no headers.', 401);
        }

        // Faz o tratamento dessa informação
        const parts = authorization.split(" ");
        const [schema, token] = parts;

        // Valida se o dado está no formato correto
        if (parts.length !== 2) {
            throw new AppError('A autorização não foi passada no formato "Bearer <token>"', 401);
        } else if (schema !== "Bearer") {
            throw new AppError('Bearer não foi encontrado na autorização', 401);
        } else if (!token) {
            throw new AppError('Token de acesso não fornecido.', 401);
        }

        return token;
    }

}