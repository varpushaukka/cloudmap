from graphene import ObjectType, String, Schema, List
from flask import Flask
from flask_graphql import GraphQLView
from functools import lru_cache
import schema as s

import http.client

conn = http.client.HTTPSConnection("api.aiven.io")

conn.request("GET", "/v1/clouds")

res = conn.getresponse()

data = res.read()

print(data.decode("utf-8"))

schema = Schema(query=s.Query)

# we can query for our field (with the default argument)
query_string = '{ hello }'
result = schema.execute(query_string)
print(result.data['hello'])
# "Hello stranger!"

# or passing the argument in the query
query_with_argument = '{ hello(name: "GraphQL") }'
result = schema.execute(query_with_argument)
print(result.data['hello'])
# "Hello GraphQL!"


app = Flask(__name__)

app.add_url_rule('/graphql', view_func=GraphQLView.as_view(
    'graphql',
    schema=schema,
    graphiql=True,
))



if __name__ == '__main__':
    app.run()