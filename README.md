# RoKa Zap

Aplicação de atendimento e comunicação integrada ao WhatsApp via Z-API, com backend em Node.js/Express, frontend em React 18 (PWA) e infraestrutura baseada em Firebase (Authentication, Firestore, Storage, Functions e Hosting).

## Estrutura geral

- `backend/`: API REST, webhooks, filas e integrações com Z-API e Firebase Admin
- `frontend/`: PWA em React + Vite + Tailwind para atendentes e admin
- `functions/`: Cloud Functions auxiliares

## Instalação

### Pré-requisitos

- Node.js 20+
- Conta Firebase e projeto criado
- Redis (para filas Bull)
- Instância Z-API configurada

### Backend

```bash
cd backend
npm install
npm run dev
```

Variáveis principais (via `.env` ou ambiente):

- `JWT_SECRET`
- `ZAPI_BASE_URL`
- `ZAPI_INSTANCE_TOKEN`
- `WEBHOOK_SIGNATURE`
- `GOOGLE_APPLICATION_CREDENTIALS_JSON` (opcional, credencial de serviço Firebase)
- `SENTRY_DSN` (opcional)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Crie `.env` em `frontend` com:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Deploy com Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase use SEU_PROJETO_FIREBASE

cd frontend
npm run build

cd ..
firebase deploy --only hosting:frontend
```

