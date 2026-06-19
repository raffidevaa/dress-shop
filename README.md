# DRESS SHOP

### A full stack e-commerce website for clothing store.

### [Live demo](https://dress-shop.vercel.app/)

## Screenshots

![Thumbnail](dress-home-page.png)

## Stacks

- TypeScript
- Next js
- Node js
- Express js
- MongoDB
- Cloudinary (for image hosting)
- Stripe and Paypal (for payment)
- Vercel (for deployment)

### Clone Repository

```
git clone https://github.com/jrussumbrella/dress-shop-web.git
```

### Client Installation

```
cd dress-shop
cd client
npm install or yarn install
```

#### Add .env.local file to root client directory

```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KY=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

## Server Installation

```
cd server
npm install or yarn install
```

#### Add .env file to root server directory

```
DATABASE_URI=
JWT_SECRET=
STRIPE_SECRET_API_KEY=
GOOGLE_WEB_CLIENT_ID=
GOOGLE_ANDROID_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLIENT_PUBLIC_URL=
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
```

### This will run both client and server

```
npm run dev
```

## Deploy using vercel

### Globally install vercel

```
npm i -g vercel
```

### Client

```
vercel --prod
```

## Server

```
vercel --prod
```

---

## GitHub Workflows Documentation

Documentation for GitHub Actions workflows used for CI/CD, staging, production, Discord Bridge, and Infrastructure in the Dress Shop project.

---

### 1. CI — Code Quality, Tests, and SonarCloud Analysis (`ci.yaml`)

**Trigger:** Every push that changes files in `client/`, `server/`, or `.github/workflows/`.

This workflow first runs a `detect-changes` job to determine which folders were modified, then runs the following jobs conditionally based on the result.

#### Job: `lint-server`
Runs if there are changes in `server/`.
1. Install server dependencies
2. Run ESLint with cache

#### Job: `lint-client`
Runs if there are changes in `client/`.
1. Install client dependencies
2. Run Next.js ESLint with cache

#### Job: `jest-test`
Runs if there are changes in `client/` or `server/`.
1. Install client dependencies
2. Run Jest with coverage report (lcov format)
3. Upload coverage report as an artifact

#### Job: `sonarcloud`
Runs after `jest-test` succeeds.
1. Download coverage artifact from `jest-test`
2. Send code and coverage to SonarCloud for quality and security analysis

#### Job: `build-and-push`
Runs after all jobs above succeed (lint jobs may be skipped, but sonar and jest must pass).
1. Authenticate to Google Cloud and configure Docker for Artifact Registry
2. Build and push server Docker image with tag `:sha-staging`
3. Fetch `NEXT_PUBLIC_API_URL_STAGING`, `GOOGLE_WEB_CLIENT_ID`, and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` from GCP Secret Manager
4. Build and push client Docker image using those secrets as build args, with tag `:sha-staging`

---

### 2. Build & Push Production Images (`build-push-prod.yaml`)

**Trigger:** After the CI workflow completes successfully (runs in parallel with `cd.yaml`).

#### Job: `build-prod`
1. Authenticate to Google Cloud and configure Docker for Artifact Registry
2. Build and push server Docker image with tag `:sha-production`
3. Fetch `NEXT_PUBLIC_API_URL`, `GOOGLE_WEB_CLIENT_ID`, and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` from GCP Secret Manager
4. Build and push client Docker image using those production secrets as build args, with tag `:sha-production`

---

### 3. CD — Deploy Staging & Test (`cd.yaml`)

**Trigger:** After the CI workflow completes successfully.

#### Job: `deploy`
1. Authenticate to Google Cloud
2. Verify server and client images with tag `:sha-staging` exist in Artifact Registry (retry 3x)
3. Deploy `dress-shop-server-staging` and `dress-shop-client-staging` to Cloud Run in parallel with the following config:
   - Region: `asia-southeast1`, port: `8080`, scaling: 0–3 instances
   - Server: memory 1Gi, env `NODE_ENV=staging`, secrets `DATABASE_URI_STAGING`, `GOOGLE_CLIENT_SECRET`, `STRIPE_SECRET_API_KEY`
   - Client: memory 512Mi, env `NODE_ENV=staging`
4. Capture and store staging service URLs as outputs

#### Job: `smoke-test`
Runs after `deploy` succeeds.
1. Install k6
2. Run smoke tests (`client/test/k6/smoke.js`) against the staging URLs

#### Job: `e2e-test`
Runs after `smoke-test` succeeds.
1. Install client dependencies and Cypress binary
2. Run Cypress E2E tests against the staging client URL

---

### 4. CD — Deploy Production (`cd-prod.yaml`)

**Trigger:** After the CD Staging workflow completes successfully (staging smoke tests and E2E tests passed).

#### Job: `deploy-prod`
1. Authenticate to Google Cloud
2. Verify server and client images with tag `:sha-production` exist in Artifact Registry (retry 3x)
3. Deploy `dress-shop-server-production` and `dress-shop-client-production` to Cloud Run in parallel with the following config:
   - Region: `asia-southeast1`, port: `8080`, scaling: 0–10 instances
   - Server: memory 1Gi, env `NODE_ENV=production`, secrets `DATABASE_URI`, `GOOGLE_CLIENT_SECRET`, `STRIPE_SECRET_API_KEY`
   - Client: memory 512Mi, env `NODE_ENV=production`
4. Print the deployed production service URLs

---

### 5. Deploy Discord Bridge Function (`discord-bridge-deploy.yaml`)

**Trigger:** Push to `main` that changes files in `server/functions/discord-bridge/`, or triggered manually.

#### Job: `deploy-function`
1. Authenticate to Google Cloud
2. Deploy Gen 2 Cloud Function `discord-bridge` with the following config:
   - Runtime: Node.js 22, region: `asia-southeast1`
   - Entry point: `discordBridge`, trigger: HTTP
   - Secrets: `DISCORD_WEBHOOK_ALERTS`, `DISCORD_WEBHOOK_ERRORS`, `DISCORD_WEBHOOK_UPTIME`

---

### 6. Infrastructure Deployment (`infra-deploy.yaml`)

**Trigger:** Push or PR to `main` that changes files in `terraform/`, or triggered manually.

#### Job: `terraform`
1. Set up Terraform version 1.7.0
2. `terraform init` — initialize GCS backend and download providers
3. `terraform fmt -check` — validate file formatting
4. `terraform plan` — generate an infrastructure change plan, saved to `tfplan`
5. `terraform apply` — apply the changes (only on push to `main`, not on PRs)

---

### Overall Flow

```
Push to client/ or server/
        ↓
[ci.yaml]
  ├─ detect-changes
  ├─ lint-server & lint-client (parallel)
  ├─ jest-test
  ├─ sonarcloud
  └─ build-and-push (image :sha-staging)
        ↓
    CI passed?
        ├─ YES → [cd.yaml] — Deploy Staging & Test        [build-push-prod.yaml]
        │         ├─ deploy staging (server & client)       └─ build & push image :sha-production
        │         ├─ smoke-test k6 (staging)                     (runs in parallel with cd.yaml)
        │         └─ e2e-test Cypress (staging)
        │               ↓
        │           Staging passed?
        │               ├─ YES → [cd-prod.yaml] — Deploy Production
        │               │         └─ deploy production (server & client)
        │               └─ NO → Stop
        └─ NO → Stop

Push to server/functions/discord-bridge/
        ↓
[discord-bridge-deploy.yaml]
  └─ deploy discord-bridge Cloud Function

Push/PR to terraform/
        ↓
[infra-deploy.yaml]
  ├─ terraform plan (PR)
  └─ terraform apply (push to main)
```
