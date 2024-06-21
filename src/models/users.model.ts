import { User } from "./user.model";

const { prisma } = require('../prisma/prismaClient');

export class Users {

    users : Array<User> = [];

    // Método para poder criar uma array com instâncias dos usuários que estão na base de dados
    async loadUsers () : Promise<void> {
        const usersData = await prisma.users.findMany();
        usersData.forEach((userData: any ) => {
            const userInstance = new User(userData.id, userData.username, userData.fullname, userData.password)
            this.users.push(userInstance);
        });
    }

    getUsers () : void {
        this.users.forEach((user: User) => {
            console.log(user);
        });

    }
}