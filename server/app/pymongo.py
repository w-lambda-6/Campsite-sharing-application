from pymongo import MongoClient

client = MongoClient(
    host="localhost",
    port=27017,
)
MongoDB = client['yelpcamp']
MongoDB.command('ping')


print("connect mongodb success")
