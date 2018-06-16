<template>
  <section>
    <b-table
      :data="pools"
      :columns="columns"
      :is-row-checkable="(row) => true"
      detailed
      checkable>
      <template slot="detail" slot-scope="props">
        {{ props.network }}
      </template>
      <template slot="bottom-left">
          
      </template>
    </b-table>
  </section>
</template>

<script>
export default {
  name: 'List',
  props: {
    pools: {
      type: Array,
      required: true,
      default: () => { return [] }
    }
  },
  data () {
    return {
      columns: [
        {
            field: 'id',
            label: 'ID',
            width: '40',
            numeric: true,
            visible: false
        },
        {
            field: 'name',
            label: 'Name',
            sortable: true
        },
        {
            field: 'url',
            label: 'Url',
            sortable: true
        },
        {
            field: 'api',
            label: 'API',
            sortable: true
        },
        {
            field: 'type',
            label: 'Type',
            sortable: true
        }
      ]
    }
  }
}
</script>