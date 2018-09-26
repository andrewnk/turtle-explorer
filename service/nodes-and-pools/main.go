package main

import (
    "fmt"
    "io/ioutil"
    "log"
    "net/http"
    "encoding/json"
    "time"
    "strconv"
    "database/sql"
    "flag"
    _ "github.com/lib/pq"
    "github.com/robfig/cron"
    "github.com/tidwall/sjson"
)

var (
    poolsJsonLink string = "https://raw.githubusercontent.com/turtlecoin/turtlecoin-pools-json/master/v2/turtlecoin-pools.json"
    nodesJsonLink string = "https://raw.githubusercontent.com/turtlecoin/turtlecoin-nodes-json/master/turtlecoin-nodes.json"
    dbUser string
    dbName string
    dbPassword string
    dbHost string
    dbPort string
    dbSSLMode string
    db *sql.DB
)

type Node struct {
    Name string `json:"name"`
    Url string `json:"url"`
    Port int `json:"port"`
    SSL bool `json:"ssl"`
}

type Nodes struct {
    Nodes []Node `json:"nodes"`
}

type Pool struct {
    Name string `json:"name"`
    Url string `json:"url"`
    Api string `json:"api"`
    Type string `json:"type"`
    MiningAddress string `json:"miningAddress"`
}

type Pools struct {
    Pools []Pool `json:"pools"`
}

func main() {
    flag.StringVar(&dbUser, "db-user", "", "Database User")
    flag.StringVar(&dbName, "db-name", "", "Database Name")
    flag.StringVar(&dbPassword, "db-password", "", "Database Password")
    flag.StringVar(&dbHost, "db-host", "", "Database Host")
    flag.StringVar(&dbPort, "db-port", "", "Database Port")
    flag.StringVar(&dbSSLMode, "db-ssl-mode", "", "Database SSL Mode")
    flag.Parse()

    initDb()
    setNodes()
    setPools()

    c := cron.New()
    c.Start()
    // update node and pool stats every 30 seconds
    c.AddFunc("30 * * * * *", func() {
        setNodeData()
        setPoolData()
    })

    // update nodes and pools every 12 hours
    c.AddFunc("@every 12h", func() {
        setNodes()
        setPools()
    })

    // keep the program running indefinitely
    select{}
}

func initDb() {
    var err error
    db, err = sql.Open("postgres", fmt.Sprintf("user=%[1]s dbname=%[2]s password=%[3]s host=%[4]s port=%[5]s sslmode=%[6]s", dbUser, dbName, dbPassword, dbHost, dbPort, dbSSLMode))
    if err != nil {
        log.Println("Error connecting to the database: ", err)
    } else {
        log.Println("Connected to the database")
    }
}

func setNodeData() {
    nodes, err := db.Query("SELECT id, url, port, ssl FROM node")

    if err != nil {
        log.Println("There was an error getting the nodes from the db: ", err)
    }

    defer nodes.Close()
    for nodes.Next() {
        var id int
        var url string
        var port int
        var ssl bool
        protocol := "http://"
        err := nodes.Scan(&id, &url, &port, &ssl)

        if err != nil {
            log.Println("There was an error getting the nodes from the db: ", err)
        } else {
            if ssl == true {
                protocol = "https://"
            }
            url := fmt.Sprintf("%[1]s%#[2]s:%#[3]s/getinfo", protocol, url, strconv.Itoa(port))
            response := queryApi(url, "GET")

            if isValidJson(response) && len(response) > 0 {
                stmt, err := db.Prepare("INSERT INTO node_data(time, node_id, data) VALUES(NOW(),$1,$2)")
                if err != nil {
                    log.Println("There was an error preparing to insert the node data: ", err)
                }

                _, err = stmt.Exec(id, string(response))
                if err != nil {
                    log.Println("There was an error inserting the node data: ", err)
                }
                stmt.Close()
            }
        }
    }
}

