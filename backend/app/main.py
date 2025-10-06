from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from .database import engine, init_db
from .routers import auth_router, user_router, chat_router

app = FastAPI(title="React-FastAPI Boilerplate")

# Allow front-end origins (adjust ports if your React runs on a different port)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(chat_router.router)

@app.on_event("startup")
async def startup_event():
    # create tables on startup (for demo)
    await init_db()

@app.get("/health")
async def health():
    return {"status": "ok"}
