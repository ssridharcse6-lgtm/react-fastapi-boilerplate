# react-fastapi-boilerplate

A minimal **full-stack starter template** with a **React frontend** and **FastAPI backend** — ready for rapid development and easy deployment.

---

## 🚀 Tech Stack

| Layer      | Technology                           |
|------------|--------------------------------------|
| Frontend   | React + TypeScript + React-Bootstrap |
| Backend    | FastAPI + SQLAlchemy (Async)         |
| Auth       | OAuth2 + JWT (Bearer Token)          |
| Database   | PostgreSQL / SQLite (configurable)   |

---

## 📁 Folder Structure

│── frontend
│ ├── src/
│ │ ├── components/ProtectedRoute.tsx
│ │ ├── pages / 1.Dashboard.tsx / 2.Login.tsx
│ │ ├── api.ts
│ │ ├── App.tsx
│ │ ├── main.tsx
│── backend/
│ ├── app/
│ │ ├── main.py
│ │ ├── auth.py
│ │ ├── routers / auth_router.py
│ │ ├── crud.py
│ │ ├── models.py
│ │ ├── database.py


---

## 🔧 Setup Instructions

### 1️⃣ Backend Setup (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # (Windows: .venv\Scripts\activate)
pip install -r requirements.txt
uvicorn app.main:app --reload

### 2️⃣ Frontend Setup (React)

cd frontend
npm install
npm start

