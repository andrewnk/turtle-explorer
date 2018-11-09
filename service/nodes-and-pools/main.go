package main

import (
    "fmt"
    "io/ioutil"
    "log"
    "net/http"
    "crypto/tls"
    "encoding/json"
    "time"
    "strconv"
    "database/sql"
    "flag"
    _ "github.com/lib/pq"
    "github.com/robfig/cron"
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

type NodeData struct {
    AltBlocksCount int `json:"alt_blocks_count"`
    Difficulty int `json:"difficulty"`
    GrayPeerlistSize int `json:"gray_peerlist_size"`
    Hashrate int `json:"hashrate"`
    Height int `json:"height"`
    IncomingConnectionsCount int `json:"incoming_connections_count"`
    LastKnownBlockIndex int `json:"last_known_block_index"`
    MajorVersion int `json:"major_version"`
    MinorVersion int `json:"minor_version"`
    NetworkHeight int `json:"network_height"`
    OutgoingConnectionsCount int `json:"outgoing_connections_count"`
    StartTime int `json:"start_time"`
    Status string `json:"status"`
    SupportedHeight int `json:"supported_height"`
    Synced bool `json:"synced"`
    Testnet bool `json:"testnet"`
    TxCount int `json:"tx_count"`
    TxPoolSize int `json:"tx_pool_size"`
    Version string `json:"version"`
    WhitePeerlistSize int `json:"white_peerlist_size"`
    Fee float64 `json:"amount"`
}

type Pool struct {
    Name string `json:"name"`
    Url string `json:"url"`
    Api string `json:"api"`
    Software string `json:"type"`
    MiningAddress string `json:"miningAddress"`
}

type Pools struct {
    Pools []Pool `json:"pools"`
}

type ForknotePoolData struct {
    Status string

    Pool struct {
        Miners int `json:"miners"`
        Hashrate int `json:"hashrate"`
        TotalPayments int `json:"totalPayments"`
        MinersPaid int `json:"totalMinersPaid"`
        TotalBlocks int `json:"totalBlocks"`
        LastBlockFound string `json:"lastBlockFound"`
    } `json:"pool"`

    Config struct {
        MinPayout int `json:"minPaymentThreshold"`
        Fee float64 `json:"fee"`
    } `json:"config"`

    Network struct {
        Height int `json:"height"`
        Difficulty int `json:"difficulty"`
        Timestamp int `json:"timestamp"`
    } `json:"network"`
}

type ForknotePoolConfigs struct {
    Configs struct {
        Ports []ForknotePoolConfigData `json:"ports"`
    } `json:"config"`
}

type ForknotePoolConfigData struct {
    Port int `json:"port"`
    Difficulty int `json:"difficulty"`
    Description string `json:"desc"`
}

type NodeJsPoolData struct {
    MinPayout int `json:"min_wallet_payout"`
    Height int `json:"height"`
    Difficulty int `json:"difficulty"`
    Status string
    Timestamp int
    PPLNSFee float64 `json:"pplns_fee"`
    PPSFee float64 `json:"pps_fee"`
    SoloFee float64 `json:"solo_fee"`

    Pool struct {
        Miners int `json:"miners"`
        Hashrate int `json:"hashrate"`
        TotalPayments int `json:"totalPayments"`
        MinersPaid int `json:"totalMinersPaid"`
        TotalBlocks int `json:"totalBlocksFound"`
        LastBlockFound int `json:"lastBlockFoundTime"`
    } `json:"pool_statistics"`
}

type NodeJsPoolConfigs struct {
    Configs []NodeJsPoolConfigPort `json:"global"`
}

type NodeJsPoolConfigPort struct {
    Port int `json:"port"`
    Difficulty int `json:"difficulty"`
    Description string `json:"description"`
    FeeType string `json:"pool_type"`
}

type CryptonoteSocialPoolData struct {
    Status string
    Fee float64 `json:"fee"`
    Height int `json:"height"`
    Miners int `json:"miners"`
    Hashrate int `json:"hashRate"`
    LastBlockFound int `json:"lastBlockFoundTime"`
    TotalPayments int
    MinersPaid int
    TotalBlocks int
    MinPayout int
    Difficulty int
    Timestamp int
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

            var nodeData NodeData

            feeUrl := fmt.Sprintf("%[1]s%#[2]s:%#[3]s/feeinfo", protocol, url, strconv.Itoa(port))
            feeResponse := queryApi(feeUrl, "GET")

            err := json.Unmarshal(feeResponse, &nodeData)

            if err != nil {
                log.Println("There was an error getting the node fee (feeinfo): ", err)
            }

            infoUrl := fmt.Sprintf("%[1]s%#[2]s:%#[3]s/getinfo", protocol, url, strconv.Itoa(port))
            infoResponse := queryApi(infoUrl, "GET")

            err = json.Unmarshal(infoResponse, &nodeData)

            status := nodeData.Status
            if err != nil {
                log.Println("There was an error getting the node data (getinfo): ", err)
                status = "Unreachable"
            }

            stmt, err := db.Prepare("INSERT INTO node_data(time, node_id, alt_blocks_count, difficulty, gray_peerlist_size, hashrate, height, incoming_connections_count, last_known_block_index, major_version, minor_version, network_height, outgoing_connections_count, start_time, status, supported_height, synced, testnet, tx_count, tx_pool_size, version, white_peerlist_size, fee) VALUES(NOW(),$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)")
            if err != nil {
                log.Println("There was an error preparing to insert the node data: ", err)
            }

            _, err = stmt.Exec(id, nodeData.AltBlocksCount, nodeData.Difficulty, nodeData.GrayPeerlistSize, nodeData.Hashrate, nodeData.Height, nodeData.IncomingConnectionsCount, nodeData.LastKnownBlockIndex, nodeData.MajorVersion, nodeData.MinorVersion, nodeData.NetworkHeight, nodeData.OutgoingConnectionsCount, nodeData.StartTime, status, nodeData.SupportedHeight, nodeData.Synced, nodeData.Testnet, nodeData.TxCount, nodeData.TxPoolSize, nodeData.Version, nodeData.WhitePeerlistSize, nodeData.Fee)
            if err != nil {
                log.Println("There was an error inserting the node data: ", err)
            }
            stmt.Close()
        }
    }
}

