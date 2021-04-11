import {mock} from 'jest-mock-extended'

import {Logger} from '../../src/logger'
import {Nudger} from '../../src/nudger'
import {IGitHub, IPullRequest, IPRComment, GitHub} from '../../src/github'

import {
  newPRUser,
  oldPRUser,
  newPRDependabot,
  oldPRDependabot,
} from '../__fixtures__/pull-requests'
import {
  regularComment,
  botComment,
  botCommentWithoutBody,
  regularCommentWithoutBody,
} from '../__fixtures__/comments'

describe('Unit: Nudger', () => {
  const logger = mock<Logger>()
  const nudgerConfig = {
    owner: 'rpidanny',
    repo: 'test-repo',
    days: 5,
    includeDependabot: true,
    message: 'some message',
  }

  const filterPRsTable: Array<
    [string, Array<IPullRequest>, Array<IPullRequest>, boolean]
  > = [
    ['Empty', [newPRUser, newPRDependabot, oldPRDependabot], [], false],
    [
      'Dependabot Enabled',
      [oldPRUser, newPRUser, newPRDependabot, oldPRDependabot],
      [oldPRUser, oldPRDependabot],
      true,
    ],
    [
      'Dependabot Disabled',
      [oldPRUser, newPRUser, newPRDependabot, oldPRDependabot],
      [oldPRUser],
      false,
    ],
    [
      'PR without user / Dependabot Disabled',
      [{...oldPRUser, user: null}],
      [{...oldPRUser, user: null}],
      false,
    ],
    [
      'PR without user / Dependabot Enabled',
      [{...oldPRUser, user: null}],
      [{...oldPRUser, user: null}],
      true,
    ],
  ]

  test.each(filterPRsTable)(
    'should filter PRs: %s',
    (_name, inputPRs, outputPRs, includeDependabot) => {
      const github = mock<GitHub>()

      const nudger = new Nudger(
        {...nudgerConfig, includeDependabot},
        {
          github,
          logger,
        },
      )

      const filteredPRs = nudger.filterPullRequests(inputPRs)

      expect(filteredPRs).toEqual(outputPRs)
    },
  )

  const getCommentIdTable: Array<
    [string, Array<IPRComment>, number | undefined]
  > = [
    ['When regular comment', [regularComment], undefined],
    ['When bot comment', [botComment], botComment.id],
    ['When regular comment -body', [regularCommentWithoutBody], undefined],
    ['When bot comment -body', [botCommentWithoutBody], undefined],
    [
      'When multiple comments',
      [
        regularComment,
        regularCommentWithoutBody,
        botCommentWithoutBody,
        botComment,
      ],
      botComment.id,
    ],
  ]

  test.each(getCommentIdTable)(
    'should get correct comment id if exists: %s',
    async (_name, comments, commentId) => {
      expect.assertions(1)

      const github: IGitHub = {
        listPRs: jest.fn(),
        commentOnPR: jest.fn(),
        updateCommentOnPR: jest.fn(),
        listPRComments: jest.fn().mockReturnValue(comments),
      }

      const nudger = new Nudger(nudgerConfig, {
        github,
        logger,
      })

      const id = await nudger.getCommentIdIfExists(oldPRUser)

      expect(id).toStrictEqual(commentId)
    },
  )

  const createCommentTable: Array<
    [string, Array<IPullRequest>, Array<IPRComment>]
  > = [
    [
      'Old PR by User / Regular Comment on PR',
      [oldPRUser, newPRUser, newPRDependabot],
      [regularComment],
    ],
    ['Old PR by User / No Comment on PR', [oldPRUser], []],
    [
      'Old PR by Dependabot / Regular Comment on PR',
      [oldPRDependabot],
      [regularComment],
    ],
    ['Old PR by Dependabot / No Comment on PR', [oldPRDependabot], []],
  ]

  test.each(createCommentTable)(
    'Should create new comment for: %s',
    async (_name, prs, comments) => {
      expect.assertions(1)

      const mockedCommentOnPR = jest.fn()

      const github: IGitHub = {
        listPRs: jest.fn().mockReturnValueOnce(prs),
        commentOnPR: mockedCommentOnPR,
        updateCommentOnPR: jest.fn(),
        listPRComments: jest.fn().mockReturnValue(comments),
      }

      const nudger = new Nudger(nudgerConfig, {
        github,
        logger,
      })

      await nudger.run()

      expect(mockedCommentOnPR).toHaveBeenCalledTimes(1)
    },
  )

  const updateCommentTable: Array<
    [string, Array<IPullRequest>, Array<IPRComment>]
  > = [
    [
      'Old PR by User / Bot Comment on PR',
      [oldPRUser, newPRUser, newPRDependabot],
      [botComment],
    ],
    [
      'Old PR by Dependabot / Bot Comment on PR',
      [oldPRDependabot],
      [botComment],
    ],
  ]

  test.each(updateCommentTable)(
    'Should create new comment for: %s',
    async (_name, prs, comments) => {
      expect.assertions(1)

      const mockedUpdateCommentOnPR = jest.fn()

      const github: IGitHub = {
        listPRs: jest.fn().mockReturnValueOnce(prs),
        commentOnPR: jest.fn(),
        updateCommentOnPR: mockedUpdateCommentOnPR,
        listPRComments: jest.fn().mockReturnValue(Promise.resolve(comments)),
      }

      const nudger = new Nudger(nudgerConfig, {
        github,
        logger,
      })

      await nudger.run()

      expect(mockedUpdateCommentOnPR).toHaveBeenCalledTimes(1)
    },
  )

  it('should throw error when failed to get comment id', async () => {
    expect.assertions(1)

    const github: IGitHub = {
      listPRs: jest.fn(),
      commentOnPR: jest.fn(),
      updateCommentOnPR: jest.fn(),
      listPRComments: jest.fn(() => {
        throw new Error()
      }),
    }

    const nudger = new Nudger(nudgerConfig, {
      github,
      logger,
    })

    await expect(nudger.upsertComment(oldPRUser, '')).rejects.toThrowError()
  })

  it('should throw error when failed to comment on PR', async () => {
    expect.assertions(1)

    const github: IGitHub = {
      listPRs: jest.fn(),
      commentOnPR: jest.fn(() => {
        throw new Error()
      }),
      updateCommentOnPR: jest.fn(),
      listPRComments: jest
        .fn()
        .mockReturnValueOnce(Promise.resolve([regularComment])),
    }

    const nudger = new Nudger(nudgerConfig, {
      github,
      logger,
    })

    await expect(nudger.upsertComment(oldPRUser, '')).rejects.toThrowError()
  })
})
