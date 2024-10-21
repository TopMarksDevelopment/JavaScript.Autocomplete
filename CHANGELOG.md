<!--
Guiding Principles
- Changelogs are for humans, not machines.
- There should be an entry for every single version.
- The same types of changes should be grouped.
- Versions and sections should be linkable.
- The latest version comes first.
- The release date of each version is displayed.
- Mention whether you follow Semantic Versioning.

Types of changes
- Added for new features.
- Changed for changes in existing functionality.
- Deprecated for soon-to-be removed features.
- Removed for now removed features.
- Fixed for any bug fixes.
- Security in case of vulnerabilities.
- Breaking changes for break in new revision
- Other for notable changes that do not
 -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## UNPUBLISHED

### Added

-   A string `source` can now contain `{{term}}`, to accommodate paths where `?term=XXX` isn't suitable
    -   This means you could now use `example.com/search/{{term}}/other-stuff`

### Fixed

-   The mouse being over the popup when it's rendered no longer selects that value whilst typing
-   A string `source` can now contain a query string (`?`)
    -   It now checks the source and adds either `?` or `&`, whichever is appropriate

### Changes

-   Developer dependency bumps (no user-facing changes)
-   Added CI based testing for every PR

## [1.0.1] - 2023-11-14

<small>[Compare to previous release][comp:1.0.1]</small>

### Fixed

-   The position now respects the window scroll position

### Updated

-   `@topmarksdevelopment/position` to `1.0.1` [Changelog][cl:tp]

### Changes

-   Developer dependency bumps (no user-facing changes)
-   Updated publish action, `tslib` requirement and node version (no user-facing changes)

## [1.0.0] - 2022-12-13

**This was the first release**

[comp:1.0.1]: https://github.com/TopMarksDevelopment/JavaScript.Autocomplete/compare/v1.0.0...v1.0.1
[1.0.1]: https://github.com/TopMarksDevelopment/JavaScript.Autocomplete/release/tag/v1.0.1
[1.0.0]: https://github.com/TopMarksDevelopment/JavaScript.Autocomplete/release/tag/v1.0.0
[cl:tp]: https://github.com/TopMarksDevelopment/JavaScript.Position/blob/main/CHANGELOG.md