func setPoolData() {
    pools, err := db.Query("SELECT id, api, software, name FROM pool")

    if err != nil {
        log.Println("There was an error getting the pools from the db: ", err)
    }

    defer pools.Close()
    for pools.Next() {
        var id int
        var api string
        var software string
        var name string
        err := pools.Scan(&id, &api, &software, &name)

        if err != nil {
            log.Println("There was an error getting the pool values from the db: ", err)
        } else {
            if software == "forknote" || software == "forknote-alt" {
                setForknotePoolData(id, api, name)
                setForknotePoolConfig(id, api, name)
            } else if software == "node.js" {
                setNodeJsPoolData(id, api, name)
                setNodeJsPoolConfig(id, api, name)
            } else if name == "CryptoNote.social" {
                setCryptonoteSocialPoolData(id, api)
            }
        }
    }
}

func setForknotePoolData(id int, api string, name string) {
    var poolData ForknotePoolData
    url := fmt.Sprintf("%[1]sstats", api)
    response := queryApi(url, "GET")

    status := "OK"
    if isValidJson(response) && len(response) > 0 {
        err := json.Unmarshal(response, &poolData)
        if err != nil {
            log.Println("There was an error getting the forknote pool data: ", name, err)
            status = "Unreachable"
        }
    } else {
        status = "Unreachable"
    }

    stmt, err := db.Prepare("INSERT INTO pool_data(time, pool_id, miners, min_payout, hashrate, height, total_payments, miners_paid, total_blocks, last_block_found, difficulty, status, timestamp) VALUES (NOW(),$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)")
    if err != nil {
        log.Println("There was an error preparing to insert the pool data: ", err)
    }

    _, err = stmt.Exec(id, poolData.Pool.Miners, poolData.Config.MinPayout, poolData.Pool.Hashrate, poolData.Network.Height, poolData.Pool.TotalPayments, poolData.Pool.MinersPaid, poolData.Pool.TotalBlocks, poolData.Pool.LastBlockFound, poolData.Network.Difficulty, status, poolData.Network.Timestamp)
    if err != nil {
        log.Println("There was an error inserting the pool data: ", name, err)
    }
    stmt.Close()

    setGenericFees(id, poolData.Config.Fee)
}

func setForknotePoolConfig(id int, api string, name string) {
    var config ForknotePoolConfigs
    configUrl := fmt.Sprintf("%[1]sstats", api)
    configResponse := queryApi(configUrl, "GET")

    err := json.Unmarshal(configResponse, &config)
    if err != nil {
        log.Println("There was an error getting the forknote config data: ", name, err)
    }

    for i := 0; i < len(config.Configs.Ports); i++ {
        var poolId int
        err := db.QueryRow("SELECT pool_id FROM pool_config WHERE pool_id = $1 and port = $2 LIMIT 1", id, config.Configs.Ports[i].Port).Scan(&poolId)

        if err == sql.ErrNoRows {
            //insert
            stmt, err := db.Prepare("INSERT INTO pool_config(pool_id, port, difficulty, description) VALUES ($1, $2, $3, $4)")
            if err != nil {
                log.Println("There was an error preparing to insert into the pool_config: ", err)
            }

            _, err = stmt.Exec(id, config.Configs.Ports[i].Port, config.Configs.Ports[i].Difficulty, config.Configs.Ports[i].Description)
            if err != nil {
                log.Println("There was an error inserting into the pool_config: ", err)
            }
            stmt.Close()
        } else {
            //update
            stmt, err := db.Prepare("UPDATE pool_config SET difficulty = $1, description = $2 WHERE port = $3 and pool_id = $4")
            if err != nil {
                log.Println("There was an error preparing to update the pool_config: ", err)
            }
            _, err = stmt.Exec(config.Configs.Ports[i].Difficulty, config.Configs.Ports[i].Description, config.Configs.Ports[i].Port, id)
            if err != nil {
                log.Println("There was an error updating the pool_config: ", err)
            }
            stmt.Close()
        }
    }
}

