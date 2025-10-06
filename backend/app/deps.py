from .database import AsyncSessionLocal
from contextlib import asynccontextmanager


@asynccontextmanager
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()