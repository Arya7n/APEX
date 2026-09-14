import type { Request, Response, NextFunction } from "express";

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function notFound(_req: Request, res: Response) {
  res.status(404).json({
    error: "NOT_FOUND",
    message: "The requested APEX resource does not exist.",
  });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const status = err instanceof HttpError ? err.status : 500;
  const message =
    err instanceof Error ? err.message : "An unexpected error occurred.";

  if (status >= 500) {
    console.error("[apex-api]", err);
  }

  res.status(status).json({
    error: status >= 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR",
    message: status >= 500 ? "Internal server error." : message,
  });
}
