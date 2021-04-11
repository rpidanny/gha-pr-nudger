import * as core from '@actions/core'
import * as github from '@actions/github'

import {IConfig} from './types'

export function getInputs(): IConfig {
  const config = ({} as unknown) as IConfig

  // Qualified repository
  const qualifiedRepository =
    core.getInput('repository') ||
    `${github.context.repo.owner}/${github.context.repo.repo}`
  core.debug(`qualified repository = '${qualifiedRepository}'`)
  const splitRepository = qualifiedRepository.split('/')
  if (
    splitRepository.length !== 2 ||
    !splitRepository[0] ||
    !splitRepository[1]
  ) {
    throw new Error(
      `Invalid repository '${qualifiedRepository}'. Expected format {owner}/{repo}.`,
    )
  }
  config.owner = splitRepository[0]
  config.repo = splitRepository[1]

  // Auth token
  config.authToken = core.getInput('token', {required: true})

  // Threshold
  config.threshold = parseInt(core.getInput('threshold') || '5', 10)

  // Include dependabot PRs
  config.includeDependabot =
    (core.getInput('includeDependabot') || 'true').toUpperCase() === 'TRUE'

  // Nudge Message
  config.message = core.getInput('message')

  return config
}
