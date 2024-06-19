import { Request, Response } from 'express';
import { register } from 'module';

class RegisterController {

    async getUserInfo(req: Request, res:Response): Promise<Response> {

        // Retorna as informações do usuário
        return res.status(200).json({
            message: 'Senha cadastrada com sucesso!',
          });
      };


}

module.exports = new RegisterController();