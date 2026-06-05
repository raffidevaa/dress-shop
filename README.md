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

Dokumentasi lengkap tentang tiga file workflow GitHub Actions yang digunakan untuk CI/CD dan Infrastructure Deployment dalam proyek Dress Shop.

### Infrastructure Deployment (infra-deploy.yaml)

**Tujuan:** Mengelola infrastruktur cloud menggunakan Terraform.

**Trigger:** Berjalan saat ada push/PR ke branch `main` dengan perubahan di folder `terraform/`.

**Step-by-Step:**

1. **Checkout** - Mengambil kode dari repository
2. **Setup Terraform** - Menginstal Terraform versi 1.7.0
3. **Terraform Init** - Menginisialisasi working directory Terraform, download provider plugins, dan setup backend
4. **Terraform Format Check** - Memeriksa format file Terraform dan memastikan konsistensi kode
5. **Terraform Plan** - Membuat rencana perubahan infrastruktur, menampilkan apa yang akan ditambah/diubah/dihapus. Output disimpan ke file `tfplan`
6. **Terraform Apply** - Menerapkan perubahan infrastruktur ke cloud (hanya berjalan untuk push ke main, bukan untuk PR)

**Used Environment Variables:**
```
TF_VAR_PROJECT_ID      - GCP Project ID
TF_VAR_PROJECT_NUMBER  - GCP Project Number
TF_VAR_REGION          - Region cloud (asia-southeast1)
TF_VAR_DOMAIN          - Domain name
GOOGLE_CREDENTIALS     - GCP credentials JSON
```

---

### CI - Code Quality & Tests (ci.yaml)

**Tujuan:** Menjalankan quality checks, unit tests, dan analisis code security menggunakan SonarCloud.

**Trigger:** Setiap kali ada push ke branch `main`.

#### Job 1: Code Quality (Linting)

1. **Checkout Code** - Mengambil kode terbaru dari repository
2. **Install Server Dependencies** - Menginstal dependencies server dari `server/package.json`
3. **Lint Server** - Menjalankan ESLint untuk code server, memeriksa style guide dan potential bugs
4. **Install Client Dependencies** - Menginstal dependencies client dari `client/package.json` dengan flag `--legacy-peer-deps` untuk mengatasi peer dependency conflicts
5. **Lint Client** - Menjalankan ESLint untuk code client

#### Job 2: Jest Unit Tests

**Kondisi:** Hanya berjalan jika `code-quality` job berhasil.

1. **Install Client Dependencies** - Menginstal ulang dependencies client
2. **Run Jest** - Menjalankan semua test cases di client dengan flags:
   - `--coverage` - Generate coverage report
   - `--coverageReporters=lcov` - Format laporan untuk SonarCloud
   - `--watchAll=false` - Tidak menunggu perubahan file
   - `--forceExit` - Keluar setelah test selesai
3. **Upload Coverage Reports** - Menyimpan coverage reports sebagai artifacts untuk digunakan oleh job `sonarcloud`

#### Job 3: SonarCloud Analysis

**Kondisi:** Hanya berjalan jika `jest-test` job berhasil.

1. **Checkout Code** - Mengambil kode dengan `fetch-depth: 0` untuk semua git history
2. **Download Coverage Reports** - Mengambil coverage reports dari job `jest-test`
3. **Scan with SonarCloud** - Mengirim kode dan coverage reports ke SonarCloud untuk:
   - Analisis code quality
   - Security vulnerability scanning
   - Code duplication detection
   - Coverage metrics analysis

#### Job 4: Build and Push Docker Images

**Kondisi:** Hanya berjalan jika `sonarcloud` job berhasil.

1. **Authenticate to Google Cloud** - Login ke GCP menggunakan credentials
2. **Set up Cloud SDK** - Menginstal Google Cloud SDK
3. **Configure Docker for GCR** - Konfigurasi Docker untuk push ke Google Artifact Registry (asia-southeast1)
4. **Build and Push Server Image** - Build Docker image server dari `server/` dan push ke registry dengan tags:
   - Commit SHA (untuk versioning)
   - `latest` (untuk latest release)
5. **Build and Push Client Image** - Fetch secret `NEXT_PUBLIC_API_URL` dari GCP Secret Manager, build image client dengan environment variable ini, dan push ke registry

