<template>
    <section class="container is-block">
        <div class="columns is-multiline has-text-white">
            <div class="column is-12 has-text-centered">
                <img src="~/static/turtlecoin_symbol_white.png" class="width-100-px"/>
            </div>
            <div class="column is-12 has-text-centered">
                <h1 class="is-size-1">
                    TurtleCoin Explorer
                </h1>
            </div>
        </div>
        <div class="columns is-multiline has-text-white">
            <div class="column p-t-25 p-b-25 is-4">
                <nuxt-link to="nodes">
                    <i class="fas fa-users is-size-1"></i>
                    <h2 class="is-size-4">Nodes</h2>
                </nuxt-link>
                <p>
                    View real-time and historical node data from public nodes
                </p>
            </div>
            <div class="column p-t-25 p-b-25 is-4">
                <nuxt-link to="pools">
                    <i class="fas fa-people-carry is-size-1"></i>
                    <h2 class="is-size-4">Pools</h2>
                </nuxt-link>
                <p>
                    View real-time and historical pool data and generate mining configs
                </p>
            </div>
            <div class="column p-t-25 p-b-25 is-4">
                <nuxt-link to="poolstats">
                    <i class="fas fa-server is-size-1"></i>
                    <h2 class="is-size-4">My Pool Stats</h2>
                </nuxt-link>
                <p>
                  Get data from pools you've mined in or watch your pool mining stats in real-time
                </p>
            </div>
            <div class="column p-t-25 p-b-25 is-4">
                <nuxt-link to="blocks">
                    <i class="fas fa-cubes is-size-1"></i>
                    <h2 class="is-size-4">Blocks</h2>
                </nuxt-link>
                <p>
                  Soon&trade;
                </p>
            </div>
            <div class="column p-t-25 p-b-25 is-4">
                <nuxt-link to="transactions">
                    <i class="fas fa-coins is-size-1"></i>
                    <h2 class="is-size-4">Transactions</h2>
                </nuxt-link>
                <p>
                  Soon&trade;
                </p>
            </div>
            <div class="column p-t-25 p-b-25 is-4">
                <nuxt-link to="resources">
                    <i class="fas fa-info-circle is-size-1"></i>
                    <h2 class="is-size-4">Resources</h2>
                </nuxt-link>
                <p>
                  Soon&trade;
                </p>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        head () {
            return {
                title: 'TurtleCoin Explorer',
                meta: [
                    {
                        hid: 'description',
                        name: 'description',
                        content: 'Explore block, node, pool, and transaction data for TurtleCoin'
                    }
                ]
            }
        }
    }
</script>
