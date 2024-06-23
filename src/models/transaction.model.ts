export class Transaction {

    public id : number;
    public name : string;
    public date : string;
    public dateObject : Date;
    public type : string;
    public accountId : number;
    public category : string;
    public value: number;

    constructor (id: number, name : string, dateString: string, type: string, accountId: number, category: string, value:number) {
        this.id = id;
        this.name = name;
        this.date = dateString;
        this.dateObject = new Date(dateString);
        this.type = type;
        this.accountId = accountId;
        this.category = category;
        this.value = value;
    }

}