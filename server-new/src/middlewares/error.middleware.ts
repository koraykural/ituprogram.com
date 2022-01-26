/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { NextFunction, Request, Response } from 'express';

export class HttpError extends Error {
  constructor(public status: number, public message: string, public details?: any) {
    super(message);
  }
}

export const errorMiddleware = () => {
  return (err: Error, req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof HttpError) {
      res.status(err.status).json({
        status: err.status,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      });
    } else {
      res.status(500).json({
        status: 500,
        message: 'Server Error',
        details: err,
      });
    }
  };
};
