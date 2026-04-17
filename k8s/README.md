# ☸️ Kubernetes Deployment — TaskFlow App

This cluster demonstrates a Kubernetes deployment of an application with a PostgreSQL database using a **StatefulSet** and various Kubernetes resources. The setup includes a multi-container environment orchestrated by Kubernetes, with services, StatefulSets, and deployments managed under the `taskflow-app` namespace.

---


## 📁 Project Structure

```
k8s/
├── namespace.yml       # Namespace definition
├── configmap.yml       # App configuration
├── secret.yml          # Sensitive credentials
├── init.yml            # Initialization resources
├── headless-svc.yml    # Headless service for StatefulSet
├── postgres.yml        # PostgreSQL StatefulSet
├── backend.yml         # Backend deployment
├── frontend.yml        # Frontend deployment
└── ingress.yml         # Ingress rules
```

---

## 📋 Prerequisites

Before deploying the application, ensure the following are installed and configured:

- A running Kubernetes cluster (e.g. [Minikube](https://minikube.sigs.k8s.io/))
- [`kubectl`](https://kubernetes.io/docs/tasks/tools/) CLI installed and configured
- Ingress controller enabled:

```bash
minikube addons enable ingress
```

---

## 🚀 Deployment Steps

### 1️⃣ Create Namespace

```bash
kubectl apply -f k8s/namespace.yml
```

### 2️⃣ Apply Configurations

```bash
kubectl apply -f k8s/configmap.yml
kubectl apply -f k8s/secret.yml
kubectl apply -f k8s/init.yml
```

### 3️⃣ Deploy Database (StatefulSet)

```bash
kubectl apply -f k8s/headless-svc.yml
kubectl apply -f k8s/postgres.yml
```

### 4️⃣ Deploy Backend

```bash
kubectl apply -f k8s/backend.yml
```

### 5️⃣ Deploy Frontend

```bash
kubectl apply -f k8s/frontend.yml
```

### 6️⃣ Deploy Ingress

```bash
kubectl apply -f k8s/ingress.yml
```

---

## ✅ Verify Deployment

```bash
kubectl get pods -n taskflow-app
kubectl get pvc -n taskflow-app
```

---

## 🌐 Access the App

### Get the Ingress IP

```bash
kubectl get ingress -n taskflow-app
```

Example output:

```
NAME       CLASS   HOSTS            ADDRESS         PORTS
ingress    nginx   taskflow.local   192.168.49.2    80
```

---

### Option 1 — cURL

```bash
curl -H "Host: localhost" http://192.168.49.2
```

---

### Option 2 — Browser (Recommended)

**Step 1:** Edit your `/etc/hosts` file:

```bash
sudo nano /etc/hosts
```

**Step 2:** Add the following line:

```
192.168.49.2 taskflow.local
```

**Step 3:** Open your browser and navigate to:

```
http://taskflow.local
```