func setNodeJsPoolData(id int, api string, name string) {
    var poolData NodeJsPoolData
    poolStatsUrl := fmt.Sprintf("%[1]spool/stats", api)
    poolStatsResponse := queryApi(poolStatsUrl, "GET")

    status := "OK"
    if isValidJson(poolStatsResponse) && len(poolStatsResponse) > 0 {
        err := json.Unmarshal(poolStatsResponse, &poolData)
        if err != nil {
            log.Println("There was an error getting the nodejs pool data: ", name, err)
            status = "Unreachable"
        }
    } else {
        status = "Unreachable"
    }

    networkStatsUrl := fmt.Sprintf("%[1]snetwork/stats", api)
    networkStatsResponse := queryApi(networkStatsUrl, "GET")

    err := json.Unmarshal(networkStatsResponse, &poolData)
    if err != nil {
        log.Println("There was an error getting the nodejs pool's network stats: ", err)
    }

    configStatsUrl := fmt.Sprintf("%[1]sconfig", api)
    configStatsResponse := queryApi(configStatsUrl, "GET")

    err = json.Unmarshal(configStatsResponse, &poolData)
    if err != nil {
        log.Println("There was an error getting the nodejs pool's config stats: ", err)
    }

    stmt, err := db.Prepare("INSERT INTO pool_data(time, pool_id, miners, min_payout, hashrate, height, total_payments, miners_paid, total_blocks, last_block_found, difficulty, status, timestamp) VALUES (NOW(),$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)")
    if err != nil {
        log.Println("There was an error preparing to insert the pool data: ", err)
    }

    _, err = stmt.Exec(id, poolData.Pool.Miners, poolData.MinPayout, poolData.Pool.Hashrate, poolData.Height, poolData.Pool.TotalPayments, poolData.Pool.MinersPaid, poolData.Pool.TotalBlocks, poolData.Pool.LastBlockFound, poolData.Difficulty, status, poolData.Timestamp)
    if err != nil {
        log.Println("There was an error inserting the pool data: ", name, err)
    }
    stmt.Close()

    feeTypes := map[string]float64 {
        "pplns": poolData.PPLNSFee,
        "pps":   poolData.PPSFee,
        "solo":  poolData.SoloFee,
    }

    setNodeJsFees(id, feeTypes)
}

func setNodeJsPoolConfig(id int, api string, name string) {
    var config NodeJsPoolConfigs
    configUrl := fmt.Sprintf("%[1]spool/ports", api)
    configResponse := queryApi(configUrl, "GET")

    err := json.Unmarshal(configResponse, &config)
    if err != nil {
        log.Println("There was an error getting the nodejs config data: ", name, err)
    }

    for i := 0; i < len(config.Configs); i++ {
        var feeId int
        err := db.QueryRow("SELECT id FROM pool_fee WHERE pool_id = $1 and fee_type = $2", id, config.Configs[i].FeeType).Scan(&feeId)

        if err == sql.ErrNoRows {
            log.Println("There were is no fee associated with this pool config")
        }

        var poolId int
        err = db.QueryRow("SELECT pool_id FROM pool_config WHERE pool_id = $1 and port = $2 LIMIT 1", id, config.Configs[i].Port).Scan(&poolId)

        if err == sql.ErrNoRows {
            //insert
            stmt, err := db.Prepare("INSERT INTO pool_config(pool_id, fee_id, port, difficulty, description) VALUES ($1, $2, $3, $4, $5)")
            if err != nil {
                log.Println("There was an error preparing to insert into the nodejs pool_config: ", err)
            }

            _, err = stmt.Exec(id, feeId, config.Configs[i].Port, config.Configs[i].Difficulty, config.Configs[i].Description)
            if err != nil {
                log.Println("There was an error inserting into the nodejs pool_config: ", err)
            }
            stmt.Close()
        } else {
            //update
            stmt, err := db.Prepare("UPDATE pool_config SET fee_id = $1, difficulty = $2, description = $3 WHERE port = $4 and pool_id = $5")
            if err != nil {
                log.Println("There was an error preparing to update the nodejs pool_config: ", err)
            }
            _, err = stmt.Exec(feeId, config.Configs[i].Difficulty, config.Configs[i].Description, config.Configs[i].Port, id)
            if err != nil {
                log.Println("There was an error updating the pool_config: ", err)
            }
            stmt.Close()
        }
    }
}

