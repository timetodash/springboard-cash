<template>
  <div>
    <v-container>
      <v-row dense>
        <v-col v-for="(campaign, i) in getCampaigns" :key="i" cols="12">
          <listCard :campaign="campaign" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import listCard from '~/components/listCard'

export default {
  components: { listCard },
  data: () => ({}),
  computed: { ...mapGetters(['getCampaigns']) },
  created() {
    this.fetchDocuments({
      typeLocator: 'springboard.campaign',
      queryOpts: {
        orderBy: [['$createdAt', 'desc']],
      },
    })
  },
  methods: {
    ...mapActions(['fetchDocuments', 'isClientReady']),
  },
}
</script>
