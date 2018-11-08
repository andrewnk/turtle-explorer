package main

import (
    "fmt"
    // "io/ioutil"
    "log"
    "encoding/json"
    "strconv"
    "database/sql"
    "flag"
    _ "github.com/lib/pq"
    "github.com/robfig/cron"
    "github.com/tidwall/sjson"
    turtlecoind "github.com/turtlecoin/turtlecoin-rpc-go"
)

var (
    dbUser string
    dbName string
    dbPassword string
    dbHost string
    dbPort string
    dbSSLMode string
    daemonHost string
    daemonPort int
    db *sql.DB
)

func main() {
    flag.StringVar(&dbUser, "db-user", "", "Database User")
    flag.StringVar(&dbName, "db-name", "", "Database Name")
    flag.StringVar(&dbPassword, "db-password", "", "Database Password")
    flag.StringVar(&dbHost, "db-host", "", "Database Host")
    flag.StringVar(&dbPort, "db-port", "", "Database Port")
    flag.StringVar(&dbSSLMode, "db-ssl-mode", "", "Database SSL Mode")
    flag.StringVar(&daemonHost, "daemon-host", "", "Daemon Host")
    flag.IntVar(&daemonPort, "daemon-port", 11898, "Daemon Port")
    flag.Parse()

    // hash := turtlecoind.GetBlockHash(daemonHost, daemonPort, 1)
    // block := turtlecoind.GetBlock(daemonHost, daemonPort, "446d9bd3b8709a74f4a9ecaa0a3054bb0036e99e0682028bfa87f8b862691eb3")
    tx := turtlecoind.GetTransaction(daemonHost, daemonPort, "ddb482de5f435864c7b194c110f56dc61da3c93bf21c4193889efa38b1ccf351")
    fmt.Println(tx)

    // get record from database
    // if no records exist start from 1 else get most recent block
    // get block hash by height
    // then get block using block hash
    // for each transaction get transaction info using transaction hash
    // then get transactions info
    // insert into db
    // rinse and repeat

    //get transactions in mem pool
    //loop through db mempool transactions
    //if db mempool transaction is not in new transaction then delete
    //after loop is complete add all mempool transactions into db
    mempool := turtlecoind.GetTransactionPool(daemonHost, daemonPort)
    fmt.Println(mempool)

    initDb()
    setBlock()
    setMemPool()

    c := cron.New()
    c.Start()
    // update blocks and mempool every 25 seconds
    c.AddFunc("25 * * * * *", func() {
        setBlock()
        setMemPool()
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

func setBlock() {
    blockHeight, err := db.Query()
    blockRow := db.QueryRow("SELECT max(height) FROM block")
    err := row.Scan(&height)
    if err != nil {
        log.Println("There was an error getting the block height from the db: ", err)
    }

    hash, err := turtlecoind.GetBlockHash(daemonHost, daemonPort, 1)
    block, err := turtlecoind.GetBlock(daemonHost, daemonPort, "446d9bd3b8709a74f4a9ecaa0a3054bb0036e99e0682028bfa87f8b862691eb3")
    tx, err := turtlecoind.GetTransaction(daemonHost, daemonPort, "ddb482de5f435864c7b194c110f56dc61da3c93bf21c4193889efa38b1ccf351")

    defer block.Close()
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

func setMemPool() {
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

func isValidJson(data []byte) bool {
    var js map[string]interface{}
    return json.Unmarshal(data, &js) == nil
}
