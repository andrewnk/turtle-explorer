<template>
    <footer class="footer">
        <div class="columns">
            <div class="column is-3 is-offset-2">
                <h2><strong>About TurtleCoin</strong></h2>
                <ul>
                    <li><a href="https://turtlecoin.lol/">https://turtlecoin.lol/</a></li>
                </ul>
            </div>
            <div class="column is-3">
                <h2><strong>Category</strong></h2>
                <ul>
                    <li><a href="https://turtlecoin.lol/">https://turtlecoin.lol/</a></li>
                </ul>
            </div>
            <div class="column is-4">
                <h2><strong>Category</strong></h2>
                <ul>
                    <li><a href="https://turtlecoin.lol/">https://turtlecoin.lol/</a></li>
                </ul>
            </div>
        </div>
        <div class="content has-text-centered">
            <p>
                <a class="icon" href="https://github.com/andrewnk/turtle-explorer">
                    <font-awesome-icon :icon="faGithub" />
                </a>
            </p>
            <div class="control level-item">
                <a href="https://github.com/andrewnk/turtle-explorer">
                    <div class="tags has-addons">
                        <span class="tag is-dark">Turtle Explorer</span>
                    </div>
                </a>
            </div>
            <p>
                Donate: TRTLv3McrGBNauWQCx6kVDV38RMG3RbjNcA2551KNDmtDpAzzvx254ocn5vQptQ8M2LLqLrtDBvXjLg51k9WNUddUGMfBtxcwRv
            </p>
        </div>
    </footer>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

export default {
    computed: {
      faGithub () {
         return faGithub
      }
    }
}

</script>
