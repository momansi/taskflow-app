# 📌 TaskFlow – DevOps CI/CD Kubernetes Project

## 🚀 Overview

TaskFlow is a full-stack task management application deployed using a complete **DevOps CI/CD pipeline**.  
It demonstrates modern cloud-native practices including:

- Dockerized microservices
- Jenkins CI/CD pipeline
- Ansible automation
- Kubernetes deployment (Minikube)
- Ingress-based routing (NGINX)
- PostgreSQL StatefulSet
- Prometheus + Grafana monitoring
- Load testing & metrics analysis

---

# 🏗️ System Architecture

![Alt](images/full-flow.png)

# 🧱 Tech Stack
## Backend

- Node.js (Express)
- PostgreSQL
- JWT Authentication
- bcrypt password hashing

## Frontend
- React

## DevOps Tools

- Jenkins
- Docker
- Ansible
- Kubernetes (Minikube)
- NGINX Ingress
- Helm (kube-prometheus-stack)
- Prometheus
- Grafana

# 🔄 Deployment Flow

- Developer pushes code to GitHub
- Jenkins triggers pipeline
- Docker images built
- Images pushed to Docker Hub
- Ansible connects to Kubernetes server
- Manifests rendered (Jinja2 templates)
- kubectl apply executed
- App deployed + restarted automatically
- Prometheus scrapes metrics
- Grafana visualizes performance

# 🔁 CI/CD Pipeline
## ⚙️ Jenkins Pipeline Stages

![Alt](images/Screenshot%20from%202026-04-22%2001-42-41.png)

# 📦 Kubernetes Components

| Component  | Type                 |
| ---------- | -------------------- |
| Frontend   | Deployment + Service |
| Backend    | Deployment + Service |
| PostgreSQL | StatefulSet + PVC    |
| Ingress    | NGINX Ingress        |
| Config     | ConfigMap            |
| Secrets    | Kubernetes Secret    |

![Alt](images/Screenshot%20from%202026-04-22%2001-38-07.png)

# 📈 Monitoring Setup

### CPU Usage
```bash
rate(container_cpu_usage_seconds_total{namespace="taskflow-app"}[5m])
```

### Memory Usage
```bash
container_memory_working_set_bytes{namespace="taskflow-app"}
```

### CPU vs Requests
```bash
sum(rate(container_cpu_usage_seconds_total{namespace="taskflow-app"}[5m]))
/
sum(kube_pod_container_resource_requests{namespace="taskflow-app", resource="cpu"})
```

# 🚦 Load Testing

A simple load generator pod was used to simulate traffic:

- 10000+ API requests
- Concurrent requests
- Verified CPU & memory spikes in Grafana

![Alt](images/Screenshot%20from%202026-04-22%2001-16-22.png)

# TaskFlow App

![Alt](images/Screenshot%20from%202026-04-22%2001-39-27.png)

![Alt](images/Screenshot%20from%202026-04-22%2001-39-14.png)
