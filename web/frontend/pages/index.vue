<template>
    <section class="container">
        <div class="columns is-multiline">
            <div class="column is-12 has-text-centered">
                <img src="~/static/turtlecoin_symbol_white.png" class="width-100-px"/>
            </div>
            <div class="column is-12 has-text-centered">
                <h1 class="title">
                    TurtleCoin Explorer
                </h1>
            </div>
        </div>
        <div class="columns is-multiline">
            <div class="column is-4">
                <h2>Nodes</h2>
                <p>
                    View real-time and historical node data from public nodes
                </p>
            </div>
            <div class="column is-4">
                <h2>Pools</h2>
                <p>
                    View real-time and historical pool data and generate mining configs
                </p>
            </div>
            <div class="column is-4">
                <h2>My Pool Stats</h2>
                <p>
                  Get data from pools you've mined in or watch your pool mining stats in real-time
                </p>
            </div>
            <div class="column is-4">
                <h2>Blocks</h2>
                <p>
                  Soon&trade;
                </p>
            </div>
            <div class="column is-4">
                <h2>Transactions</h2>
                <p>
                  Soon&trade;
                </p>
            </div>
            <div class="column is-4">
                <h2>Help</h2>
                <p>
                  Soon&trade;
                </p>
            </div>
        </div>
    </section>
</template>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #eee;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #eee;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
