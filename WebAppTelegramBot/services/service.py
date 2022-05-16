import pymongo
import config

client = pymongo.MongoClient(config.CONNECTION_STRING)

db = client['myGame']

def addUser(chat_id, username, code):
    db['users'].insert_one({"username":username, "chat_id":chat_id, "code":code })

def userExists(chat_id):
    return db['users'].find_one({"chat_id":chat_id})

def codeUpdate(chat_id, code):
    return db['users'].update_many({"chat_id":chat_id}, {"$set": {"code":code} })

def codeExists(code):
    return db['users'].find_one({"code":code})