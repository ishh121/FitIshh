# FitIshh

An AI-powered fitness, nutrition, and family wellness application built with React, TypeScript, and Vite.

## Project layout

- `frontend/` contains the React/Vite application and its frontend build configuration.
- `backend/` contains the Express API and MongoDB integration.
- `api/` contains the Vercel function adapter that forwards `/api/*` requests to the backend.
- Root `package.json` scripts orchestrate local development and production builds.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## MongoDB API

The Atlas connection is kept on the server and is never added to the Vite client.

1. Copy `.env.example` to `.env` and replace `MONGODB_URI` with the connection string from Atlas. Add `/fitishh` as the database name before the query string if it is not already present.
2. Start the API in one terminal with `npm run dev:api`.
3. Start the Vite app in another terminal with `npm run dev`.
4. Open `http://localhost:5173/api/health`. A successful response is `{"status":"ok","database":"connected"}`.

Keep `.env` private. Never use the Atlas URI in a `VITE_` variable or paste it into client-side code.

The scanner's **Save Sample Meal** action writes an explicitly labeled demo record to the authenticated user's `meal_logs` collection. Registration and sign-in use salted password hashes and MongoDB-backed HTTP-only sessions. The API is rate-limited and validates meal data.

### Vercel deployment

Vercel serves the Vite build from `dist` and routes `/api/*` to the Express function in `api/[...path].js`. The `vercel.json` file configures the build output, SPA fallback, and response security headers.

1. Push the project to a private Git repository and import it into Vercel. The repository root is the project root.
2. In **Project Settings → Environment Variables**, add `MONGODB_URI` and `SESSION_SECRET` for Production. Add them to Preview only if you also want preview deployments to use the database.
3. Generate `SESSION_SECRET` locally with `node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"`. Never commit it or use the exposed database password; rotate that password in Atlas first.
4. Keep the Vercel build command as `npm run build` and output directory as `dist` (both are set in `vercel.json`).
5. In Atlas Network Access, allow Vercel's static egress IPs. Vercel documents Static IPs for Pro and Enterprise plans (currently $100/month per project, plus data transfer). Vercel's default function egress is dynamic; do not use `0.0.0.0/0` for a public production database. If static egress is outside your budget, keep the deployment private or put the API on a host with fixed outbound IPs.
6. Deploy and test `/api/health`, account registration/sign-in, and saving a sample meal. Confirm `/api/meal-logs` returns `401` when signed out.

Use `npx vercel dev` to test Vercel routing locally after linking the project. The standalone `npm run dev` plus `npm run dev:api` commands remain available for ordinary local development.

This is a safer deployment baseline, not a complete public health-data product: add email verification, password reset, account deletion/data export, privacy consent and policy, and operational monitoring before collecting real user data.
