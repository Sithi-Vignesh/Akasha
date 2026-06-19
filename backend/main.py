from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from core.config import ALLOWED_ORIGINS

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods = ["*"],
    allow_credentials = True,
    allow_headers = ["*"]
)
app.include_router(router, prefix="/api")