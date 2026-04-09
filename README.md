# TaskFlow App Deployment

This project is a **TaskFlow App** (frontend + backend + PostgreSQL) with **Docker** and **Ansible** deployment support.

---

## Prerequisites

- **Remote server** with:
  - Docker installed (`docker`)
  - Docker Compose installed (`docker compose`)
  - SSH access
  - Ansible installed for automation
- Local machine with:
  - Git
  - Ansible (for deployment)
  - Docker (optional for local testing)

---

## Directory Structure

taskflow-app/
├─ backend/ # Node.js backend code
│ ├─ Dockerfile
│ ├─ index.js
│ └─ package.json
├─ frontend/ # React frontend code
│ ├─ Dockerfile
│ ├─ App.js
│ └─ App.css
├─ db/
│ └─ init.sql # PostgreSQL initialization
├─ docker-compose.yml # Compose file for all services
├─ default.conf # Nginx reverse proxy config
└─ ansible/
└─ deploy.yml # Ansible playbook to deploy app

---

## Docker Compose

### Services

- **frontend**: React app served by Nginx
- **backend**: Node.js API server
- **postgres**: PostgreSQL database
- **reverse-proxy**: Nginx for routing `/api` and frontend

### Run locally

```bash
docker compose up -d --build

