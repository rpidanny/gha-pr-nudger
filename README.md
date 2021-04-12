# Pull Request Nudger

This action [nudges](https://en.wikipedia.org/wiki/Nudge_theory) the PR participants to get the PR merged by commenting a reminder message on PRs that are older than `x` number of days.

## Why PR Nudger?

This action is especially useful to help follow the principle or [short-lived-branches](https://trunkbaseddevelopment.com/short-lived-feature-branches/).

> One key rule is the length of life of the branch before it gets merged and deleted. Simply put, the branch should only last a couple of days. Any longer than two days, and there is a risk of the branch becoming a long-lived feature branch (the antithesis of trunk-based development).

The core idea is that we should not enforce a strict rule but just [nudge](https://en.wikipedia.org/wiki/Nudge_theory) the participants to follow best practices.

## Usage

<!-- start usage -->
```yaml
- uses: rpidanny/gha-pr-nudger@v1
  with:
    # Repository name with owner. For example, actions/checkout
    # Default: ${{ github.repository }}
    repository: ''

    # Personal access token (PAT) used to fetch the repository. The PAT is configured
    # with the local git config, which enables your scripts to run authenticated git
    # commands. The post-job step removes the PAT.
    #
    # We recommend using a service account with the least permissions necessary. Also
    # when generating a new PAT, select the least scopes necessary.
    #
    # [Learn more about creating and using encrypted secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets)
    #
    # Default: ${{ github.token }}
    token: ''

    # The number of days after which the PR is marked as older
    # and the nudging should begin
    # Default: 2
    days: ''

    # The message to post to nudge the PR
    # The message can be a template where {days} can be used
    # to dynamically set the age of the PR
    # Default:
    #  Hey there :wave:, this PR has been open for **{days}** day(s).
    #
    #  In the spirit for [short lived branches](https://trunkbaseddevelopment.com/short-lived-feature-branches/), let's get this merged soon :rocket:
    message: ''

    # Whether to include Dependabot PRs
    # Default: true
    includeDependabot: ''
```
<!-- end usage -->

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
