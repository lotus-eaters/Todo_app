# Environment configuration for different deployment scenarios

import os
from typing import List

# Determine environment
ENV = os.getenv('ENV', 'development')

# CORS configuration based on environment
if ENV == 'production':
    ALLOWED_ORIGINS: List[str] = [
        "https://your-vercel-domain.vercel.app",
        # Add your production frontend URL here
    ]
elif ENV == 'staging':
    ALLOWED_ORIGINS: List[str] = [
        "https://staging-frontend.vercel.app",
        "http://localhost:8080",
        "http://localhost:3000",
    ]
else:  # development
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:8080",
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:3000",
        "http://0.0.0.0:8080",
    ]

# Database configuration
DATABASE_URL = os.getenv(
    'DATABASE_URL',
    'postgresql://hsmadhusudhan@localhost:5432/TodoApplicationDatabase'
)

# Security
SECRET_KEY = os.getenv('SECRET_KEY', '0d1cbf3f7e351a7b99f75cdd2b7617dda3ca555c6a5144a84aa2ec021d6726e3')
ALGORITHM = os.getenv('ALGORITHM', 'HS256')
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', '20'))

# API Configuration
DEBUG = ENV == 'development'
