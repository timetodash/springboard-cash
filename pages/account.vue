<template>
  <div style="max-width: 1000px" class="mx-auto">
    <v-row>
      <v-col cols="12">
        <span style="font-size: 24px; font-weight: 1100px">My Backings</span>
      </v-col>
    </v-row>
    <v-card
      v-if="getUserPledges.length === 0"
      style="font-weight: normal; font-size: 18px"
      min-height="200"
      to="/"
    >
      <v-row align="center" justify="center" style="min-height: 200px">
        You haven't backed any projects yet, click here to back your first
        project!</v-row
      ></v-card
    >
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
    <v-card
      v-if="showUserCampaigns().length === 0"
      style="font-weight: normal; font-size: 18px"
      min-height="200"
      to="/project/launch/"
    >
      <v-row align="center" justify="center" style="min-height: 200px">
        Click here to launch your first project.</v-row
      ></v-card
    >
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
  data: () => ({ isDestroyed: false }),
  computed: {
    ...mapGetters([
      'getCampaigns',
      'getCampaignPledges',
      'getUserPledges',
      'getDocumentById',
      'getLatestDocument',
    ]),
  },
  destroyed() {
    this.isDestroyed = true
  },
  async created() {
    await this.fetchDocuments({
      typeLocator: 'springboard.campaign',
      queryOpts: {
        where: [
          ['$createdAt', '>', this.getLatestDocument('campaign')],
          [
            '$ownerId',
            '==',
            this.$store.state.identityId ? this.$store.state.identityId : '',
          ],
        ],
        orderBy: [['$createdAt', 'desc']],
      },
    })

    await this.fetchDocuments({
      typeLocator: 'springboard.pledge',
      queryOpts: {
        where: [
          ['$createdAt', '>', this.getLatestDocument('pledge')],
          [
            '$ownerId',
            '==',
            this.$store.state.identityId ? this.$store.state.identityId : '',
          ],
        ],
        orderBy: [['$createdAt', 'desc']],
      },
    })
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
