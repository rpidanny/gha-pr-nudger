import {IPullRequest} from '../../src/github'

export const oldPRDependabot: IPullRequest = {
  url: 'https://api.github.com/repos/rpidanny/some-repo/pulls/5',
  id: 123,
  node_id: 'abc',
  number: 5,
  state: 'open',
  title: 'Bump eslint from 7.17.0 to 7.24.0',
  user: {
    login: 'dependabot[bot]',
    id: 342,
    type: 'Bot',
    site_admin: false,
  },
  created_at: new Date('2021-04-10T11:25:31Z'),
  updated_at: new Date('2021-04-10T11:25:32Z'),
  draft: false,
  age: 256,
}

export const newPRDependabot: IPullRequest = {
  url: 'https://api.github.com/repos/rpidanny/some-repo/pulls/6',
  id: 124,
  node_id: 'xyz',
  number: 6,
  state: 'open',
  title: 'Bump eslint from 7.17.0 to 7.24.0',
  user: {
    login: 'dependabot[bot]',
    id: 243,
    type: 'Bot',
    site_admin: false,
  },
  created_at: new Date('2021-04-10T11:25:31Z'),
  updated_at: new Date('2021-04-10T11:25:32Z'),
  draft: false,
  age: 1,
}

export const oldPRUser: IPullRequest = {
  ...oldPRDependabot,
  user: {
    login: 'rpidanny',
    id: 2435,
    type: 'User',
    site_admin: false,
  },
}

export const newPRUser: IPullRequest = {
  ...newPRDependabot,
  user: {
    login: 'rpidanny',
    id: 2435,
    type: 'User',
    site_admin: false,
  },
}
