# 🏥 Smart Healthcare System

A microservices-based healthcare platform built to support core medical workflows such as **authentication, patient management, doctor management, appointments, telemedicine, and prescriptions**.

---

## ✨ Features

- 🔐 User authentication and role-based access
- 👤 Patient profile management
- 🩺 Doctor profile management
- 📅 Appointment booking and management
- 🎥 Telemedicine session support
- 📄 Prescription generation and PDF download
- ☁️ Doctor image upload support
- 🐳 Docker setup
- ☸️ Kubernetes deployment files

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- React Router
- Tailwind CSS
- Lucide React
- Agora RTC SDK
- jsPDF

### Backend
- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- JWT
- PostgreSQL

### DevOps / Infrastructure
- Docker
- Docker Compose
- Kubernetes

---

## 📁 Project Structure

```text
smart_healthcare_system/
├── client/
├── services/
│   ├── appointment-service/
│   ├── auth-service/
│   ├── doctor-service/
│   ├── notification-service/
│   ├── patient-service/
│   ├── payment-service/
│   └── telemedicine-service/
└── infra/
    ├── docker/
    └── k8s/
 ```
---
## 🔧 Main Services

- **Auth Service** – Handles login, registration, and verification.
- **Patient Service** – Manages patient data.
- **Doctor Service** – Manages doctor data and uploads.
- **Appointment Service** – Handles appointment booking and updates.
- **Telemedicine Service** – Manages online consultation sessions.
- **Notification Service** – Handles notification-related functions.
- **Payment Service** – Handles payment-related functions.

---

 ## 🚀 Deployment

This project includes deployment assets under the `infra` directory.

### 📦 Docker Deployment

Use Docker Compose to start the required infrastructure:

```bash
cd infra/docker
docker compose up -d
```
## ☸️ Kubernetes Deployment

Apply the Kubernetes manifests in the following order:
```
kubectl apply -f infra/k8s/auth-service/
kubectl apply -f infra/k8s/patient-service/
kubectl apply -f infra/k8s/doctor-service/
kubectl apply -f infra/k8s/appointment-service/
kubectl apply -f infra/k8s/telemedicine-service/
kubectl apply -f infra/k8s/notification-service/
kubectl apply -f infra/k8s/payment-service/
```

## 📝 Notes

- Start Docker Desktop or a Kubernetes cluster before deployment.
- Deploy the frontend after backend services are running.
- Configure all required environment variables before production deployment.
