import express from 'express';
export declare class Routes {
    app: express.Express;
    constructor(app: express.Express);
    mountRoutes(): void;
}
