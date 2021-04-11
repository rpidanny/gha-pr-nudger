import * as core from '@actions/core'

import {ILogger} from './types'

export class Logger implements ILogger {
  debug(message: string): void {
    core.debug(message)
  }
  info(message: string): void {
    core.info(message)
  }
  warning(message: string): void {
    core.warning(message)
  }
  error(message: string, err?: Error): void {
    core.error(err ? `${message} : ${err.toString()}` : message)
  }
}
