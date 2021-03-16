<template>
  <div>
    <v-card
      max-width="1000"
      class="mx-auto"
      style="background-color: unset !important"
      @click="viewCampaign(campaign.$id)"
    >
      <v-alert
        v-if="getRedemptionTxId(campaign.$id)"
        class="ma-2"
        color="cyan"
        outlined
        icon="mdi-balloon"
      >
        <strong>Congratulations!</strong> This Project is successfully funded!
      </v-alert>
      <v-container>
        <v-row>
          <v-col>
            <v-card class="mx-5" elevation="0" min-height="155">
              <v-card-subtitle class="mb-0 py-0">
                {{ getUsernameByOwnerId(campaign.$ownerId) }}
              </v-card-subtitle>

              <v-card-title class="pledged mt-0 pt-0">
                {{ campaign.title }}
              </v-card-title>
              <v-card-text style="font-size: 20px; font-weight: 500px">
                <div v-linkify="campaign.description" />
              </v-card-text>
            </v-card>
          </v-col>

          <v-col>
            <v-progress-linear
              height="18"
              color="cyan"
              striped
              :value="progressPledges(campaign)"
              class="mt-5"
            >
            </v-progress-linear>
            <div>
              <div class="pledgedtext">
                backed
                <span class="pledged">
                  {{ DuffsinDash(getSumPledges(campaign.$id)) }} Dash
                </span>
              </div>
              <div class="pledgedtext">
                goal
                <span class="pledged">
                  {{ DuffsinDash(campaign.amount) }} Dash
                </span>
                <span></span>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
const Dashcore = require('@dashevo/dashcore-lib')
// eslint-disable-next-line no-unused-vars
const Unit = Dashcore.Unit

export default {
  // eslint-disable-next-line vue/require-valid-default-prop
  // eslint-disable-next-line vue/require-default-prop
  props: { campaign: { type: Object } },
  data: () => ({
    pledgeDialog: false,
  }),
  computed: {
    ...mapGetters([
      'getSumPledges',
      'getRedemptionTxId',
      'getUsernameByOwnerId',
    ]),
  },
  methods: {
    ...mapActions(['fetchDocuments']),
    DuffsinDash(duffs) {
      return Unit.fromSatoshis(duffs).toBTC()
    },
    viewCampaign(goto) {
      this.$router.push('/project/view/' + goto)
    },
    progressPledges(campaign) {
      return (
        (parseInt(this.getSumPledges(campaign.$id)) /
          parseInt(this.campaign.amount)) *
        100
      )
    },
  },
}
</script>

<style scoped>
.v-card {
  background-color: unset !important;
}
</style>
