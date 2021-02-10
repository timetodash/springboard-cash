<template>
  <div style="max-width: 1000px" class="mx-auto">
    <v-row>
      <v-col cols="12">
        <span style="font-size: 24px; font-weight: 1100px">My Backings</span>
      </v-col>
    </v-row>
    <MyBacking
      v-for="pledge in getUserPledges"
      :key="pledge.$id"
      :pledge="pledge"
    />
    <v-row class="mt-12">
      <v-col cols="12">
        <span style="font-size: 24px; font-weight: 1100px">My Projects</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pt-0">
        <v-card
          v-for="(campaign, i) in showUserCampaigns()"
          :key="i"
          class="mt-1"
          @click="$router.push('/project/view/' + campaign.$id)"
        >
          <listCard :campaign="campaign" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import listCard from '~/components/listCard.vue'
import MyBacking from '~/components/MyBacking.vue'

export default {
  components: { listCard, MyBacking },
  data: () => ({}),
  computed: {
    ...mapGetters([
      'getCampaigns',
      'getCampaignPledges',
      'getUserPledges',
      'getDocumentById',
    ]),
  },
  async created() {
    await this.fetchDocuments({
      typeLocator: 'springboard.campaign',
      queryOpts: {
        orderBy: [['$createdAt', 'desc']],
      },
    })

    console.log('show cache', this.getUserPledges)
  },
  methods: {
    ...mapActions(['fetchDocuments', 'revokePledge']),
    revokePledgeWrapper(pledge) {
      console.log('revoke pledge :>> ', pledge)
      this.revokePledge(pledge)
    },
    showUserCampaigns() {
      if (!this.$store.state.identityId) return ''
      const myCampaigns = this.getCampaigns.filter(
        (m) => m.$ownerId === this.$store.state.identityId
      )
      console.log('myCampaigns', myCampaigns)
      return myCampaigns
    },
  },
}
</script>

<style></style>
