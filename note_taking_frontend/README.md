<!--
CRITICAL PROJECT NOTES (DEV/MAINTAINER READ CAREFULLY):

- index.html MUST ALWAYS be present ONLY at the project root; never inside dist/.
- If a build step outputs dist/index.html, move it to project root and remove the copy from dist/.
- No dev server, vite config, or script must ever write to or modify .env* or the dist/ folder in development.
- Vite watcher/server must always have dist/** and .env* in server.watch.ignored, as seen in vite.config.js.
- .gitignore or .viteignore should include dist/ and .env* for safety.
- If you see repeated reloads or dev instability, re-validate these invariants first!

-->

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
