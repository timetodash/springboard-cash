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
  computed: {
    ...mapGetters(['getCampaigns', 'getLatestDocument', 'getCampaignPledges']),
  },
  created() {
    this.fetchDocuments({
      typeLocator: 'springboard.campaign',
      queryOpts: {
        orderBy: [['$createdAt', 'desc']],
      },
    })

    this.loopFetchNewCampaigns()
  },
  methods: {
    ...mapActions(['fetchDocuments', 'isClientReady', 'fetchL1UTXOSByAddress']),
    async loopFetchNewCampaigns() {
      console.log(
        'this.getLatestDocument(campaign) :>> ',
        this.getLatestDocument('campaign')
      )
      await this.fetchDocuments({
        typeLocator: 'springboard.campaign',
        queryOpts: {
          where: [['$createdAt', '>', this.getLatestDocument('campaign')]],
          orderBy: [['$createdAt', 'desc']],
        },
      })

      await this.$sleep(3000)
      await this.fetchNewPledges()
      await this.$sleep(3000)
      await this.checkPledges()
      await this.$sleep(3000)
      // Update projects' funding status
      await this.fetchDocuments({
        typeLocator: 'springboard.redemptionTx',
        where: [['$createdAt', '>', this.getLatestDocument('redemptionTx')]],
      })
      this.loopFetchNewCampaigns()
    },
    async fetchNewPledges() {
      for (let idx = 0; idx < this.getCampaigns.length; idx++) {
        await this.fetchDocuments({
          typeLocator: 'springboard.pledge',
          queryOpts: {
            where: [
              ['campaignId', '==', this.getCampaigns[idx].$id],
              ['$createdAt', '>', this.getLatestDocument('pledge')],
            ],
            orderBy: [['$createdAt', 'desc']],
          },
        })
      }
    },
    async checkPledges() {
      for (let i = 0; i < this.getCampaigns.length; i++) {
        for (
          let idx = 0;
          idx < this.getCampaignPledges(this.getCampaigns[i].$id).length;
          idx++
        ) {
          await this.fetchL1UTXOSByAddress(
            this.getCampaignPledges(this.getCampaigns[i].$id)[idx]
              ._pledgeFromAddress
          )
        }
      }
    },
  },
}
</script>
