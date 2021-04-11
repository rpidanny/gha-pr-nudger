export interface IListPRsOptions {
  owner: string
  repo: string
  state?: 'open' | 'closed' | 'all'
  head?: string
  base?: string
  sort?: 'created' | 'updated' | 'popularity' | 'long-running'
  direction?: 'asc' | 'desc'
  per_page?: number
  page?: number
}

export interface IUser {
  login: string
  type: string
  site_admin: boolean
  id: number
}

export interface IPullRequest {
  url: string
  id: number
  node_id: string
  number: number
  state: string
  title: string
  created_at: Date
  updated_at: Date
  age: number
  draft?: boolean
  user: IUser | null
}

export interface IPRComment {
  url: string
  id: number
  node_id: string
  user: IUser | null
  created_at: string
  updated_at: string
  body?: string
}

export interface ICommentOnPROptions {
  owner: string
  repo: string
  number: number
  body: string
}

export interface IUpdateCommentOnPROptions {
  owner: string
  repo: string
  comment_id: number
  body: string
}

export interface IListPROptions {
  owner: string
  repo: string
  number: number
}

export interface IGitHub {
  listPRs(options: IListPRsOptions): Promise<Array<IPullRequest>>

  commentOnPR(options: ICommentOnPROptions): Promise<void>

  updateCommentOnPR(options: IUpdateCommentOnPROptions): Promise<void>

  listPRComments(options: IListPROptions): Promise<Array<IPRComment>>
}
