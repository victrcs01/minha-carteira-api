const jwt = require('jsonwebtoken');
require('dotenv').config();

export class JWT {

    // Chave secreta para gerar o JWT
    private static secretKey = process.env.SECRET_KEY;

    // Método para gerar o token de um usuário
    static generateToken(userId: number): string {
        const token = jwt.sign({ userId }, this.secretKey, { expiresIn: '3h' });
        return token;
    };

    // Método para validar se um token é válido
    static authenticateToken(token: string) {
        try {
            const decoded = jwt.verify(token, this.secretKey);
            return decoded.userId;
        } catch (error) {
            return null;
        }
    };
};