func setCryptonoteSocialPoolData(id int, api string) {
    var poolData CryptonoteSocialPoolData
    response := queryApi(api, "GET")

    status := "OK"
    if isValidJson(response) && len(response) > 0 {
        err := json.Unmarshal(response, &poolData)
        if err != nil {
            log.Println("There was an error getting the CryptoNote.social pool data: ", err)
            status = "Unreachable"
        }
    } else {
        status = "Unreachable"
    }

    stmt, err := db.Prepare("INSERT INTO pool_data(time, pool_id, miners, min_payout, hashrate, height, total_payments, miners_paid, total_blocks, last_block_found, difficulty, status, timestamp) VALUES (NOW(),$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)")
    if err != nil {
        log.Println("There was an error preparing to insert the pool data: ", err)
    }

    _, err = stmt.Exec(id, poolData.Miners, 0, poolData.Hashrate, poolData.Height, 0, 0, 0, poolData.LastBlockFound, 0, status, 0)
    if err != nil {
        log.Println("There was an error inserting the pool data: ", err)
    }
    stmt.Close()
    setGenericFees(id, poolData.Fee)
}

func setGenericFees(id int, fee float64) {
    var poolId int
    err := db.QueryRow("SELECT fee FROM pool_fee WHERE pool_id = $1", id).Scan(&poolId)

    if err == sql.ErrNoRows {
        //insert
        stmt, err := db.Prepare("INSERT INTO pool_fee(pool_id, fee) VALUES ($1, $2)")
        if err != nil {
            log.Println("There was an error preparing to insert into the generic pool_fee: ", err)
        }

        _, err = stmt.Exec(id, fee)
        if err != nil {
            log.Println("There was an error inserting into the generic pool_fee: ", err)
        }
        stmt.Close()
    } else {
        //update
        stmt, err := db.Prepare("UPDATE pool_fee SET fee = $1 WHERE pool_id = $2")
        if err != nil {
            log.Println("There was an error preparing to update the generic pool_fee: ", err)
        }
        _, err = stmt.Exec(fee, id)
        if err != nil {
            log.Println("There was an error updating the generic pool_fee: ", err)
        }
        stmt.Close()
    }
}

func setNodeJsFees(id int, feeTypes map[string]float64) {
    for key, value := range feeTypes {
        var poolId int
        err := db.QueryRow("SELECT fee FROM pool_fee WHERE pool_id = $1 and fee_type = $2", id, key).Scan(&poolId)

        if err == sql.ErrNoRows {
            //insert
            stmt, err := db.Prepare("INSERT INTO pool_fee(pool_id, fee_type, fee) VALUES ($1, $2, $3)")
            if err != nil {
                log.Println("There was an error preparing to insert into the nodejs pool_fee: ", err)
            }

            _, err = stmt.Exec(id, key, value)
            if err != nil {
                log.Println("There was an error inserting into the nodejs pool_fee: ", err)
            }
            stmt.Close()
        } else {
            //update
            stmt, err := db.Prepare("UPDATE pool_fee SET fee = $1 WHERE pool_id = $2 and fee_type = $3")
            if err != nil {
                log.Println("There was an error preparing to update the nodejs pool_fee: ", err)
            }
            _, err = stmt.Exec(value, id, key)
            if err != nil {
                log.Println("There was an error updating the generic pool_fee: ", err)
            }
            stmt.Close()
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
            stmt, err := db.Prepare("INSERT INTO pool(name, url, api, software, mining_address, trusted) VALUES ($1, $2, $3, $4, $5, TRUE)")
            if err != nil {
                log.Println("There was an error preparing to insert the pool: ", err)
            }

            _, err = stmt.Exec(pools.Pools[i].Name, pools.Pools[i].Url, pools.Pools[i].Api, pools.Pools[i].Software, pools.Pools[i].MiningAddress)
            if err != nil {
                log.Println("There was an error inserting the pool: ", err)
            }
            stmt.Close()
        } else {
            //update
            stmt, err := db.Prepare("UPDATE pool SET name = $1, api = $3, software = $4, mining_address = $5 WHERE url = $2")
            if err != nil {
                log.Println("There was an error preparing to update the pool: ", err)
            }
            _, err = stmt.Exec(pools.Pools[i].Name, pools.Pools[i].Url, pools.Pools[i].Api, pools.Pools[i].Software, pools.Pools[i].MiningAddress)
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
    // disable ssl verification as some clients may have misfigured ssl certs
    http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}

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
