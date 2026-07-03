# Contributing to Touhou Tales of Danmaku

## Code of Conduct
Please be respectful toward other contributors. Harassment, discriminatory remarks, or toxic behavior of any kind will not be tolerated.

## Reporting a bug
Before opening an issue:
- Check that the bug hasn't already been reported in the existing issues.
- Make sure you're using the latest version of the project (`main` branch).

When opening an issue, please include:
- **Description:** what happens vs. what should happen.
- **Steps to reproduce:** the precise list of actions needed to reproduce the bug.
- **Environment:** browser + version, OS, screen resolution if relevant.
- **Screenshots / console output:** any error visible in the browser console (F12) helps a lot.

## How to propose a feature
Since the project is still under active development (the multiplayer danmaku game hasn't shipped yet), it's recommended to open an issue to discuss your idea before you start coding, to avoid duplicate work or changes that don't fit the project's direction.

### Setting up your development environment
```bash
# 1. Fork the repo, then clone your fork
git clone https://github.com/<your-username>/Touhou-Tales-of-Danmaku.git
cd Touhou-Tales-of-Danmaku

# 2. Add the original repo as the "upstream" remote
git remote add upstream https://github.com/Nyuke235/Touhou-Tales-of-Danmaku.git

# 3. Install dependencies
npm install

# 4. Run the project locally
npm run dev
```

## Code standards

The project uses [Prettier](https://prettier.io/) to keep code formatting consistent.

The project's Prettier config (`.prettierrc`):
- Single quotes (`singleQuote: true`)
- Trailing commas where valid in ES5 (`trailingComma: "es5"`)
- Tabs for indentation, not spaces (`useTabs: true`)
- No parentheses around a single arrow function argument (`arrowParens: "avoid"`)

Note that a few paths are excluded from formatting via `.prettierignore` (build output, `assets/styles/`, `src/systems/Controls.ts`, `src/game/patterns/PatternLibrary.ts`, and the `src/stages/stage*.ts` files), don't be surprised if Prettier leaves those untouched, that's expected.

There's no linter configured yet beyond Prettier. In the meantime, please also follow these common-sense guidelines:
- Use clear, descriptive variable and function names, preferably in English to stay consistent with the existing code.
- Avoid leaving dead or commented-out code before submitting your PR.
- If you add an npm dependency, explain why in the PR description.

## Pull Request review
- A PR must be reviewed and approved before being merged into `main`.
- The maintainer may request changes: feel free to push new commits to the same branch, the PR will update automatically.
- Please be patient, this project is maintained in the maintainer's free time.
