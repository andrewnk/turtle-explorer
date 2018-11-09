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
                <tab-content title="Software &amp; OS" icon="fas fa-save" :before-change="validateSoftwareAndOS">
                    <div class="field is-horizontal">
                        <div class="field-label is-normal">
                            <label class="label">Software</label>
                        </div>
                        <div class="field-body">
                            <div class="field">
                                <div class="control is-expanded">
                                    <div class="select is-fullwidth" :class="!minerConfig.miner.name ? 'is-danger' : ''">
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
                                    <div class="select is-fullwidth" :class="!minerConfig.miner.os.name ? 'is-danger' : ''">
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
                <tab-content title="Wallet Address" icon="fas fa-wallet" :before-change="validWallet">
                    <div class="field">
                        <div class="control">
                            <input class="input" :class="!validWallet() ? 'is-danger' : ''" v-model="minerConfig.wallet" type="text" minlength="99" maxlength="99" placeholder="Your Wallet Address">
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
                            <li v-if="config.config.fee_id !== null">
                                <span class="has-text-weight-semibold">
                                    Fee Type: 
                                </span>
                                {{ getPortFeeType(config.config.fee_id) }}
                            </li>
                            <li v-if="config.config.fee_id !== null">
                                <span class="has-text-weight-semibold">
                                    Fee: 
                                </span>
                                {{ getPortFee(config.config.fee_id) }}%
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
                    <div v-show="minerConfig.result.config">
                        <div class="has-text-left is-size-5">Config</div>
                        <pre>
<!-- deals with spacing issue in pre-->
{{ minerConfig.result.config }}
                        </pre>
                        <button class="button is-info m-t-20 m-b-20"
                            v-clipboard:copy="minerConfig.result.config"
                            @click="copyConfig"
                        >
                            <p v-if="!configCopied">
                                <i class="fas fa-copy is-size-6 m-r-10"></i> Copy Config
                            </p>
                            <p v-else>
                                <i class="fas fa-check is-size-6 m-r-10"></i> Config Copied
                            </p>
                        </button>
                    </div>

                    <div v-show="minerConfig.result.command">
                        <div class="has-text-left is-size-5">Command</div>
                        <pre>
<!-- deals with spacing issue in pre-->
{{ minerConfig.result.command }}
                        </pre>

                        <button class="button is-info m-t-20 m-b-20"
                            v-clipboard:copy="minerConfig.result.command"
                            @click="copyCommand"
                        >
                            <p v-if="!commandCopied">
                                <i class="fas fa-copy is-size-6 m-r-10"></i> Copy Command
                            </p>
                            <p v-else>
                                <i class="fas fa-check is-size-6 m-r-10"></i> Command Copied
                            </p>
                        </button>
                    </div>

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
import miners from '~/config/miners'
import sprintf from 'sprintf-js'
import vueMixin from '~/mixins/vueMixin'

export default {
    name: 'GenerateConfig',
    mixins: [vueMixin],
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
            commandCopied: false,
            minerConfig: {
                result: {
                    config: null,
                    command: null
                },
                miner: {
                    name: null,
                    os: {
                        name: null,
                        command: null,
                        config: null
                    }
                },
                wallet: this.$cookie.get('wallet') ? this.$cookie.get('wallet') : null
            },
            miners: miners
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
            this.minerConfig.result.command = sprintf.sprintf(this.minerConfig.miner.os.command, this.config.pool.mining_address, this.config.config.port, this.minerConfig.wallet).trim()
            this.minerConfig.result.config = sprintf.sprintf(this.minerConfig.miner.os.config, this.config.pool.mining_address, this.config.config.port, this.minerConfig.wallet).trim()
            return true
        },
        clearMinerOS () {
            this.minerConfig.miner.os.name = null
        },
        clearMinerCommand () {
            this.minerConfig.miner.os.command = null
            this.minerConfig.miner.os.config = null
        },
        validWallet () {
            return this.validateWalletAddress(this.minerConfig.wallet)
        },
        validateSoftwareAndOS () {
            return this.minerConfig.miner.os.name.length > 0 && this.minerConfig.miner.name.length > 0 && (this.minerConfig.miner.os.command.length > 0 || this.minerConfig.miner.os.config.length > 0)
        },
        copyConfig () {
            this.configCopied = this.minerConfig.result.config !== null ? true : false
        },
        copyCommand () {
            this.commandCopied = this.minerConfig.result.command !== null ? true : false
        },
        getPortFee (feeId) {
            if(this.config.pool.fees === undefined) return
            return this.config.pool.fees.filter(val => val.id === feeId)[0].fee
        },
        getPortFeeType (feeId) {
            if(this.config.pool.fees === undefined) return
            return this.config.pool.fees.filter(val => val.id === feeId)[0].fee_type
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
            this.minerConfig.miner.os.config = this.selectedMinerOS ? this.selectedMinerOS.config : null
        },
        'minerConfig.wallet': function(newVal) {
            if (this.validateWalletAddress(newVal)) {
                this.$cookie.set('wallet', newVal, { expires: 365 })
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