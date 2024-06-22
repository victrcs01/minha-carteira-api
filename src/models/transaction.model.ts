import { AppError } from "../errors/appErros";
import { Account } from "./account.model";


export class Transaction {

    public name : string;
    public date : string;
    public dateObject : Date;
    public type : string;
    public accountId : number;
    public category : string;
    public value: number;

    constructor (name : string, dateString: string, type: string, accountId: number, category: string, value:number) {
        this.name = name;
        this.date = dateString;
        this.dateObject = new Date(dateString);
        this.type = type;
        this.accountId = accountId;
        this.category = category;
        this.value = value;
    }

}