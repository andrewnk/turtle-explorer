<template>
    <section class="container is-block">
        <div class="columns has-text-centered is-multiline">
            <div class="column">
                <h1 class="is-size-1 has-text-light">
                    Blocks
                  </h1>
            </div>
            <div class="column is-12">
                <h5>Soon&trade;</h5>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        head () {
            return {
                title: 'TurtleCoin Explorer - Block Explorer',
                meta: [
                    {
                        hid: 'description',
                        name: 'description',
                        content: 'View live and historical block information for TurtlCoin'
                    }
                ]
            }
        }
    }
</script>