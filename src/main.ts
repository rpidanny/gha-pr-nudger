import * as core from '@actions/core'

import {Nudger} from './nudger'
import {GitHub} from './externals/github'
import {Logger} from './utils/logger'

import {getInputs} from './input-helper'

async function run(): Promise<void> {
  try {
    const config = getInputs()

    // Init dependencies
    const logger = new Logger()
    const github = new GitHub(config.authToken)

    const nudger = new Nudger(
      {
        owner: config.owner,
        repo: config.repo,
        threshold: config.threshold,
        includeDependabot: config.includeDependabot,
        message: config.message,
      },
      {
        github,
        logger,
      },
    )

    await nudger.run()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
