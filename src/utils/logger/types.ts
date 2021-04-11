export interface ILogger {
  info(message: string): void
  debug(message: string): void
  warning(message: string): void
  error(message: string, err?: Error): void
}
