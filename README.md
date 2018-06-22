# Turtle Explorer

This explorer is a reimagining of the original cryptonote explorer using updated tools, such as [Docker](https://www.docker.com/), [Node.js](https://nodejs.org), [Feathers.js](https://feathersjs.com/), [Vue.js](https://vuejs.org/), [Socket.IO](https://socket.io/), [Go](https://golang.org/), etc. It is still in the early stages and, therefore, has a long way to go...but slow and steady wins the race!

- [The containers](#containers)
- [Run the project](#running)
- [Run a development environment](#running-a-dev-environment)
- [Join in on the fun](#development)

### Containers
| Container | Tools | What it does |
| ------ | ------ | ------ |
| Timescale | Alpine build with Timescale/Postgres | This is our db - a time series database built on PostgreSQL (uses Notify for realtime events) |
| Gather-Turtles | Alpine build with Go | Routinely pulls a list of pools and public nodes, retrieves data from pool and node api's, and insert the records into the db  |
| Web-Backend | Alpine build with FeathersJS, Socket.IO | Get the data from the db and relay to frontend |
| Web-Frontend | Alpine build with Nuxt, Bulma, Vue.JS, FeathersJS, Feathers-Vuex, Socket.IO | Display the data |

### Running
Start the project by running the following command in the root dir:
```sh
docker-compose build && docker-compose -f docker-compose.yml up -d
```
Once all containers are up and running (``docker ps -a``) you can now see the frontend by visiting `localhost` or `127.0.0.1` in your browser. You can change the default passwords by modyfing ``docker-compose.yml``

### Running a dev environment
In order to run the development environment in docker you will need to setup/start the services manually. I start each container in its own shell to make it easier to move between containers.

Start the project by running the following command in the root dir:
```sh
docker-compose build && docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

Get a shell in the go container and start the program

```sh
docker exec -it gather-turtles ash
./go-gather-turtles -db-user=go -db-name=trtl -db-password=98765 -db-host=timescale -db-port=5432 -db-ssl-mode=disable
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

Once all containers are up and running (`docker ps -a`) you can now see the frontend by visiting `localhost` or `127.0.0.1` in your browser. The frontend code is set up with hot reloading, so you can view the changes in the browser whenever you save a file.

### Development
Want to contribute? Great, feel free to reach out or submit a PR! 

TODO:
 - Add the ability for a user to generate miner config files for each pool using their wallet
 - Add historical charts for nodes and pools
 - Add the ability to compare pool and node data in a chart
 - Add block explorer
 - Add help section that explains all the pages and content
 - Work on the layout and design
 - ...

Current Issues:
 - The ip address of the web-backend container must be specified in the web-frontend container: ``socket.js``. The FQDN can be resolved from the shell, but cannot from the node application

License
----
MIT