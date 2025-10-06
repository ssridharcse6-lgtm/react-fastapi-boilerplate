from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from .models import User

async def get_user_by_username(db: AsyncSession, username: str):
    async with db as session:
        q = select(User).where(User.username == username)
        result = await session.execute(q)
        return result.scalars().first()
    
# Create new user
async def create_user(db: AsyncSession, username: str, email: str, hashed_password: str):
    async with db as session:
        new_user = User(username=username, email=email, hashed_password=hashed_password)
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)
        return new_user