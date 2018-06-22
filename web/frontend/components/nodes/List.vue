<template>
  <section>
    <b-table
      :data="nodes"
      :is-row-checkable="(row) => true"
      :loading="isLoading"
      detailed
      checkable>
      <template slot-scope="props">
        <b-table-column field="name" label="Name" sortable numeric>
            {{ showCell(['row', 'name'], props) ? props.row.name : '' }}
        </b-table-column>
        <b-table-column field="height" label="Height" sortable numeric>
            {{ showCell(['data', 'height'], props.row) ? props.row.data.height : '' }}
        </b-table-column>
        <b-table-column field="difficulty" label="Difficulty" sortable numeric>
            {{ showCell(['data', 'difficulty'], props.row) ? props.row.data.difficulty : '' }}
        </b-table-column>
        <b-table-column field="hashrate" label="Hashrate" sortable numeric>
            {{ showCell(['data', 'hashrate'], props.row) ? props.row.data.hashrate : '' }}
        </b-table-column>
        <b-table-column field="txcount" label="Transaction Count" sortable numeric>
            {{ showCell(['data', 'tx_count'], props.row) ? props.row.data.tx_count : 0 }}
        </b-table-column>
        <b-table-column field="txpoolsize" label="Transaction Pool Size" sortable numeric>
            {{ showCell(['data', 'tx_pool_size'], props.row) ? props.row.data.tx_pool_size : 0 }}
        </b-table-column>
        <b-table-column field="incoming" label="Incoming Connections" sortable numeric>
            {{ showCell(['data', 'incoming_connections_count'], props.row) ? props.row.data.incoming_connections_count : 0 }}
        </b-table-column>
        <b-table-column field="outgoing" label="Outgoing Connections" sortable numeric>
            {{ showCell(['data', 'outgoing_connections_count'], props.row) ? props.row.data.outgoing_connections_count : 0 }}
        </b-table-column>
        <b-table-column field="last_known_block_index" label="Last Known Block Index" sortable>
            {{ showCell(['data', 'last_known_block_index'], props.row) ? props.row.data.last_known_block_index : '' }}
        </b-table-column>
        <b-table-column field="time" label="Timestamp" sortable>
            {{ showCell(['row', 'timestamp'], props) ? getFromattedDate(props.row.timestamp) : ''}}
        </b-table-column>
        <b-table-column field="version" label="Version" sortable numeric>
            {{ showCell(['data', 'version'], props.row) ? props.row.data.version : '' }}
        </b-table-column>
        <b-table-column field="status" label="Status" sortable>
            {{ showCell(['data', 'status'], props.row) ? props.row.data.status : 'Failed to Connect'}}
        </b-table-column>
      </template>
      <template slot="detail" slot-scope="props">
        
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
    nodes: {
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
