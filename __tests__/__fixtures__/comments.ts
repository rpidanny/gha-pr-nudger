import {IPRComment} from '../../src/github'

export const botCommentWithoutBody: IPRComment = {
  url:
    'https://api.github.com/repos/rpidanny/some-random-repo/issues/comments/123',
  id: 123,
  node_id: 'abc==',
  user: {
    login: 'rpidanny',
    id: 123,
    type: 'User',
    site_admin: false,
  },
  created_at: '2021-04-11T07:35:19Z',
  updated_at: '2021-04-11T07:35:19Z',
}

export const botComment: IPRComment = {
  ...botCommentWithoutBody,
  body:
    "\n\nHey there :wave:, this PR has been open for **263** days.\n\nIn the spirit for [short lived branches](https://trunkbaseddevelopment.com/short-lived-feature-branches/), let's get this merged soon :rocket:\n\n\n*Your [pr-nudger](https://github.com/rpidanny/gha-pr-nudger) bot :robot:*\n",
}

export const regularCommentWithoutBody: IPRComment = {
  url:
    'https://api.github.com/repos/rpidanny/some-random-repo/issues/comments/124',
  id: 124,
  node_id: 'xyz',
  user: {
    login: 'rpidanny',
    id: 123,
    type: 'User',
    site_admin: false,
  },
  created_at: '2021-04-11T07:35:19Z',
  updated_at: '2021-04-11T07:35:19Z',
}

export const regularComment: IPRComment = {
  ...regularCommentWithoutBody,
  body: 'Some comment text',
}
