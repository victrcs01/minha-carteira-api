
const bcrypt = require('bcrypt');

export class Password {

    // Fator para fazer a criptografia da senha
    private static saltRounds = 10;

    // Método para criar uma senha encriptografada para salvar no banco
    static async generateHash(plainPassword: string): Promise<string> {
        const hashedPassword = await bcrypt.hash(plainPassword, Password.saltRounds);
        return hashedPassword;
    };

    // Método para comparar se duas senhas se coincidem
    static async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    };

    // Método para validar se a senha atinge os requisitos de segurança
    static validatePassword(plainPassword: string): boolean {

        // Verificar se a senha tem pelo menos 8 caracteres
        if (plainPassword.length < 8) {
            return false;
        }

        // Verificar se a senha possui pelo menos um caractere especial
        const specialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        if (!specialCharacter.test(plainPassword)) {
            return false;
        }

        // Verificar se a senha possui pelo menos um número
        const digit = /\d+/;
        if (!digit.test(plainPassword)) {
            return false;
        }

        // Verificar se a senha possui pelo menos uma letra minúscula
        const lowercase = /[a-z]+/;
        if (!lowercase.test(plainPassword)) {
            return false;
        }

        // Verificar se a senha possui pelo menos uma letra maiúscula
        const uppercase = /[A-Z]+/;
        if (!uppercase.test(plainPassword)) {
            return false;
        }

        // Se a senha passar por todas as verificações, retorna true
        return true;
    }
    
}