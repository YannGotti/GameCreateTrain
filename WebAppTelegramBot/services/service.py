import pymongo
import config

client = pymongo.MongoClient(config.CONNECTION_STRING)

db = client['myGame']

def addUser(chat_id, username, code):
    db['users'].insert_one({"username":username, "chat_id":chat_id, "code":code })

def userExists(chat_id):
    db['users'].find({"chat_id":chat_id})
