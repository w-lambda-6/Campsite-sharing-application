import redis, json

conn_pool = redis.ConnectionPool(
    host = 'localhost',
    port = 6379,
    decode_responses=True,
)
RedisCache = redis.Redis(connection_pool=conn_pool, decode_responses=True)
RedisCache.ping()

print("connect redis success")

# convert id into a redis string key
def CampDetailKey(id):
    return "camp_detail_%s"%id


# convert detail from dict to JSON(string)
def SetCampDetail(id, detail):
    key = CampDetailKey(id)
    value = json.dumps(detail)
    RedisCache.set(key, value, ex=3600)


# getting data from redis
def GetCampDetail(id):
    key = CampDetailKey(id)
    detail = RedisCache.get(key)
    # convert json(string) to dict
    if detail is not None:
        return json.loads(detail)
    return None


# delete from redis
def DelCampDetail(id):
    key = CampDetailKey(id)
    RedisCache.delete(key)