from graphene import ObjectType, String, Schema, List, Field
from functools import lru_cache

import http.client
import json

conn = http.client.HTTPSConnection("api.aiven.io")

conn.request("GET", "/v1/clouds")

res = conn.getresponse()

data = res.read()

@lru_cache(maxsize=1000)
def list_clouds():
    return json.loads(data).get("clouds")

def get_cloud_by_name(name):
    return [cloud for cloud in list_clouds() if name in cloud.get('cloud_name')]

class Cloud(ObjectType):
    name = String()
    geo_region= String()

    @staticmethod
    def resolve_name(parent, info):
        return parent["cloud_name"]
    @staticmethod
    def resolve_geo_region(parent, info):
        return parent["geo_region"]


class Query(ObjectType):
    # this defines a Field `hello` in our Schema with a single Argument `name`
    hello = String(name=String(default_value="stranger"))
    goodbye = String()
    clouds = Field(List(Cloud), name=String(required=True))

    # our Resolver method takes the GraphQL context (root, info) as well as
    # Argument (name) for the Field and returns data for the query Response
    def resolve_hello(root, info, name):
        return f'Hello {name}!'

    def resolve_goodbye(root, info):
        return 'See ya!'
 
    @staticmethod
    def resolve_clouds(root, info, name):
        return get_cloud_by_name(name=name)