func setPoolData() {
    pools, err := db.Query("SELECT id, api FROM pool")

    if err != nil {
        log.Println("There was an error getting the pools from the db: ", err)
    }

    defer pools.Close()
    for pools.Next() {
        var id int
        var api string
        err := pools.Scan(&id, &api)

        if err != nil {
            log.Println("There was an error getting the pool values from the db: ", err)
        } else {
            url := fmt.Sprintf("%[1]sstats", api)
            response := queryApi(url, "GET")

            if isValidJson(response) && len(response) > 0 {
                finalJson := response
                objectsToRemove := [3] string {"charts", "pool.blocks", "pool.payments"}

                for _, val := range objectsToRemove {
                    finalJson, err = sjson.DeleteBytes(finalJson, val)
                    if err != nil {
                        log.Println(fmt.Sprintf("There was a problem removing %d from the pool JSON:", val), err)
                    }
                }

                stmt, err := db.Prepare("INSERT INTO pool_data(time, pool_id, data) VALUES (NOW(),$1,$2)")
                if err != nil {
                    log.Println("There was an error preparing to insert the pool data: ", err)
                }

                _, err = stmt.Exec(id, finalJson)
                if err != nil {
                    log.Println("There was an error inserting the pool data: ", err)
                }
                stmt.Close()
            }
        }
    }
}

func setNodes() {
    nodes := getNodeJson()

    for i := 0; i < len(nodes.Nodes); i++ {
        var url string
        err := db.QueryRow("SELECT url FROM node WHERE url = $1 LIMIT 1", nodes.Nodes[i].Url).Scan(&url)

        if err == sql.ErrNoRows {
            stmt, err := db.Prepare("INSERT INTO node(name, url, port, ssl) VALUES ($1, $2, $3, $4)")
            if err != nil {
                log.Println("There was an error preparing to insert the node: ", err)
            }

            _, err = stmt.Exec(nodes.Nodes[i].Name, nodes.Nodes[i].Url, nodes.Nodes[i].Port, nodes.Nodes[i].SSL)
            if err != nil {
                log.Println("There was an error inserting the node into the database: ", err)
            }
            stmt.Close()
        }
    }
}

func getNodeJson() Nodes {
    response := queryApi(nodesJsonLink, "GET")

    var nodes Nodes
    err := json.Unmarshal(response, &nodes)

    if err != nil {
        log.Println("There was an error getting the nodes", err)
    } else {
        log.Println("Successfully got nodes")
    }

    return nodes
}

func setPools() {
    pools := getPoolJson()

    for i := 0; i < len(pools.Pools); i++ {
        var url string
        err := db.QueryRow("SELECT url FROM pool WHERE url = $1 LIMIT 1", pools.Pools[i].Url).Scan(&url)

        if err == sql.ErrNoRows {
            //insert
            stmt, err := db.Prepare("INSERT INTO pool(name, url, api, type, mining_address, trusted) VALUES ($1, $2, $3, $4, $5, TRUE)")
            if err != nil {
                log.Println("There was an error preparing to insert the pool: ", err)
            }

            _, err = stmt.Exec(pools.Pools[i].Name, pools.Pools[i].Url, pools.Pools[i].Api, pools.Pools[i].Type, pools.Pools[i].MiningAddress)
            if err != nil {
                log.Println("There was an error inserting the pool: ", err)
            }
            stmt.Close()
        } else {
            //update
            stmt, err := db.Prepare("UPDATE pool SET name = $1, api = $3, type = $4, mining_address = $5 WHERE url = $2")
            if err != nil {
                log.Println("There was an error preparing to update the pool: ", err)
            }
            _, err = stmt.Exec(pools.Pools[i].Name, pools.Pools[i].Url, pools.Pools[i].Api, pools.Pools[i].Type, pools.Pools[i].MiningAddress)
            if err != nil {
                log.Println("There was an error updating the pool: ", err)
            }
            stmt.Close()
            }
    }
}

func getPoolJson() Pools {
    response := queryApi(poolsJsonLink, "GET")

    var pools Pools
    err := json.Unmarshal(response, &pools)
    if err != nil {
        log.Println("There was an error getting the pools", err)
    } else {
        log.Println("Successfully got pools")
    }

    return pools
}

func queryApi(url string, action string) []byte {
    request := &http.Client{
        Timeout: 30 * time.Second,
    }

    r, err := http.NewRequest(action, url, nil)
    r.Header.Add("User-Agent", "Turtle-Explorer/1.0")
    response, err := request.Do(r)

    if err != nil {
        log.Println("There was an error querying the url: ", err)
        return []byte{}
    }

    defer response.Body.Close()

    responseData, err := ioutil.ReadAll(response.Body)

    if err != nil {
        log.Println("There was an error reading the response: ", err)
    }

    return responseData
}

func isValidJson(data []byte) bool {
    var js map[string]interface{}
    return json.Unmarshal(data, &js) == nil
}
