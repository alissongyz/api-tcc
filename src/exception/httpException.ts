class HttpException extends Error {
    public message: string;
    public error: any;
    public status: number;

    constructor(status: number, message: string, error: any) {
        super(message);

        this.status = status;
        this.error = error;
        this.message = message;
    }
}

export default HttpException;
