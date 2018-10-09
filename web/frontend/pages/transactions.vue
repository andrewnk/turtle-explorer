<template>
    <section class="container is-block">
        <div class="columns has-text-centered is-multiline">
            <div class="column">
                <h1 class="is-size-1 has-text-light">
                    Transactions
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
                title: 'Transactions',
                meta: [
                    {
                        hid: 'description',
                        name: 'description',
                        content: 'View TurtleCoin transactions'
                    },
                    {
                        charset: 'utf-8'
                    },
                    {
                        name: 'viewport',
                        content: 'width=device-width, initial-scale=1'
                    }
                ]
            }
        }
    }
</script>