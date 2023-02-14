# VP Resource Interface (Backend)

The EJP-RD VP Resource Interface component, which implements a REST API that can be used to query the EJP-RD VP discovery eco-system.

The component comes with docker file that can be used to deploy the service. Although Docker is not required to run the service. It can also be run natively using the Node environenment.

## Requirements

- [Git](https://git-scm.com/ "https://git-scm.com/")
- [Docker](https://docker.com "https://docker.com") or [Node](https://nodejs.org "https://nodejs.org")

## Deployment

- `$ git clone https://github.com/ejp-rd-vp/vp-discovery-portal.git` to clone this repository.
- `$ cd vp-resource-interface` to navigate to the VP Resource Interface root path.
- Create a file named `.env`. Note that this file needs to exist and be configured in order for the application to operate correctly. You can copy create it from the `.env.example` file.
- Set the configuration inside the `.env` file as follows: 
  - `RESOURCE_INTERFACE_PORT=<YOUR_DESIRED_PORT>` 
  - `RESOURCE_INTERFACE_SSL_CERT=<PATH_TO_SSL_CERTIFICATE>`
  - `RESOURCE_INTERFACE_SSL_KEY=<PATH_TO_SSL_KEY>` 
  - `RESOURCE_INTERFACE_RATE_LIMIT=<NUMBER_OF_REQUESTS_ALLOWED_PER_IP_ADDRESS>`
  - `RESOURCE_INDEX_URL=<RESOURCE_INDEX_URL>` 
  - `AUTH_SERVER_URL=<KEYCLOAK_SERVER_URL>`
  - `AUTH_REALM=<KEYCLOAK_REALM>`
  - `AUTH_CLIENT_ID=<KEYCLOAK_CLIENT_ID>`
- Either
  - `$ docker build -f Dockerfile -t vp-resource-interface .` to build the docker image.
  - `$ docker run -it -p <RESOURCE_INTERFACE_PORT>:<DESIRED_HOST_PORT> vp-resource-interface` to run the docker container.
- Or
  - `$ npm install` to install the dependencies.
  - `$ node bin/server.js` to run the service.

The VP Resource Interface will be listening on `https://<YOUR_IP_ADDRESS>:<DESIRED_HOST_PORT>`.

#### Usage

See `https://<YOUR_IP_ADDRESS>:<DESIRED_HOST_PORT>/api` for the VP Resource Interface API specification. 
