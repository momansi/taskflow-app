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

## Docker Compose

### Services

- **frontend**: React app served by Nginx
- **backend**: Node.js API server
- **postgres**: PostgreSQL database
- **reverse-proxy**: Nginx for routing `/api` and frontend

### Run locally

```bash
docker compose up -d --build
```
---

## Ansible Deployment

You can deploy the TaskFlow app to a remote server using **Ansible**.

```bash
ansible-playbook -i inventory playbook.yml
```
