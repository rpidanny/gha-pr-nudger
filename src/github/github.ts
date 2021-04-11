import {Octokit} from '@octokit/rest'

import {
  IGitHub,
  IListPRsOptions,
  IPullRequest,
  IPRComment,
  IListPROptions,
  ICommentOnPROptions,
  IUpdateCommentOnPROptions,
} from './types'

export class GitHub implements IGitHub {
  private githubClient: Octokit

  constructor(githubToken: string) {
    this.githubClient = new Octokit({auth: githubToken})
  }

  getDays(date1: Date, date2: Date): number {
    const diff = date1.getTime() - date2.getTime()

    return Math.floor(diff / (1000 * 3600 * 24))
  }

  async listPRs(options: IListPRsOptions): Promise<Array<IPullRequest>> {
    const currentDate = new Date()

    const resp = await this.githubClient.pulls.list({...options})

    const {data} = resp

    return data.map(pr => ({
      ...pr,
      created_at: new Date(pr.created_at),
      updated_at: new Date(pr.updated_at),
      age: this.getDays(currentDate, new Date(pr.created_at)),
    }))
  }

  async commentOnPR(options: ICommentOnPROptions): Promise<void> {
    await this.githubClient.issues.createComment({
      owner: options.owner,
      repo: options.repo,
      issue_number: options.number,
      body: options.body,
    })
  }

  async updateCommentOnPR(options: IUpdateCommentOnPROptions): Promise<void> {
    await this.githubClient.issues.updateComment({...options})
  }

  async listPRComments(options: IListPROptions): Promise<Array<IPRComment>> {
    const {data} = await this.githubClient.issues.listComments({
      owner: options.owner,
      repo: options.repo,
      issue_number: options.number,
    })

    return data
  }
}
