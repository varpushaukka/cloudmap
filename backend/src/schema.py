from graphene import ObjectType, String, Schema, List, Field, Float
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

def get_cloud_by_region(region, cloudlist):
    return [cloud for cloud in cloudlist if region in cloud.get('geo_region')]

class Cloud(ObjectType):
    name = String()
    geo_region = String()
    geo_longitude = Float()
    geo_latitude = Float()
    cloud_description = String()

    @staticmethod
    def resolve_name(parent, info):
        return parent["cloud_name"]

    @staticmethod
    def resolve_geo_region(parent, info):
        return parent["geo_region"]

    @staticmethod
    def resolve_longitude(parent, info):
        return parent["geo_longitude"]

    @staticmethod
    def resolve_geo_latitude(parent, info):
        return parent["geo_latitude"]

    @staticmethod
    def resolve_cloud_descrpition(parent, info):
        return parent["cloud_description"]


class Query(ObjectType):
    clouds = Field(List(Cloud), name=String(required=False), region=String(required=False))
 
    @staticmethod
    def resolve_clouds(root, info, name="", region=None):
        result = get_cloud_by_name(name=name)
        if region: return get_cloud_by_region(region=region, cloudlist=result)
        return result