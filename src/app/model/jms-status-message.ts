import { JmsStatus } from "./jms-status";

export class JmsStatusMessage<T> {
    private film: T;
    private status: JmsStatus;
    private timing: any;
    private statusValue: any;
    constructor(_status: JmsStatus, _film: T, _timing: any, statusValue: any) {
        this.film = _film;
        this.status = _status;
        this.timing = _timing;
        this.statusValue = statusValue;
    }
    
    public getStatusValue() {
        return this.statusValue;
    }
    public getStatus(): JmsStatus {
        return this.status;
    }
    public getTiming(): number {
        return this.timing;
    }
}
