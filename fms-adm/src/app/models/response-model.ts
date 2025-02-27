export class ResponseModel {
    data: any;
    error: boolean;
    message: string | null;
    page: number | null;
    totalPage: number | null;

    constructor() {
        this.data = {};
        this.error = false;
        this.message = null;
        this.page = null;
        this.totalPage = null;
    }
}