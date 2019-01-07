# Version Tracker

Application to facilitate the tracking of microservices versions in use.

## Deploy into OpenShift

Create a project

    oc new-project version-tracker

Create the MongoDB instance

    oc new-app --template=mongodb-persistent -p MONGODB_USER=admin -p MONGODB_PASSWORD=admin -p MONGODB_DATABASE=version -p MONGODB_VERSION=3.6 --DATABASE_SERVICE_NAME=mongodb -l app=mongodb --name mongodb

Then create the version tracker application


    oc create -f version-tracker.yaml

    oc new-app --template=version-tracker