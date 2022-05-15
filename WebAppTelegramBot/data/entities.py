from pyparsing import Char
from config import CONNECTION_STRING
from email.policy import default
from sqlalchemy import create_engine, Integer, String, \
    Column, ForeignKey, Boolean, ARRAY, BigInteger, null

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy_utils import database_exists, create_database

engine = create_engine(CONNECTION_STRING)

if not database_exists(engine.url):
    create_database(engine.url)


Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer(), primary_key=True)
    chat_id = Column(BigInteger(), nullable=False)
    username = Column(String(100), nullable=False)
    code = Column(String(6), nullable=True)


Base.metadata.create_all(engine)