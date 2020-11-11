# cloudmap

## running
run with docker-compose

`docker-compose up`

## developing

### frontend
created with create-react-app

after running docker-compose view [localhost:3000](http://localhost:3000/)

### backend
created with python flask and [graphene](https://graphene-python.org/)

after running docker-compose, you can test the graphql-api with [graphiql](http://localhost:5000/graphql?variables=null&operationName=awsEuropeClouds&query=query%20awsEuropeClouds%20%7B%0A%20%20clouds(name%3A%20%22aws%22%2C%20region%3A%20%22europe%22)%20%7B%0A%20%20%20%20name%0A%20%20%20%20cloudProvider%0A%20%20%20%20cloudDescription%0A%20%20%20%20geoRegion%0A%20%20%20%20geoLatitude%0A%20%20%20%20geoLongitude%0A%20%20%7D%0A%7D%0A)

current api solution supports filtering by name and service region

![mapimage](mapexample.png)
