import os
import motor
import motor.motor_asyncio

CLIENT = motor.motor_asyncio.AsyncIOMotorClient(os.environ['MONGODB_URL'])
print('successfully connected to MongoDB')
db = CLIENT.get_database('nutric')
entries_collection = db.get_collection('entries')