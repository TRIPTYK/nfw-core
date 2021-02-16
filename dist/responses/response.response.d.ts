export declare class Response {
    type: string;
    status: number;
    body: any;
    constructor(body: any, { status, type }?: {
        status: number;
        type: string;
    });
}
