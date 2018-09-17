<template>
    <section v-cloak>
        <b-modal
            :active.sync="isActive"
            :width="640"
            :canCancel="true"
        >
            <form-wizard
                @on-complete="closeModal"
                shape="circle"
                title="Generate Mining Config"
                subtitle=""
                color="#00853D"
            >
                <tab-content title="Software & OS" icon="fas fa-wallet" :before-change="validateSoftwareAndOS">
                    <div class="field">
                        <div class="control">
                            <div class="select">
                                <select v-model="miner.name">
                                    <option v-for="miner in miners" :value="miner.name" :key="miner.name">{{ miner.name }}</option>
                                </select>
                            </div>
                        </div>
                        <div class="control">
                            <div class="select">
                                <select v-model="miner.os.name">
                                    <option v-for="os in selectedSoftwareOS" :key="os.name">{{ os.name }}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </tab-content>
                <tab-content title="Wallet Address" icon="fas fa-wallet" :before-change="validateAddress">
                    <div class="field">
                        <div class="control">
                            <input class="input" v-model="wallet" type="text" minlength="99" maxlength="99" placeholder="Your Wallet Address">
                        </div>
                    </div>
                </tab-content>
                <tab-content title="Verify" icon="fas fa-check" :before-change="generateConfig">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-header-title">
                                <p>{{ config.pool.name }}</p>
                                <p>{{ config.config.desc }}</p>
                            </div>
                        </div>
                        <div class="card-content">
                            <p class="wrap-word">Wallet: {{ minerConfig.wallet }}</p>
                            <p>Address: {{ config.pool.address }}</p>
                            <p>Port: {{ config.config.port }}</p>
                            <p>Difficulty: {{ config.pool.difficulty }}</p>
                        </div>
                    </div>
                </tab-content>
                <tab-content title="Generate" icon="fas fa-cogs">
                    <pre>
                        {{ minerConfig.result }}
                    </pre>
                    <button class="button"
                        v-clipboard:copy="minerConfig.result"
                        v-clipboard:success="copyConfigToClipboard"
                    >
                    </button>
                </tab-content>
                <template slot="custom-buttons-left">
                    <wizard-button
                        @click.native="closeModal"
                        class="has-background-danger has-text-white"
                    >
                        Cancel
                    </wizard-button>
                </template>
            </form-wizard>
        </b-modal>
    </section>
</template>

<script>
import sprintf from 'sprintf-js'

export default {
    name: 'GenerateConfig',
    props: {
        config: {
            type: Object,
            required: true,
            default: () => {}
        },
        isActive: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            configCopied: false,
            miner: {
                name: '',
                os: {
                    name: '',
                    command: ''
                }
            },
            wallet: '',
            result: '',
            minerConfig: {

                result: '',
                miner: {
                    name: '',
                    os: {
                        name: '',
                        command: ''
                    }
                },
                wallet: ''
            },
            miners: [
                {
                  name: 'Xmr-Stak',
                  os: [
                    {
                        name: 'Linux',
                        command: `"pool_list" : [{"pool_address" : "%1$s:%2$s", "wallet_address" : "%3$s", "rig_id" : "", pool_password" "", "use_nicehash" : false, "use_tls" : false, "tls_fingerprint" : "", "pool_weight" : 1 },],`
                    },
                    {
                        name: 'Windows',
                        command: `"pool_list" : [{"pool_address" : "%1$s:%2$s", "wallet_address" : "%3$s", "rig_id" : "", pool_password" "", "use_nicehash" : false, "use_tls" : false, "tls_fingerprint" : "", "pool_weight" : 1 },],`
                    },
                    {
                        name: 'Mac',
                        command: `"pool_list" : [{"pool_address" : "%1$s:%2$s", "wallet_address" : "%3$s", "rig_id" : "", pool_password" "", "use_nicehash" : false, "use_tls" : false, "tls_fingerprint" : "", "pool_weight" : 1 },],`
                    }
                  ]
                },
                {
                  name: 'XMRig',
                  os: [
                    {
                        name: 'Linux',
                        command: `"pool_list" : [{"pool_address" : "%1$s:%2$s", "wallet_address" : "%3$s", "rig_id" : "", pool_password" "", "use_nicehash" : false, "use_tls" : false, "tls_fingerprint" : "", "pool_weight" : 1 },],`
                    },
                    {
                        name: 'Windows',
                        command: `"pool_list" : [{"pool_address" : "%1$s:%2$s", "wallet_address" : "%3$s", "rig_id" : "", pool_password" "", "use_nicehash" : false, "use_tls" : false, "tls_fingerprint" : "", "pool_weight" : 1 },],`
                    },
                    {
                        name: 'Mac',
                        command: `"pool_list" : [{"pool_address" : "%1$s:%2$s", "wallet_address" : "%3$s", "rig_id" : "", pool_password" "", "use_nicehash" : false, "use_tls" : false, "tls_fingerprint" : "", "pool_weight" : 1 },],`
                    }
                  ]
                },
                {
                  name: 'XMRigCC',
                  os: [
                    {
                        name: 'Windows',
                        command: `"pool_list" : [{"pool_address" : "%1$s:%2$s", "wallet_address" : "%3$s", "rig_id" : "", pool_password" "", "use_nicehash" : false, "use_tls" : false, "tls_fingerprint" : "", "pool_weight" : 1 },],`
                    },
                    {
                        name: 'Mac',
                        command: `"pool_list" : [{"pool_address" : "%1$s:%2$s", "wallet_address" : "%3$s", "rig_id" : "", pool_password" "", "use_nicehash" : false, "use_tls" : false, "tls_fingerprint" : "", "pool_weight" : 1 },],`
                    }
                  ]
                }
            ]
        }
    },
    mounted () {
        this.miner.name = this.miners[0].name
        this.miner.os = this.miners[0].os[0]
    },
    computed: {
        selectedSoftwareOS () {
            const miner = this.miners.filter(miner => miner.name === this.miner.name)[0]
            return typeof miner !== 'undefined' ? miner.os : []
        },
        validateAddress () {
            return this.wallet.length === 99
        }
    },
    methods: {
        closeModal () {
            this.isActive = false
        },
        copyConfigToClipboard () {
            this.configCopied = true
        },
        generateConfig () {
            this.minerConfig.result = sprintf.sprintf(this.minerConfig.miner.command.trim(), this.minerConfig.poolAddress, this.minerConfig.poolConfig.port, this.minerConfig.wallet)
            return true
        },
        validateSoftwareAndOS () {
            return this.miner.name.length > 0 && this.miner.os.name.length > 0
        }
    },
    watch: {
        isActive (newVal) {
            this.configCopied = false
            if(!newVal) {
                this.$emit('config-generator-status', false)
            }
        }
    }
}
</script>

<style>
.modal-close {
    display: none;
}

.modal-background {
    background: #3c3c3c;
    opacity: 0.7;
}
</style>