<template>
    <nav class="navbar has-text-white is-fixed-top" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <nuxt-link class="navbar-item" to="/">
                <img src="~/static/turtlecoin_symbol_white.png" alt="Turtle Explorer">
                TURTLECOIN EXPLORER
            </nuxt-link>
            <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>
        <div id="navbarMenu" class="navbar-menu">
            <div class="navbar-end">
                <nuxt-link class="navbar-item white" active-class="is-active" to="/" exact>Home</nuxt-link>
                <nuxt-link class="navbar-item" active-class="is-active" to="nodes">Nodes</nuxt-link>
                <nuxt-link class="navbar-item" active-class="is-active" to="pools">Pools</nuxt-link>
                <nuxt-link class="navbar-item" active-class="is-active" to="blocks">Blocks</nuxt-link>
                <nuxt-link class="navbar-item" active-class="is-active" to="transactions">Transactions</nuxt-link>
                <nuxt-link class="navbar-item" active-class="is-active" to="poolstats">My Pool Stats</nuxt-link>
                <nuxt-link class="navbar-item" active-class="is-active" to="resources">Resources</nuxt-link>
            </div>
        </div>
    </nav>
</template>

<script>
    export default {
        name: 'navigation',
        mounted() {
            const navbar = document.querySelector('.navbar-burger')
            const navbarMenu = document.querySelector('.navbar-menu')
            navbar.addEventListener('click', function () {
                navbar.classList.toggle('is-active')
                navbarMenu.classList.toggle('is-active')
            })
        }
    }
</script>