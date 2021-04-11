import {IGitHub, IPullRequest} from './github'
import {ILogger} from './logger'

interface Dependency {
  github: IGitHub
  logger: ILogger
}

interface Config {
  repo: string
  owner: string
  days: number
  includeDependabot: boolean
  message: string
}

export class Nudger {
  private github!: IGitHub
  private logger!: ILogger
  private footer = `Your [pr-nudger](https://github.com/rpidanny/gha-pr-nudger) bot :robot:`

  constructor(private config: Config, dependency: Dependency) {
    this.github = dependency.github
    this.logger = dependency.logger

    this.printConfigs()
  }

  printConfigs(): void {
    this.logger.info('Nudger Configs!')
    this.logger.info(`Config/Owner: ${this.config.owner}`)
    this.logger.info(`Config/Repo: ${this.config.repo}`)
    this.logger.info(`Config/Days: ${this.config.days}`)
    this.logger.info(
      `Config/Include Dependabot: ${this.config.includeDependabot}`,
    )
    this.logger.info(`Config/Message: ${this.config.message}`)
  }

  getDays(date1: Date, date2: Date): number {
    const diff = date1.getTime() - date2.getTime()

    return diff / (1000 * 3600 * 24)
  }

  async getOpenPullRequests(): Promise<Array<IPullRequest>> {
    this.logger.info(
      `Getting open pull requests on ${this.config.owner}/${this.config.repo}`,
    )
    const prs = await this.github.listPRs({
      owner: this.config.owner,
      repo: this.config.repo,
      state: 'open',
    })

    this.logger.info(`Found ${prs.length} open prs`)

    return prs
  }

  logPullRequests(prs: Array<IPullRequest>): void {
    prs.forEach(pr => this.logger.info(`#${pr.number} - ${pr.age} days old`))
  }

  filterPullRequests(prs: Array<IPullRequest>): Array<IPullRequest> {
    return prs.filter(
      pr =>
        pr.age >= this.config.days &&
        (this.config.includeDependabot ||
          pr?.user?.login !== 'dependabot[bot]'),
    )
  }

  createCommentBody(days: number): string {
    const body = this.config.message.replace(/{days}/g, `${days}`)
    return `${body}\n\n${this.footer}`
  }

  async upsertComment(pr: IPullRequest, commentBody: string): Promise<void> {
    let commentId
    try {
      commentId = await this.getCommentIdIfExists(pr)
    } catch (err) {
      console.log('Failed to get comment id')
      this.logger.error(
        `Failed to get comment id on ${this.config.owner}/${this.config.repo} #${pr.number}`,
        err,
      )
      throw err
    }

    const params = {
      owner: this.config.owner,
      repo: this.config.repo,
      number: pr.number,
      body: commentBody,
    }

    try {
      if (commentId) {
        this.logger.info(
          `Updating comment on ${this.config.owner}/${this.config.repo} #${pr.number}`,
        )
        await this.github.updateCommentOnPR({
          ...params,
          comment_id: commentId,
        })
      } else {
        this.logger.info(
          `Creating new comment on ${this.config.owner}/${this.config.repo} #${pr.number}`,
        )
        await this.github.commentOnPR(params)
      }
    } catch (err) {
      this.logger.error(
        `Failed to Create/update comment on ${this.config.owner}/${this.config.repo} #${pr.number}`,
        err,
      )
      throw err
    }
  }

  async nudge(pr: IPullRequest): Promise<void> {
    this.logger.info(
      `Nudging ${this.config.owner}/${this.config.repo} #${pr.number} - ${pr.age} Days`,
    )

    const md = this.createCommentBody(pr.age)

    await this.upsertComment(pr, md)
  }

  async getCommentIdIfExists(pr: IPullRequest): Promise<number | undefined> {
    this.logger.info(
      `Getting comment id on ${this.config.owner}/${this.config.repo} #${pr.number}`,
    )

    const comments = await this.github.listPRComments({
      owner: this.config.owner,
      repo: this.config.repo,
      number: pr.number,
    })

    const botComment = comments.find(comment =>
      comment.body ? comment.body.includes(this.footer) : false,
    )

    return botComment?.id
  }

  async run(): Promise<void> {
    let prs = await this.getOpenPullRequests()

    this.logPullRequests(prs)

    prs = this.filterPullRequests(prs)

    this.logger.info(`Nudging ${prs.length} PRs`)

    const promises = prs.map(pr => this.nudge(pr))

    await Promise.all(promises)

    this.logger.info(`Done nudging ${prs.length} PRs`)
  }
}
