# Turtle Explorer

This explorer is a reimagining of the original cryptonote explorer using updated tools, such as [Docker](https://www.docker.com/), [Node.js](https://nodejs.org), [Feathers.js](https://feathersjs.com/), [Vue.js](https://vuejs.org/), [Socket.IO](https://socket.io/), [Go](https://golang.org/), etc. It is still in the early stages and, therefore, has a long way to go...but slow and steady wins the race!

Demo: [http://trtl.rocks](http://trtl.rocks)

- [The containers](#containers)
- [Container layout](#docker-container-layout)
- [Run the project](#running)
- [Run a development environment](#running-a-dev-environment)
- [Join in on the fun](#development)

### Containers
| Container | Tools | What it does | ARG & ENV |
| ------ | ------ | ------ | ------ |
| db-nodes-and-pools | Alpine build with Timescale/Postgres | DB that stores node and pool data - a time series database built on PostgreSQL (uses Notify for realtime events) | ARGS:<br/>GO_PASSWORD<br/>WEB_PASSWORD<br/><br/>ENV:<br/>POSTGRES_USER<br/>POSTGRES_PASSWORD |
| db-daemon-cache | TODO - Alpine build with Timescale/Postgres | DB that will store daemon information - a time series database built on PostgreSQL (uses Notify for realtime events) | ARGS:<br/>TURTLECOINSERVICE_PASSWORD<br/>WEB_PASSWORD<br/><br/>ENV:<br/>POSTGRES_USER<br/>POSTGRES_PASSWORD |
| daemon | TODO | TurtleCoin daemon | ARGS:<br/>TURTLECOIN_PROGRAM |
| service-nodes-and-pools | Alpine build with Go | Routinely pulls a list of pools and public nodes, retrieves data from pool and node api's, and insert the records into the db | ARGS:<br/>DB_USER<br/>DB_NAME<br/>DB_PASSWORD<br/>DB_HOST<br/>DB_PORT<br/>DB_SSLMODE |
| service-daemon-cache | TODO - Alpine build with Go | Regularly pull data from the daemon and insert into the db | ARGS:<br/>DB_USER<br/>DB_NAME<br/>DB_PASSWORD<br/>DB_HOST<br/>DB_PORT<br/>DAEMON_RPC_PORT<br/>DAEMON_RPC_HOST |
| web-cache | Alpine build Redis | Stores cached db query responses |
| web-backend | Alpine build with FeathersJS, Socket.IO | Grabs the data from the db's and relay to frontend | ARGS:<br/>DB_USER<br/>DB_PASSWORD<br/>DB_PORT<br/>DB_HOST<br/>DB_NAME |
| web-frontend | Alpine build with Nuxt, Bulma, Vue.JS, FeathersJS, Feathers-Vuex, Socket.IO | Display the data | ARGS:<br/>WEBSOCKET_HOST<br/>WEBSOCKET_PORT |

### Docker Container Layout
![alt text](https://raw.githubusercontent.com/andrewnk/turtle-explorer/master/docker-layout.png "Docker Container Layout")

### Running
Start the project by running the following command in the root dir:
```sh
docker-compose build && docker-compose -f docker-compose.yml up -d
```
Once all containers are up and running (``docker ps -a``) you can view the frontend by visiting `localhost` or `127.0.0.1` in your browser.

### Running a dev environment
In order to run the development environment in docker you will need to setup/start the services manually. I start each container in its own shell to make it easier to move between containers.

Start the project by running the following command in the root dir:
```sh
docker-compose build && docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

Get a shell in the go container, build, and start the program

```sh
docker exec -it service-nodes-and-pools ash
CGO_ENABLED=0 go build -a --installsuffix cgo --ldflags="-s" -o service-nodes-and-pools
./service-nodes-and-pools -db-user=go -db-name=trtl -db-password=98765 -db-host=db-nodes-and-pools -db-port=5432 -db-ssl-mode=disable
```

Get a shell in the backend web container and start
```sh
docker exec -it web-backend ash
npm install
npm start
```

Get a shell in the frontend web container and run the dev environment
```sh
docker exec -it web-frontend ash
npm install
npm run dev
```

Once all containers are up and running (`docker ps -a`) view the frontend by going to `localhost` or `127.0.0.1` in your browser. The frontend code is set up with hot reloading, so you can view the changes in the browser whenever you save a file.

### Development
Want to contribute? Great, feel free to reach out or submit a PR! 

TODO:
 - Add the ability for a user to generate miner config files for each pool using their wallet
 - Add the ability to compare pool and node data in a chart
 - Add daemon
 - Add daemon db
 - Add daemon cache service to query the daemon and store the results in the db
 - Add the ability to switch between historical and live line chart data
 - Format "my pool stats" downloadable spreadsheet
 - Add help section that explains all the pages and content
 - Work on the layout and design
 - ...

License
----
MIT