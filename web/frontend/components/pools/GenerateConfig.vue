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
                <tab-content title="Software &amp; OS" icon="fas fa-wallet" :before-change="validateSoftwareAndOS">
                    <div class="field is-horizontal">
                        <div class="field-label is-normal">
                            <label class="label">Software</label>
                        </div>
                        <div class="field-body">
                            <div class="field">
                                <div class="control is-expanded">
                                    <div class="select is-fullwidth">
                                        <select class="is-fullwidth" v-model="minerConfig.miner.name" @change="clearMinerOS() && clearMinerCommand()">
                                            <option :value="null" disabled>Select your mining software</option>
                                            <option v-for="miner in miners" :value="miner.name" :key="miner.name">{{ miner.name }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="field is-horizontal">
                        <div class="field-label is-normal">
                            <label class="label">OS</label>
                        </div>
                        <div class="field-body">
                            <div class="field">
                                <div class="control is-expanded">
                                    <div class="select is-fullwidth">
                                        <select class="is-fullwidth" v-model="minerConfig.miner.os.name" @change="clearMinerCommand()">
                                            <option :value="null" disabled>Select your operating system</option>
                                            <option v-for="os in minerOS" :key="os.name">{{ os.name }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </tab-content>
                <tab-content title="Wallet Address" icon="fas fa-wallet" :before-change="validateAddress">
                    <div class="field">
                        <div class="control">
                            <input class="input" v-model="minerConfig.wallet" type="text" minlength="99" maxlength="99" placeholder="Your Wallet Address">
                        </div>
                    </div>
                </tab-content>
                <tab-content title="Verify" icon="fas fa-check" :before-change="generateConfig">
                    <div class="card has-text-left">
                        <div class="card-header">
                            <div class="card-header-title is-block">
                                <p class="is-size-5">{{ config.pool.name }}</p>
                                <p>{{ config.config.desc }}</p>
                            </div>
                        </div>
                        <ul class="card-content">
                            <li class="wrap-word">
                                <span class="has-text-weight-semibold">
                                    Wallet: 
                                </span>
                                {{ minerConfig.wallet }}
                            </li>
                            <li>
                                <span class="has-text-weight-semibold">
                                    Software: 
                                </span>
                                {{ minerConfig.miner.name }}
                            </li>
                            <li>
                                <span class="has-text-weight-semibold">
                                    OS: 
                                </span>
                                {{ minerConfig.miner.os.name }}
                            </li>
                            <li>
                                <span class="has-text-weight-semibold">
                                    Address: 
                                </span>
                                {{ config.pool.mining_address }}
                            </li>
                            <li>
                                <span class="has-text-weight-semibold">
                                    Port: 
                                </span>
                                {{ config.config.port }}
                            </li>
                            <li>
                                <span class="has-text-weight-semibold">
                                    Difficulty: 
                                </span>
                                {{ config.config.difficulty }}
                            </li>
                        </ul>
                    </div>
                </tab-content>
                <tab-content title="Generate" icon="fas fa-cogs">
                    <pre>
                        {{ minerConfig.result }}
                    </pre>

                    <button class="button is-info is-medium m-t-20 m-b-20"
                        v-clipboard:copy="minerConfig.result"
                        @click="copyConfig"
                    >
                        <p v-if="!configCopied">
                            <i class="fas fa-copy is-size-6 m-r-10"></i> Copy
                        </p>
                        <p v-else>
                            <i class="fas fa-check is-size-6 m-r-10"></i> Copied
                        </p>
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
            minerConfig: {
                result: null,
                miner: {
                    name: null,
                    os: {
                        name: null,
                        command: null
                    }
                },
                wallet: null
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
    computed: {
        selectedMiner () {
            const miner = this.miners.filter(miner => miner.name === this.minerConfig.miner.name)[0]
            return miner ? miner : null
        },
        selectedMinerOS () {
            if(this.minerOS === null) return null

            const selectedMinerOS = this.minerOS.filter(miner => miner.name === this.minerConfig.miner.os.name)[0]
            return selectedMinerOS ? selectedMinerOS : null
        },
        minerOS () {
            return this.selectedMiner ? this.selectedMiner.os : null
        }
    },
    methods: {
        closeModal () {
            this.$emit('update:isActive', false)
        },
        generateConfig () {
            this.minerConfig.result = sprintf.sprintf(this.minerConfig.miner.os.command, this.config.pool.mining_address, this.config.config.port, this.minerConfig.wallet)
            return true
        },
        clearMinerOS () {
            this.minerConfig.miner.os.name = null
        },
        clearMinerCommand () {
            this.minerConfig.miner.os.command = null
        },
        validateAddress () {
            return this.minerConfig.wallet.length === 99
        },
        validateSoftwareAndOS () {
            return this.minerConfig.miner.os.name.length > 0 && this.minerConfig.miner.name.length > 0 && this.minerConfig.miner.os.command.length > 0
        },
        copyConfig () {
            this.configCopied = this.minerConfig.result !== null ? true : false
        }
    },
    watch: {
        isActive (newVal) {
            this.configCopied = false
            if(!newVal) {
                this.closeModal()
            }
        },
        'minerConfig.miner.os.name' (newVal) {
            this.clearMinerCommand()
            this.minerConfig.miner.os.command = this.selectedMinerOS ? this.selectedMinerOS.command : null
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