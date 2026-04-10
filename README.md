# Research Registry UI

A modern React-based frontend for managing research studies, participants, and application workflows.
This application connects to a Django REST API and provides a clean dashboard interface for researchers and administrators.

---

## 🚀 Overview

The Research Registry UI allows users to:

* View and manage research studies
* Browse participant data
* Review and manage study applications
* Approve or reject applications (role-based)
* Export data asynchronously (CSV exports)
* Download generated export files

The project is designed as a **full-stack system**, focusing on clean architecture, API integration, and scalable UI patterns.

---

## 🧱 Tech Stack

### Frontend

* React (TypeScript)
* Axios (API communication)
* Tailwind CSS (UI styling)
* TailAdmin UI components (see License section below)

### Backend (separate project)

* Django
* Django REST Framework (DRF)
* PostgreSQL
* JWT Authentication
* Asynchronous export jobs

---

## 🐳 Docker Setup

This project is fully containerized and intended to run via **Docker and Docker Compose**.

### Requirements

* Docker
* Docker Compose

---

## ⚙️ Running the Project

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd research_registry_ui
```

---

### 2. Run using Makefile

The project includes a **Makefile** to simplify common commands.

Start the application:

```bash
make up
```

This will:

* Build the Docker image
* Start the frontend container
* Connect it to the required Docker network

---

### 3. Stop the project

```bash
make down
```

---

### 4. Rebuild (if needed)

```bash
make build
```

---

## 🔗 Backend Integration

This frontend communicates with the backend via REST API endpoints under:

```txt
/api/
```

Examples:

* `/api/applications/`
* `/api/studies/`
* `/api/participants/`
* `/api/exports/`
* `/api/exports/{id}/download/`

### Local Development Assumptions

* Frontend runs in Docker (port 3000)
* Backend runs on: `http://127.0.0.1:8000`

A proxy or network configuration ensures that:

```txt
/api/*
```

is routed to the backend.

---

## ⚙️ Features

### Applications Dashboard

* Pagination
* Filtering (status, study, participant, reviewer)
* Ordering (id, status, reviewer)
* Approve / Reject actions (role-based permissions)

### Export System

* Create export jobs (CSV)
* Track export status
* Download completed exports

### UI

* Responsive layout
* Action buttons with loading states

---

## 🔐 Authentication

* Uses JWT authentication
* Token is stored in localStorage
* Axios automatically attaches:

```txt
Authorization: Bearer <token>
```

---

## 📂 Project Structure

```txt
src/
├── api/              # Axios configuration
├── components/       # Reusable UI components
├── pages/            # Main pages (Applications, Exports, etc.)
├── types.ts          # Shared TypeScript types
├── App.tsx
└── main.tsx
```

---

## 📜 License & UI Template

This project uses the **TailAdmin** dashboard template.

* TailAdmin is a third-party UI template
* Usage must comply with its official license
* This repository includes only the necessary adapted components for learning purposes

👉 If you plan to use this project commercially, please ensure you have a valid license for TailAdmin.

Official website: https://tailadmin.com/

---

## 📌 Notes

* Export downloads are handled via authenticated API requests
* The frontend relies on backend permissions for access control
* The project is intended for learning and demonstration purposes

---

## 👨‍💻 Author

Stavros Charitakis

---

## 🧠 Purpose

This project was built as a hands-on learning experience to:

* Strengthen full-stack development skills
* Practice real-world API integration
* Understand scalable frontend architecture
* Work with asynchronous backend processes

---
