# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.15.3](https://github.com/graasp/graasp-desktop/compare/v0.15.2...v0.15.3) (2020-02-28)

### Features

- support math in MediaCard description ([d557400](https://github.com/graasp/graasp-desktop/commit/d5574009ed861de2dd293168cbbb9730eed4b327))
- update mapping.js to include the entry box ([171467a](https://github.com/graasp/graasp-desktop/commit/171467acbc52208dcebf2873af37e37ca0fe28ed))

### Bug Fixes

- Changed name entry to inputBox. ([9836df7](https://github.com/graasp/graasp-desktop/commit/9836df7eb3c80cb3a9577a2b82d0856504133355))
- close div when parsing math ([c6e1931](https://github.com/graasp/graasp-desktop/commit/c6e19310d143e37fdf8c99fa298e4f45f668d316))

### [0.15.2](https://github.com/graasp/graasp-desktop/compare/v0.15.1...v0.15.2) (2020-02-17)

### [0.15.1](https://github.com/graasp/graasp-desktop/compare/v0.15.0...v0.15.1) (2020-02-17)

### Features

- update mapping.js to include twente apps ([189cb7d](https://github.com/graasp/graasp-desktop/commit/189cb7dcf6f3ce932534a77fff08ce486bc868e7))

### Bug Fixes

- only show actions for spaces on user home screen ([65ce373](https://github.com/graasp/graasp-desktop/commit/65ce373e541d7586fe41d158e0c45a822fa472a1)), closes [#203](https://github.com/graasp/graasp-desktop/issues/203)

# [0.15.0](https://github.com/graasp/graasp-desktop/compare/v0.14.0...v0.15.0) (2019-10-28)

### Bug Fixes

- allow building in macos catalina ([69aff4e](https://github.com/graasp/graasp-desktop/commit/69aff4ec2a73d7b7d2282972f0c138fd5b2c613e)), closes [#194](https://github.com/graasp/graasp-desktop/issues/194)
- fix electron version ([e4b3725](https://github.com/graasp/graasp-desktop/commit/e4b3725a65d9de480b8863f80d671877b6a24e78))
- silently catch update error ([cae98e0](https://github.com/graasp/graasp-desktop/commit/cae98e0c49491b74e0852147966b8340aae35a38)), closes [#196](https://github.com/graasp/graasp-desktop/issues/196)

### Features

- allow users to visit a space using a url ([af20a10](https://github.com/graasp/graasp-desktop/commit/af20a1041ce28bab92f495f6c5837706acf0ac7f)), closes [#193](https://github.com/graasp/graasp-desktop/issues/193)

# [0.14.0](https://github.com/graasp/graasp-desktop/compare/v0.13.1...v0.14.0) (2019-09-09)

### Bug Fixes

- correctly import google analytics id ([7391bf5](https://github.com/graasp/graasp-desktop/commit/7391bf5)), closes [#188](https://github.com/graasp/graasp-desktop/issues/188)
- make dialogs modal ([6f1efee](https://github.com/graasp/graasp-desktop/commit/6f1efee)), closes [#152](https://github.com/graasp/graasp-desktop/issues/152)
- reset side menu selection when space is updated ([ceb5983](https://github.com/graasp/graasp-desktop/commit/ceb5983)), closes [#187](https://github.com/graasp/graasp-desktop/issues/187)

### Features

- allow user to delete all user input in a space ([f5ac61d](https://github.com/graasp/graasp-desktop/commit/f5ac61d)), closes [#184](https://github.com/graasp/graasp-desktop/issues/184)

## [0.13.1](https://github.com/graasp/graasp-desktop/compare/v0.13.0...v0.13.1) (2019-08-20)

### Bug Fixes

- fall back on default language for proxied labs ([a7007b2](https://github.com/graasp/graasp-desktop/commit/a7007b2)), closes [#173](https://github.com/graasp/graasp-desktop/issues/173)

# [0.13.0](https://github.com/graasp/graasp-desktop/compare/v0.12.0...v0.13.0) (2019-08-20)

### Features

- support tools in sidebar ([de3e0b8](https://github.com/graasp/graasp-desktop/commit/de3e0b8)), closes [#174](https://github.com/graasp/graasp-desktop/issues/174)

# [0.12.0](https://github.com/graasp/graasp-desktop/compare/v0.11.6...v0.12.0) (2019-08-16)

### Bug Fixes

- add vertical margin between apps/labs ([da3253d](https://github.com/graasp/graasp-desktop/commit/da3253d)), closes [#167](https://github.com/graasp/graasp-desktop/issues/167)
- fix space between apps/labs ([01c0e28](https://github.com/graasp/graasp-desktop/commit/01c0e28)), closes [#167](https://github.com/graasp/graasp-desktop/issues/167)
- hide app content that is below resize div ([9bac761](https://github.com/graasp/graasp-desktop/commit/9bac761)), closes [#172](https://github.com/graasp/graasp-desktop/issues/172)
- show item descriptions ([31d6427](https://github.com/graasp/graasp-desktop/commit/31d6427)), closes [#170](https://github.com/graasp/graasp-desktop/issues/170)

### Features

- remember the height of the apps/labs ([9fa527d](https://github.com/graasp/graasp-desktop/commit/9fa527d)), closes [#165](https://github.com/graasp/graasp-desktop/issues/165)
- support math equations ([1140667](https://github.com/graasp/graasp-desktop/commit/1140667)), closes [#164](https://github.com/graasp/graasp-desktop/issues/164)

## [0.11.6](https://github.com/graasp/graasp-desktop/compare/v0.11.5...v0.11.6) (2019-08-08)

### Bug Fixes

- default to using https if url has no protocol ([3b6441e](https://github.com/graasp/graasp-desktop/commit/3b6441e)), closes [#161](https://github.com/graasp/graasp-desktop/issues/161)
- fix windows exceptions on loading and deleting spaces ([77afd33](https://github.com/graasp/graasp-desktop/commit/77afd33)), closes [#159](https://github.com/graasp/graasp-desktop/issues/159)

## [0.11.5](https://github.com/graasp/graasp-desktop/compare/v0.11.4...v0.11.5) (2019-08-06)

### Bug Fixes

- define homepage in openAboutWindow not package.json ([9b81fc5](https://github.com/graasp/graasp-desktop/commit/9b81fc5)), closes [#156](https://github.com/graasp/graasp-desktop/issues/156)

## [0.11.4](https://github.com/graasp/graasp-desktop/compare/v0.11.3...v0.11.4) (2019-08-06)

### Bug Fixes

- about menu working for Windows and Linux ([27b8826](https://github.com/graasp/graasp-desktop/commit/27b8826)), closes [#134](https://github.com/graasp/graasp-desktop/issues/134)
- display icon image in about menu for pack ([cb45bab](https://github.com/graasp/graasp-desktop/commit/cb45bab)), closes [#134](https://github.com/graasp/graasp-desktop/issues/134)
- do not fail if extension is missing ([b3bf56a](https://github.com/graasp/graasp-desktop/commit/b3bf56a)), closes [#155](https://github.com/graasp/graasp-desktop/issues/155)
- implement translate function correctly ([3816c2d](https://github.com/graasp/graasp-desktop/commit/3816c2d)), closes [#150](https://github.com/graasp/graasp-desktop/issues/150)
- open openAboutWindow after pack ([a7f1b62](https://github.com/graasp/graasp-desktop/commit/a7f1b62))
- remove menu bar from about window (and others) ([13d63ad](https://github.com/graasp/graasp-desktop/commit/13d63ad))
- resolve path for app.getPath for Windows ([714cd5d](https://github.com/graasp/graasp-desktop/commit/714cd5d)), closes [#144](https://github.com/graasp/graasp-desktop/issues/144)
- set bug report link and pull info from package.json in about window ([787b19e](https://github.com/graasp/graasp-desktop/commit/787b19e)), closes [#142](https://github.com/graasp/graasp-desktop/issues/142)

## [0.11.3](https://github.com/graasp/graasp-desktop/compare/v0.11.2...v0.11.3) (2019-07-22)

### Bug Fixes

- use channel specific to each app instance to get resources ([85fa4f4](https://github.com/graasp/graasp-desktop/commit/85fa4f4)), closes [#136](https://github.com/graasp/graasp-desktop/issues/136)

## [0.11.2](https://github.com/graasp/graasp-desktop/compare/v0.11.1...v0.11.2) (2019-07-21)

### Bug Fixes

- only receive messages from intended app ([7b3cfbc](https://github.com/graasp/graasp-desktop/commit/7b3cfbc)), closes [#136](https://github.com/graasp/graasp-desktop/issues/136)

## [0.11.1](https://github.com/graasp/graasp-desktop/compare/v0.11.0...v0.11.1) (2019-07-18)

### Bug Fixes

- only respond to app that sent message ([19f9a3d](https://github.com/graasp/graasp-desktop/commit/19f9a3d)), closes [#136](https://github.com/graasp/graasp-desktop/issues/136)

# [0.11.0](https://github.com/graasp/graasp-desktop/compare/v0.10.1...v0.11.0) (2019-07-17)

### Bug Fixes

- show nearby spaces below header ([4225cce](https://github.com/graasp/graasp-desktop/commit/4225cce)), closes [#138](https://github.com/graasp/graasp-desktop/issues/138)

### Features

- activation / deactivation of location sharing ([455e554](https://github.com/graasp/graasp-desktop/commit/455e554)), closes [#107](https://github.com/graasp/graasp-desktop/issues/107)
- make apps resizable ([f8bd12c](https://github.com/graasp/graasp-desktop/commit/f8bd12c)), closes [#139](https://github.com/graasp/graasp-desktop/issues/139)

## [0.10.1](https://github.com/graasp/graasp-desktop/compare/v0.10.0...v0.10.1) (2019-07-16)

### Bug Fixes

- automatically write env.json with contents from env ([128b276](https://github.com/graasp/graasp-desktop/commit/128b276)), closes [#116](https://github.com/graasp/graasp-desktop/issues/116)
- fix order of commands in dockerfile ([e1176fc](https://github.com/graasp/graasp-desktop/commit/e1176fc)), closes [#123](https://github.com/graasp/graasp-desktop/issues/123)
- setup before testing ([93c360c](https://github.com/graasp/graasp-desktop/commit/93c360c)), closes [#122](https://github.com/graasp/graasp-desktop/issues/122)
- show quicktime videos using mp4 ([1c59c04](https://github.com/graasp/graasp-desktop/commit/1c59c04)), closes [#133](https://github.com/graasp/graasp-desktop/issues/133)
- support editing video and images locally ([4f0e960](https://github.com/graasp/graasp-desktop/commit/4f0e960)), closes [#121](https://github.com/graasp/graasp-desktop/issues/121)

# [0.10.0](https://github.com/graasp/graasp-desktop/compare/v0.9.0...v0.10.0) (2019-07-02)

### Bug Fixes

- update translations ([121725c](https://github.com/graasp/graasp-desktop/commit/121725c)), closes [#120](https://github.com/graasp/graasp-desktop/issues/120)

### Features

- add japanese and swahili ([58ae1f4](https://github.com/graasp/graasp-desktop/commit/58ae1f4)), closes [#101](https://github.com/graasp/graasp-desktop/issues/101) [#119](https://github.com/graasp/graasp-desktop/issues/119)

# [0.9.0](https://github.com/graasp/graasp-desktop/compare/v0.8.1...v0.9.0) (2019-06-21)

### Bug Fixes

- export getSpace correctly ([33fc4a5](https://github.com/graasp/graasp-desktop/commit/33fc4a5)), closes [#111](https://github.com/graasp/graasp-desktop/issues/111)

### Features

- allow a user to sync a space with the remote ([2e468fa](https://github.com/graasp/graasp-desktop/commit/2e468fa)), closes [#114](https://github.com/graasp/graasp-desktop/issues/114)

## [0.8.1](https://github.com/graasp/graasp-desktop/compare/v0.8.0...v0.8.1) (2019-06-21)

### Bug Fixes

- add app instance id to phase app ([dd93a91](https://github.com/graasp/graasp-desktop/commit/dd93a91)), closes [#111](https://github.com/graasp/graasp-desktop/issues/111)

# [0.8.0](https://github.com/graasp/graasp-desktop/compare/v0.7.0...v0.8.0) (2019-06-20)

### Bug Fixes

- allow online use to access app instance ([31d4e59](https://github.com/graasp/graasp-desktop/commit/31d4e59)), closes [#94](https://github.com/graasp/graasp-desktop/issues/94)
- do not fetch from api if space is saved ([3778518](https://github.com/graasp/graasp-desktop/commit/3778518)), closes [#95](https://github.com/graasp/graasp-desktop/issues/95)
- save files to correct directory and rename them in the process ([442755b](https://github.com/graasp/graasp-desktop/commit/442755b)), closes [#103](https://github.com/graasp/graasp-desktop/issues/103)
- specify protocol in url when downloading file ([3accc64](https://github.com/graasp/graasp-desktop/commit/3accc64)), closes [#99](https://github.com/graasp/graasp-desktop/issues/99)
- update call for offline download ([2859b14](https://github.com/graasp/graasp-desktop/commit/2859b14)), closes [#93](https://github.com/graasp/graasp-desktop/issues/93)

### Features

- make banner for warnings, info and errors ([e04951a](https://github.com/graasp/graasp-desktop/commit/e04951a)), closes [#98](https://github.com/graasp/graasp-desktop/issues/98)
- show users when they are previewing a space ([be10b87](https://github.com/graasp/graasp-desktop/commit/be10b87)), closes [#96](https://github.com/graasp/graasp-desktop/issues/96)
- signal when a space does not support offline use ([72d0cf5](https://github.com/graasp/graasp-desktop/commit/72d0cf5)), closes [#105](https://github.com/graasp/graasp-desktop/issues/105)

# [0.7.0](https://github.com/graasp/graasp-desktop/compare/v0.6.0...v0.7.0) (2019-06-12)

### Bug Fixes

- allow urls with query strings ([c2ef55f](https://github.com/graasp/graasp-desktop/commit/c2ef55f)), closes [#92](https://github.com/graasp/graasp-desktop/issues/92)
- show message when no spaces are available ([d187018](https://github.com/graasp/graasp-desktop/commit/d187018)), closes [#91](https://github.com/graasp/graasp-desktop/issues/91)

### Features

- allow developer to edit the database directly ([edc96b7](https://github.com/graasp/graasp-desktop/commit/edc96b7)), closes [#90](https://github.com/graasp/graasp-desktop/issues/90)
- allow user to set app to developer mode ([f8c65bf](https://github.com/graasp/graasp-desktop/commit/f8c65bf)), closes [#88](https://github.com/graasp/graasp-desktop/issues/88)

# [0.6.0](https://github.com/graasp/graasp-desktop/compare/v0.5.0...v0.6.0) (2019-06-11)

### Bug Fixes

- display space description in media card ([fdd9052](https://github.com/graasp/graasp-desktop/commit/fdd9052)), closes [#57](https://github.com/graasp/graasp-desktop/issues/57)
- do not cast id to number ([ed1436c](https://github.com/graasp/graasp-desktop/commit/ed1436c)), closes [#59](https://github.com/graasp/graasp-desktop/issues/59)
- fix default language code ([74028a0](https://github.com/graasp/graasp-desktop/commit/74028a0)), closes [#79](https://github.com/graasp/graasp-desktop/issues/79)
- folder prop is not required ([9b7a3e2](https://github.com/graasp/graasp-desktop/commit/9b7a3e2)), closes [#84](https://github.com/graasp/graasp-desktop/issues/84)
- handle spaces as an immutable set ([2d2b003](https://github.com/graasp/graasp-desktop/commit/2d2b003)), closes [#54](https://github.com/graasp/graasp-desktop/issues/54)
- provide better error handling for invalid space ids ([81a952c](https://github.com/graasp/graasp-desktop/commit/81a952c)), closes [#81](https://github.com/graasp/graasp-desktop/issues/81)
- remove all suffix from languages ([3778274](https://github.com/graasp/graasp-desktop/commit/3778274)), closes [#82](https://github.com/graasp/graasp-desktop/issues/82)
- specify node as prop type for media card button ([61811f9](https://github.com/graasp/graasp-desktop/commit/61811f9)), closes [#85](https://github.com/graasp/graasp-desktop/issues/85)

### Features

- get language for space from space itself ([9e927d4](https://github.com/graasp/graasp-desktop/commit/9e927d4)), closes [#80](https://github.com/graasp/graasp-desktop/issues/80)
- support offline actions ([f4c8b7e](https://github.com/graasp/graasp-desktop/commit/f4c8b7e)), closes [#83](https://github.com/graasp/graasp-desktop/issues/83)

# [0.5.0](https://github.com/graasp/graasp-desktop/compare/v0.4.2...v0.5.0) (2019-05-14)

### Features

- download phet labs in requested language ([3f2c432](https://github.com/graasp/graasp-desktop/commit/3f2c432)), closes [#78](https://github.com/graasp/graasp-desktop/issues/78)
- support multiple languages ([a4c3adf](https://github.com/graasp/graasp-desktop/commit/a4c3adf)), closes [#77](https://github.com/graasp/graasp-desktop/issues/77)

## [0.4.2](https://github.com/graasp/graasp-desktop/compare/v0.4.1...v0.4.2) (2019-05-07)

### Bug Fixes

- make asset paths relative ([731a9cd](https://github.com/graasp/graasp-desktop/commit/731a9cd)), closes [#76](https://github.com/graasp/graasp-desktop/issues/76)

## [0.4.1](https://github.com/graasp/graasp-desktop/compare/v0.4.0...v0.4.1) (2019-05-06)

### Bug Fixes

- fix video resize error ([499bbc9](https://github.com/graasp/graasp-desktop/commit/499bbc9)), closes [#74](https://github.com/graasp/graasp-desktop/issues/74)
- google analytics for universal analytics ([843f49e](https://github.com/graasp/graasp-desktop/commit/843f49e)), closes [#75](https://github.com/graasp/graasp-desktop/issues/75)

# 0.4.0 (2019-05-06)

### Bug Fixes

- clear space when navigating away ([4433367](https://github.com/graasp/graasp-desktop/commit/4433367)), closes [#41](https://github.com/graasp/graasp-desktop/issues/41)
- delete space resources with space ([5db5a2a](https://github.com/graasp/graasp-desktop/commit/5db5a2a)), closes [#11](https://github.com/graasp/graasp-desktop/issues/11)
- do not make geolocation call if offline ([611f988](https://github.com/graasp/graasp-desktop/commit/611f988)), closes [#69](https://github.com/graasp/graasp-desktop/issues/69)
- do not show missing description message ([1deb087](https://github.com/graasp/graasp-desktop/commit/1deb087)), closes [#51](https://github.com/graasp/graasp-desktop/issues/51)
- fileLocation.endsWith is not a function ([17dfa76](https://github.com/graasp/graasp-desktop/commit/17dfa76)), closes [#53](https://github.com/graasp/graasp-desktop/issues/53)
- fix auto update ([4962993](https://github.com/graasp/graasp-desktop/commit/4962993)), closes [#29](https://github.com/graasp/graasp-desktop/issues/29)
- fix error loading zip with load button ([4a634d0](https://github.com/graasp/graasp-desktop/commit/4a634d0)), closes [#70](https://github.com/graasp/graasp-desktop/issues/70)
- fix folder structure ([61844d0](https://github.com/graasp/graasp-desktop/commit/61844d0)), closes [#64](https://github.com/graasp/graasp-desktop/issues/64)
- fix or suppress linting errors ([bccb8f1](https://github.com/graasp/graasp-desktop/commit/bccb8f1)), closes [#30](https://github.com/graasp/graasp-desktop/issues/30)
- log messages correctly ([c284302](https://github.com/graasp/graasp-desktop/commit/c284302)), closes [#31](https://github.com/graasp/graasp-desktop/issues/31)
- minor fixes before open sourcing ([d54b6a2](https://github.com/graasp/graasp-desktop/commit/d54b6a2)), closes [#17](https://github.com/graasp/graasp-desktop/issues/17)
- modify menu options ([22eb7af](https://github.com/graasp/graasp-desktop/commit/22eb7af)), closes [#33](https://github.com/graasp/graasp-desktop/issues/33)
- show loader for nearby spaces ([2397937](https://github.com/graasp/graasp-desktop/commit/2397937)), closes [#72](https://github.com/graasp/graasp-desktop/issues/72)
- update images for cards ([abb647f](https://github.com/graasp/graasp-desktop/commit/abb647f)), closes [#65](https://github.com/graasp/graasp-desktop/issues/65)
- update repository ([fc2ae9c](https://github.com/graasp/graasp-desktop/commit/fc2ae9c)), closes [#28](https://github.com/graasp/graasp-desktop/issues/28)

### Features

- add create react app project ([4ab0059](https://github.com/graasp/graasp-desktop/commit/4ab0059)), closes [#1](https://github.com/graasp/graasp-desktop/issues/1)
- add export and delete ([a8d64e4](https://github.com/graasp/graasp-desktop/commit/a8d64e4)), closes [#5](https://github.com/graasp/graasp-desktop/issues/5)
- add google analytics ([ead4dbc](https://github.com/graasp/graasp-desktop/commit/ead4dbc)), closes [#73](https://github.com/graasp/graasp-desktop/issues/73)
- add icons and fix linting ([a213bcd](https://github.com/graasp/graasp-desktop/commit/a213bcd)), closes [#7](https://github.com/graasp/graasp-desktop/issues/7)
- add pages layout ([bae0c99](https://github.com/graasp/graasp-desktop/commit/bae0c99)), closes [#3](https://github.com/graasp/graasp-desktop/issues/3)
- allow a user to see public spaces nearby ([16d6bec](https://github.com/graasp/graasp-desktop/commit/16d6bec)), closes [#66](https://github.com/graasp/graasp-desktop/issues/66)
- allow labs and apps to work online and offline ([4209a41](https://github.com/graasp/graasp-desktop/commit/4209a41)), closes [#46](https://github.com/graasp/graasp-desktop/issues/46)
- allow spaces to be saved ([1de5dfa](https://github.com/graasp/graasp-desktop/commit/1de5dfa)), closes [#42](https://github.com/graasp/graasp-desktop/issues/42) [#43](https://github.com/graasp/graasp-desktop/issues/43)
- allow user to delete a saved space ([37bc8c4](https://github.com/graasp/graasp-desktop/commit/37bc8c4)), closes [#45](https://github.com/graasp/graasp-desktop/issues/45)
- allow user to export a space ([5de9625](https://github.com/graasp/graasp-desktop/commit/5de9625)), closes [#49](https://github.com/graasp/graasp-desktop/issues/49)
- allow user to load a space ([51788f9](https://github.com/graasp/graasp-desktop/commit/51788f9)), closes [#50](https://github.com/graasp/graasp-desktop/issues/50)
- allow users to visit an online space ([f7c9cfb](https://github.com/graasp/graasp-desktop/commit/f7c9cfb)), closes [#39](https://github.com/graasp/graasp-desktop/issues/39)
- download background image ([5c06280](https://github.com/graasp/graasp-desktop/commit/5c06280)), closes [#13](https://github.com/graasp/graasp-desktop/issues/13)
- download space image for offline use ([7a09413](https://github.com/graasp/graasp-desktop/commit/7a09413)), closes [#47](https://github.com/graasp/graasp-desktop/issues/47)
- enable auto update ([b053ceb](https://github.com/graasp/graasp-desktop/commit/b053ceb)), closes [#24](https://github.com/graasp/graasp-desktop/issues/24)
- get space from lowdb ([3eaee98](https://github.com/graasp/graasp-desktop/commit/3eaee98)), closes [#44](https://github.com/graasp/graasp-desktop/issues/44)
- only allow saving spaces that have been marked as offline ([715bab5](https://github.com/graasp/graasp-desktop/commit/715bab5)), closes [#67](https://github.com/graasp/graasp-desktop/issues/67)
- support local and remote videos ([0b586f6](https://github.com/graasp/graasp-desktop/commit/0b586f6)), closes [#52](https://github.com/graasp/graasp-desktop/issues/52)
- support sentry in the front end ([8ea8c53](https://github.com/graasp/graasp-desktop/commit/8ea8c53)), closes [#63](https://github.com/graasp/graasp-desktop/issues/63)

# [0.3.0](https://github.com/graasp/graasp-desktop/compare/v0.2.0...v0.3.0) (2019-05-04)

### Bug Fixes

- update images for cards ([abb647f](https://github.com/graasp/graasp-desktop/commit/abb647f)), closes [#65](https://github.com/graasp/graasp-desktop/issues/65)

### Features

- allow a user to see public spaces nearby ([16d6bec](https://github.com/graasp/graasp-desktop/commit/16d6bec)), closes [#66](https://github.com/graasp/graasp-desktop/issues/66)
- only allow saving spaces that have been marked as offline ([715bab5](https://github.com/graasp/graasp-desktop/commit/715bab5)), closes [#67](https://github.com/graasp/graasp-desktop/issues/67)

# [0.2.0](https://github.com/graasp/graasp-desktop/compare/v0.1.6...v0.2.0) (2019-05-03)

### Bug Fixes

- clear space when navigating away ([4433367](https://github.com/graasp/graasp-desktop/commit/4433367)), closes [#41](https://github.com/graasp/graasp-desktop/issues/41)
- do not show missing description message ([1deb087](https://github.com/graasp/graasp-desktop/commit/1deb087)), closes [#51](https://github.com/graasp/graasp-desktop/issues/51)
- fileLocation.endsWith is not a function ([17dfa76](https://github.com/graasp/graasp-desktop/commit/17dfa76)), closes [#53](https://github.com/graasp/graasp-desktop/issues/53)
- fix folder structure ([61844d0](https://github.com/graasp/graasp-desktop/commit/61844d0)), closes [#64](https://github.com/graasp/graasp-desktop/issues/64)

### Features

- allow labs and apps to work online and offline ([4209a41](https://github.com/graasp/graasp-desktop/commit/4209a41)), closes [#46](https://github.com/graasp/graasp-desktop/issues/46)
- allow spaces to be saved ([1de5dfa](https://github.com/graasp/graasp-desktop/commit/1de5dfa)), closes [#42](https://github.com/graasp/graasp-desktop/issues/42) [#43](https://github.com/graasp/graasp-desktop/issues/43)
- allow user to delete a saved space ([37bc8c4](https://github.com/graasp/graasp-desktop/commit/37bc8c4)), closes [#45](https://github.com/graasp/graasp-desktop/issues/45)
- allow user to export a space ([5de9625](https://github.com/graasp/graasp-desktop/commit/5de9625)), closes [#49](https://github.com/graasp/graasp-desktop/issues/49)
- allow user to load a space ([51788f9](https://github.com/graasp/graasp-desktop/commit/51788f9)), closes [#50](https://github.com/graasp/graasp-desktop/issues/50)
- allow users to visit an online space ([f7c9cfb](https://github.com/graasp/graasp-desktop/commit/f7c9cfb)), closes [#39](https://github.com/graasp/graasp-desktop/issues/39)
- download space image for offline use ([7a09413](https://github.com/graasp/graasp-desktop/commit/7a09413)), closes [#47](https://github.com/graasp/graasp-desktop/issues/47)
- get space from lowdb ([3eaee98](https://github.com/graasp/graasp-desktop/commit/3eaee98)), closes [#44](https://github.com/graasp/graasp-desktop/issues/44)
- support local and remote videos ([0b586f6](https://github.com/graasp/graasp-desktop/commit/0b586f6)), closes [#52](https://github.com/graasp/graasp-desktop/issues/52)
- support sentry in the front end ([8ea8c53](https://github.com/graasp/graasp-desktop/commit/8ea8c53)), closes [#63](https://github.com/graasp/graasp-desktop/issues/63)

## [0.1.6](https://github.com/graasp/graasp-desktop/compare/v0.1.5...v0.1.6) (2019-04-30)

### Bug Fixes

- modify menu options ([22eb7af](https://github.com/graasp/graasp-desktop/commit/22eb7af)), closes [#33](https://github.com/graasp/graasp-desktop/issues/33)

## [0.1.5](https://github.com/graasp/graasp-desktop/compare/v0.1.4...v0.1.5) (2019-04-30)

## [0.1.4](https://github.com/graasp/graasp-desktop/compare/v0.1.3...v0.1.4) (2019-04-30)

### Bug Fixes

- log messages correctly ([c284302](https://github.com/graasp/graasp-desktop/commit/c284302)), closes [#31](https://github.com/graasp/graasp-desktop/issues/31)

## [0.1.3](https://github.com/graasp/graasp-desktop/compare/v0.1.2...v0.1.3) (2019-04-29)

### Bug Fixes

- fix auto update ([4962993](https://github.com/graasp/graasp-desktop/commit/4962993)), closes [#29](https://github.com/graasp/graasp-desktop/issues/29)
- fix or suppress linting errors ([bccb8f1](https://github.com/graasp/graasp-desktop/commit/bccb8f1)), closes [#30](https://github.com/graasp/graasp-desktop/issues/30)

## [0.1.2](https://github.com/graasp/graasp-desktop/compare/v0.1.1...v0.1.2) (2019-04-29)

### Bug Fixes

- update repository ([fc2ae9c](https://github.com/graasp/graasp-desktop/commit/fc2ae9c)), closes [#28](https://github.com/graasp/graasp-desktop/issues/28)

## [0.1.1](https://github.com/react-epfl/graasp-desktop/compare/v0.1.0...v0.1.1) (2019-04-29)

# 0.1.0 (2019-04-29)

### Bug Fixes

- delete space resources with space ([5db5a2a](https://github.com/react-epfl/graasp-desktop/commit/5db5a2a)), closes [#11](https://github.com/react-epfl/graasp-desktop/issues/11)
- minor fixes before open sourcing ([d54b6a2](https://github.com/react-epfl/graasp-desktop/commit/d54b6a2)), closes [#17](https://github.com/react-epfl/graasp-desktop/issues/17)

### Features

- add create react app project ([4ab0059](https://github.com/react-epfl/graasp-desktop/commit/4ab0059)), closes [#1](https://github.com/react-epfl/graasp-desktop/issues/1)
- add export and delete ([a8d64e4](https://github.com/react-epfl/graasp-desktop/commit/a8d64e4)), closes [#5](https://github.com/react-epfl/graasp-desktop/issues/5)
- add icons and fix linting ([a213bcd](https://github.com/react-epfl/graasp-desktop/commit/a213bcd)), closes [#7](https://github.com/react-epfl/graasp-desktop/issues/7)
- add pages layout ([bae0c99](https://github.com/react-epfl/graasp-desktop/commit/bae0c99)), closes [#3](https://github.com/react-epfl/graasp-desktop/issues/3)
- download background image ([5c06280](https://github.com/react-epfl/graasp-desktop/commit/5c06280)), closes [#13](https://github.com/react-epfl/graasp-desktop/issues/13)
- enable auto update ([b053ceb](https://github.com/react-epfl/graasp-desktop/commit/b053ceb)), closes [#24](https://github.com/react-epfl/graasp-desktop/issues/24)
