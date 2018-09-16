<template>
    <footer class="footer">
        <div class="columns">
            <div class="column has-text-centered m-t-10">
                <ul class="is-size-5">
                    <li class="p-b-10">
                        <a href="https://turtlecoin.lol/" target="turltcoin">
                            TurtleCoin
                        </a>
                    </li>
                    <li class="is-inline-block">
                        <a href="http://chat.turtlecoin.lol/" target="turltcoin" title="TurtleCoin - Discord">
                            <font-awesome-icon :icon="faDiscord"/>
                        </a>
                    </li>
                    <li class="is-inline-block m-l-10">
                        <a href="https://github.com/turtlecoin" target="turltcoin" title="TurtleCoin - Github">
                            <font-awesome-icon :icon="faGithub"/>
                        </a>
                    </li>
                    <li class="is-inline-block m-l-10">
                        <a href="https://www.reddit.com/r/TRTL/" target="turltcoin" title="TurtleCoin - Reddit">
                            <font-awesome-icon :icon="faReddit"/>
                        </a>
                    </li>
                    <li class="is-inline-block m-l-10">
                        <a href="https://twitter.com/_turtlecoin" target="turltcoin" title="TurtleCoin - Twitter">
                            <font-awesome-icon :icon="faTwitter"/>
                        </a>
                    </li>
                    <li class="is-inline-block m-l-10">
                        <a href="https://www.facebook.com/groups/204815433401566/" target="turltcoin" title="TurtleCoin - Facebook">
                            <font-awesome-icon :icon="faFacebook"/>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="content has-text-centered">
            <div class="control level-item">
                <a href="https://github.com/andrewnk/turtle-explorer" target="_blank">
                    <div class="tags has-addons">
                        <font-awesome-icon :icon="faGithub"/><span class="p-l-10">Turtle Explorer</span>
                    </div>
                </a>
            </div>
            <div class="p-t-20 wrap-word">
                Donate: TRTLuz2tDXUDHSAPzB1bZnQU9qyGnN5cX6htZZzjxPJ3Qr9u5hrQjsQBi7j7d75SAgDygkR1adQBhZHdQrFeWoaMXqWwytS37xT
            </div>
        </div>
    </footer>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGithub, faDiscord, faReddit, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'

export default {
    computed: {
      faGithub () {
         return faGithub
      },
      faDiscord () {
        return faDiscord
      },
      faReddit () {
        return faReddit
      },
      faTwitter () {
        return faTwitter
      },
      faFacebook () {
        return faFacebook
      }
    }
}

</script>
