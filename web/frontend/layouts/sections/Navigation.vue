<template>
    <nav class="navbar is-transparent has-text-white is-fixed-top">
        <div class="container">
            <div class="navbar-brand">
                <nuxt-link class="navbar-item" to="/">
                    <img src="~/static/turtlecoin_symbol_white.png" alt="Turtle Explorer">
                    TURTLECOIN
                </nuxt-link>
                <div class="navbar-burger burger" data-target="navbarMenu">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div id="navbarMenu" class="navbar-menu">
                <div class="navbar-end">
                    <nuxt-link class="navbar-item white" active-class="is-active" to="/">Home</nuxt-link>
                    <nuxt-link class="navbar-item" active-class="is-active" to="nodes">Nodes</nuxt-link>
                    <nuxt-link class="navbar-item" active-class="is-active" to="pools">Pools</nuxt-link>
                    <nuxt-link class="navbar-item" active-class="is-active" to="blocks">Blocks</nuxt-link>
                    <nuxt-link class="navbar-item" active-class="is-active" to="help">Help</nuxt-link>
                </div>
            </div>
        </div>
    </nav>
</template>