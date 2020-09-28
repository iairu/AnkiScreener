# A modest documentation...

## Folders

| Folder       | Description                                                  |
| ------------ | ------------------------------------------------------------ |
| node_modules | NPM Libraries, see `package.json`                            |
| public       | Built `svelte` front-end, done through scripts in `package.json` |
| src          | Source files (svelte front-end, electron main, support node files) |

## Contents of src

| File             | What it does                                                 |
| ---------------- | ------------------------------------------------------------ |
| App.svelte       | Front-end entry point with actual content linking to /menu and /canvas components |
| App.scss         | Any (S)CSS that doesn't have to instantly load should be here |
| controller.js    | Communicates between `electron` and front-end, is importable by any svelte components. Put all `electron` communication here. |
| electron.js      | Initialization of `electron`, incl. main window.             |
| fsman.js         | Manager for any file system operations, use node's built-in `fs` package here. Should only be imported by controller.js |
| store.js         | `Svelte`'s way of state management, is imported mainly by front-end and sometimes by controller.js. Any operations should be done through respective functions defined in this file. The file should only import from "svelte/store". This is the main way to store volatile data. |
| svelte.config.js | Additional configuration for svelte to enable proper SCSS support. |
| svelte.js        | Initialization of svelte handled by `rollup.config.js`       |
| rollup.config.js | Is actually not in `src` folder, but above, handles svelte plugins, export and development state. |

## Component folders

| Folder     | What it's meant for                                          |
| ---------- | ------------------------------------------------------------ |
| src/canvas | Anything that has to do with drawing or visualizing mostly picture-based data. |
| src/menu   | Anything that has to do with the little side menu for quick controls and metadata management. |

## Root folder contents

| File              | What it does                                                 |
| ----------------- | ------------------------------------------------------------ |
| .gitignore        | Files/folders left out of `git` repository's version management, these include giant non-unique stuff like `node_modules` that can just be re-downloaded from `npm`. |
| concurrently.js   | A script to run svelte development server alongside electron for live reload. |
| DOCS.md           | Hosts this documentation.                                    |
| package.json      | List of dependencies used in this project (contained in `node_modules`), some license info and most importantly `npm run` scripts to get often used CLI stuff done quickly. |
| package-lock.json | `npm` auto-managed info for `node_modules` versions and some other stuff, it should not be `.gitignore`'d because it can apparently be useful (use google) |
| README.md         | Some introduction for the *GitHub* repository.               |
| rollup.config.js  | Handles svelte plugins, export and development state, is the main entry point for building svelte through `npm run` scripts. |

## Bugs

Search for "TODO" && "BUG" in all `/src` files.