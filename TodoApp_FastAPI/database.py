
# database.py file is to create our URL string which will connect our fast API application to our new database.
# using SQL Lite. To create some other information to be able to open up the database connection,
# to close the database connection, be able to create some database tables
# SQLAlchemy is an ORM, which is object relational mapping, which is what our fast API application
# is going to use to be able to create a database and be able to create a connection to a database and
# being able to use all of the database records within our application.

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Get database URL from environment variable or use default
SQLALCHEMY_DATABASE_URL = os.getenv(
    'DATABASE_URL',
    'postgresql://hsmadhusudhan@localhost:5432/TodoApplicationDatabase'
)

# to create an engine for our application, a database engine is something that we can use to open up a 
# connection and use our database.
engine = create_engine(SQLALCHEMY_DATABASE_URL)
# engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={'check_same_thread':False}) - for sqlite
SessionLocal=sessionmaker(autocommit=False,autoflush=False,bind=engine)

Base = declarative_base()