**Used Secrets:**
```
GCP_PROJECT_ID          - GCP Project ID
GCP_CREDENTIALS         - GCP Service Account JSON
SONAR_TOKEN             - SonarCloud authentication token
SONAR_PROJECT_KEY       - SonarCloud project key
SONAR_ORGANIZATION_KEY  - SonarCloud organization key
NEXT_PUBLIC_API_URL     - API endpoint untuk client
```

---

### CD - Direct Deploy to Cloud Run (cd.yaml)

**Tujuan:** Melakukan deployment ke Google Cloud Run setelah CI workflow berhasil.

**Trigger:** Setelah workflow `ci.yaml` selesai (berhasil atau gagal).

#### Deploy Job

1. **Checkout Code** - Mengambil kode terbaru
2. **Authenticate to Google Cloud** - Login ke GCP menggunakan credentials
3. **Set up Cloud SDK** - Menginstal gcloud CLI tools
4. **Verify Server Image Exists** - Memastikan Docker image server sudah di-push ke GCR menggunakan commit SHA
5. **Deploy Server to Cloud Run** - Deploy server dengan konfigurasi:
   - Region: asia-southeast1
   - Platform: managed
   - Allow unauthenticated access
   - Port: 8080
   - Memory: 512Mi, CPU: 1
   - Scaling: 0-10 instances
   - Environment: NODE_ENV=production
   - Secrets: DATABASE_URI dari Secret Manager
6. **Verify Client Image Exists** - Memastikan Docker image client sudah di-push
7. **Deploy Client to Cloud Run** - Deploy client dengan konfigurasi serupa server (tanpa secrets)
8. **Print Service URLs** - Menampilkan URL service yang baru di-deploy
9. **Deploy Discord Bridge Cloud Function** - Deploy Cloud Function Gen 2 dengan:
   - Runtime: Node.js 22
   - Source: `server/functions/discord-bridge`
   - Trigger: HTTP
   - Secrets: Discord webhooks (alerts, errors, uptime)

#### Post-Deployment Tests Job

**Kondisi:** Hanya berjalan setelah `deploy` job berhasil.

1. **Checkout Code** - Mengambil kode repository
2. **Setup k6** - Menginstal k6 untuk load testing
3. **Run k6 Smoke Tests** - Menjalankan smoke tests dari `k6/smoke-test.js` untuk validasi basic functionality
4. **Setup Node.js** - Menginstal Node.js versi 18
5. **Install Client Dependencies** - Menginstal dependencies client
6. **Run Cypress E2E Tests** - Menjalankan end-to-end tests dengan Cypress untuk validasi user workflows

**Used Secrets:**
```
GCP_PROJECT_ID              - GCP Project ID
GCP_CREDENTIALS             - GCP Service Account JSON
DATABASE_URI                - Database connection string
DISCORD_WEBHOOK_ALERTS      - Discord webhook untuk alerts
DISCORD_WEBHOOK_ERRORS      - Discord webhook untuk errors
DISCORD_WEBHOOK_UPTIME      - Discord webhook untuk uptime
```

---

### Overall Flow

**Development Cycle Complete:**

```
Developer Push Code
        ↓
[CI WORKFLOW - ci.yaml]
  ├─ Code Quality Check (Linting)
  ├─ Unit Tests (Jest)
  ├─ SonarCloud Analysis
  └─ Build & Push Docker Images
        ↓
    (CI Success?)
        ├─ YES → [CD WORKFLOW - cd.yaml]
        │         ├─ Deploy Server to Cloud Run
        │         ├─ Deploy Client to Cloud Run
        │         ├─ Deploy Discord Bridge Function
        │         ├─ Print Service URLs
        │         └─ Post-Deployment Tests
        │             ├─ k6 Smoke Tests
        │             └─ Cypress E2E Tests
        │
        └─ NO → Stop (Notify Developer)

Terpisah: Infrastructure Changes
        ↓
  [INFRA WORKFLOW - infra-deploy.yaml]
  ├─ Terraform Init
  ├─ Format Check
  ├─ Terraform Plan
  └─ Terraform Apply (on main push only)
```
