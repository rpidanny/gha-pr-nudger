export interface IConfig {
  owner: string
  repo: string
  authToken: string
  threshold: number
  includeDependabot: boolean
  message?: string
}
