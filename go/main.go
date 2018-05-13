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
)

var poolsJsonLink string = "https://raw.githubusercontent.com/turtlecoin/turtlecoin-pools-json/master/v2/turtlecoin-pools.json"
var nodesJsonLink string = "https://raw.githubusercontent.com/turtlecoin/turtlecoin-nodes-json/master/turtlecoin-nodes.json"
var dbUser string
var dbName string
var dbPassword string
var dbHost string
var dbPort string
var dbSSLMode string

type Node struct {
    Name string `json:"name"`
    Url string `json:"url"`
    Port int `json:"port"`
}

type Nodes struct {
    Nodes []Node `json:"nodes"`
}

type Pool struct {
    Name string `json:"name"`
    Url string `json:"url"`
    Api string `json:"api"`
    Type string `json:"type"`
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

    c := cron.New()
    c.Start()

    c.AddFunc("30 * * * * *", func() {
        getNodeData()
        getPoolData()
    })

    select{}
}

func openConn() *sql.DB {
    db, conErr := sql.Open("postgres", fmt.Sprintf("user=%[1]s dbname=%[2]s password=%[3]s host=%[4]s port=%[5]s sslmode=%[6]s", dbUser, dbName, dbPassword, dbHost, dbPort, dbSSLMode))
    if conErr != nil {
        log.Println(conErr)
    }

    return db
}

func insertDataIntoDb(table string, name string, json string) {
    db := openConn()
    insertStatment := fmt.Sprintf("INSERT INTO %[1]s(time, name, data) VALUES (NOW(), $1, $2)", table)
    rows, insertErr := db.Query(insertStatment, name, json)

    rows.Close()
    db.Close()

    if insertErr != nil {
        log.Println(insertErr)
    }
}

func getNodeData() {
    nodes := getNodes()
    for i := 0; i < len(nodes.Nodes); i++ {
        url := fmt.Sprintf("%[1]s:%#[2]s/getinfo", nodes.Nodes[i].Url, strconv.Itoa(nodes.Nodes[i].Port))
        var response []byte = queryApi(url, "GET")

        if isValidJson(response) {
            insertDataIntoDb("nodes", nodes.Nodes[i].Name, string(response))
        }
    }
}

func getPoolData() {
    pools := getPools()
    for i := 0; i < len(pools.Pools); i++ {
        var response []byte = queryApi(fmt.Sprintf("%[1]sstats", pools.Pools[i].Api), "GET")

        if isValidJson(response) {
            insertDataIntoDb("pools", pools.Pools[i].Name, string(response))
        }
    }
}

func isValidJson(data []byte) bool {
    var js map[string]interface{}
    return json.Unmarshal(data, &js) == nil
}

func getNodes() Nodes {
    var response []byte = queryApi(nodesJsonLink, "GET")

    var nodes Nodes
    json.Unmarshal(response, &nodes)

    return nodes
}

func getPools() Pools {
    var response []byte = queryApi(poolsJsonLink, "GET")

    var pools Pools
    json.Unmarshal(response, &pools)

    return pools
}

func queryApi(url string, action string) []byte {
    request := &http.Client{
        Timeout: 15 * time.Second,
    }

    r, err := http.NewRequest(action, url, nil)
    r.Header.Add("User-Agent", "Go_Gather_Turtles/1.0")
    response, err := request.Do(r)

    if err != nil {
        // if error return empty
        log.Println(err)
        return []byte{}
    }

    defer response.Body.Close()

    responseData, err := ioutil.ReadAll(response.Body)
    if err != nil {
        log.Println(err)
    }

    return responseData
}
