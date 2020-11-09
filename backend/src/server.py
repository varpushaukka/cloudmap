from graphene import Schema
from flask import Flask
from flask_graphql import GraphQLView
from functools import lru_cache
import schema as s

import http.client

schema = Schema(query=s.Query)

app = Flask(__name__)

app.add_url_rule('/graphql', view_func=GraphQLView.as_view(
    'graphql',
    schema=schema,
    graphiql=True,
))

if __name__ == '__main__':
    app.run()