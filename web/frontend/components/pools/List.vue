<template>
  <section>
    <b-table
      :data="pools"
      :is-row-checkable="(row) => true"
      :loading="isLoading"
      detailed
      checkable>
      <template slot-scope="props">
        <b-table-column field="name" label="Name" sortable>
          <a :href="props.row.url" target="_blank">
            {{ props.row.name }}
          </a>
        </b-table-column>
        <b-table-column field="miners" label="Miners" sortable numeric>
          {{ showCell(['data', 'pool', 'miners'], props.row) ? props.row.data.pool.miners : 0 }}
        </b-table-column>
        <b-table-column field="minpayout" label="Min. Payout" sortable numeric>
          {{ showCell(['data', 'config', 'minPaymentThreshold'], props.row) ? props.row.data.config.minPaymentThreshold / props.row.data.config.denominationUnit : '' }}
        </b-table-column>
        <b-table-column field="fee" label="Fee" sortable numeric>
          {{ showCell(['data', 'config', 'fee'], props.row) ? twoDecimals(props.row.data.config.fee) + '%'  : '0%' }}
        </b-table-column>
        <b-table-column field="totalpayments" label="Total Payments" sortable numeric>
          {{ showCell(['data', 'pool', 'totalPayments'], props.row) ? props.row.data.pool.totalPayments : '' }}
        </b-table-column>
        <b-table-column field="minerspaid" label="Miners Paid" sortable numeric>
          {{ showCell(['data', 'pool', 'totalMinersPaid'], props.row) ? props.row.data.pool.totalMinersPaid : '' }}
        </b-table-column>
        <b-table-column field="totalblocks" label="Total Blocks" sortable numeric>
          {{ showCell(['data', 'pool', 'totalBlocks'], props.row) ? props.row.data.pool.totalBlocks : '' }}
        </b-table-column>
        <b-table-column field="hashrate" label="Hashrate" sortable numeric>
          {{ showCell(['data', 'pool', 'hashrate'], props.row) ? humanReadableHashrate(props.row.data.pool.hashrate, 2) : 0 }}
        </b-table-column>
        <b-table-column field="height" label="Height" sortable numeric>
          {{ showCell(['data', 'network', 'height'], props.row) ? props.row.data.network.height : '' }}
        </b-table-column>
        <b-table-column field="lastblockfound" label="Last Block Found" sortable>
          {{ showCell(['data', 'pool', 'lastBlockFound'], props.row) ? getUTC(props.row.data.pool.lastBlockFound) : ''}}
        </b-table-column>
      </template>
      <template slot="detail" slot-scope="props">
        <div v-if="showCell(['data', 'config', 'ports'], props.row)">
          <div class="columns is-centered">
            <div class="column" v-for="(config, index) in props.row.data.config.ports" :key="index">
              <h4>{{ config.desc }}</h4>
              <p>Port: {{ config.port }}</p>
              <p>Difficulty: {{ config.difficulty }}</p>
              <p>
                <select class="inline">
                  <option>Xmr-Stak</option>
                  <option>XMRig</option>
                  <option>XMRig-AMD</option>
                  <option>XMRig-NVIDIA</option>
                  <option>XMRigCC</option>
                  <option>CPUMiner</option>
                  <option>Claymore CPU</option>
                  <option>Claymore GPU</option>
                  <option>YAM Miner</option>
                  <option>ccminer</option>
                  <option>xmrMiner</option>
                </select>
                <button class="inline">Generate Config</button>
              </p>
            </div>
          </div>
        </div>
      </template>
      <template slot="bottom-left">
          
      </template>
    </b-table>
  </section>
</template>

<script>
import vueMixin from '~/mixins/vueMixin.js'

export default {
  name: 'List',
  mixins: [vueMixin],
  props: {
    pools: {
      type: Array,
      required: true,
      default: () => { return [] }
    },
    isLoading: {
      type: Boolean,
      default: true
    }
  }
}
</script>
