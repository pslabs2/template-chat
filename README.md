# template-chat

A modern chatbot: FastAPI backend (`backend/`) + Vite/React frontend (`frontend/`)
with token streaming over Server-Sent Events.

## Quick start

```bash
# terminal 1
cd backend && uv sync && uv run uvicorn app.main:app --reload

# terminal 2
cd frontend && npm install && npm run dev
```

Open http://localhost:5173. The backend uses a placeholder echo provider — see
`backend/README.md` to wire up a real LLM.

## Container images

`.github/workflows/cd.yaml` builds multi-arch images on pull requests (without pushing) and
publishes them to GHCR on pushes to `main` and `v*` tags:

- `ghcr.io/<owner>/<repo>-backend` – FastAPI on port 8000
- `ghcr.io/<owner>/<repo>-frontend` – unprivileged nginx on port 8080 serving the static build and proxying
  `/api` to `BACKEND_URL` (default `http://backend:8000`)

```bash
docker network create chat
docker run -d --name backend --network chat ghcr.io/<owner>/<repo>-backend
docker run -d --network chat -p 8080:8080 ghcr.io/<owner>/<repo>-frontend
```

## Deploying to the cluster

After the images are published from `main`, the `onboard` job in `cd.yaml` adds the app to
[pslabs2/infra](https://github.com/pslabs2/infra), and Argo CD deploys it to the `<repo>` namespace at
`http://<repo>.localhost`. The job commits `apps/<repo>/values.yaml` (seeded from
[`deploy/values.yaml`](deploy/values.yaml)) and `clusters/homelab/<repo>.yaml` straight to infra's
`main`. Once the app is onboarded, the job does nothing; manage the deployment in infra.

The job needs write access to pslabs2/infra, provided as organization (or repository) settings:

- a GitHub App with **Contents: read and write** on pslabs2/infra: the variable `INFRA_APP_CLIENT_ID`
  and the secret `INFRA_APP_PRIVATE_KEY`, or
- a fine-grained personal access token with the same permission: the secret `INFRA_TOKEN`.

See [onboard-app](https://github.com/pslabs2/workflows#onboarding-to-infra-argo-cd) for options such
as a public `ingress-host`.
