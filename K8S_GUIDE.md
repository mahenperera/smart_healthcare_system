# ☸️ Kubernetes Setup Guide

Follow these steps to run the Smart Healthcare Platform on your local machine using Kubernetes.

## 1. Prerequisites
- **Docker Desktop** installed.
- **Kubernetes** enabled in Docker Desktop.
- **Resources**: In Docker Desktop Settings -> Resources, set **Memory to 8GB** and **CPUs to 4**.

## 2. Preparation
First, build the local images so Kubernetes can find them:
```bash
# Run from the project root
docker-compose build
```

Install the Nginx Ingress Controller (the API gateway):
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
```

## 3. Deployment
Run these commands in order from the project root:

```bash
# 1. Create the namespace
kubectl apply -f infra/k8s/namespace.yml

# 2. Setup shared configs and secrets
kubectl apply -f infra/k8s/common/common-configs.yml

# 3. Deploy all microservices and Ingress
kubectl apply -f infra/k8s/
```

## 4. Verify
Wait for all pods to be in the **Running** state:
```bash
kubectl get pods -n smart-healthcare
```

## 5. Frontend
The frontend is configured to talk to the backend via `http://localhost/api`.
```bash
cd client
npm install
npm run dev
```

## 6. Cleanup
To stop everything:
```bash
kubectl delete -f infra/k8s/
```
