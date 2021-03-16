<template>
  <v-card nuxt :to="'/project/view/' + pledge.campaignId">
    <v-overlay v-if="isRevoked" absolute color="#949494"> </v-overlay>
    <v-row justify="space-between">
      <v-col cols="7">
        <v-card-title style="font-weight: normal; font-size: 26px">
          {{ showCampaignName(pledge).title }}</v-card-title
        >
      </v-col>
      <v-col cols="3" align-self="center">
        <v-card-title class="pledged px-0"
          >{{ pledge._dash }} Dash
        </v-card-title>
      </v-col>
      <v-col cols="2" align-self="center">
        <v-btn
          :loading="isRevoking"
          :disabled="isRevoked"
          color="cyan"
          :dark="!isRevoked"
          align-self="end"
          @click.prevent="revokePledgeWrapper(pledge)"
          >Revoke</v-btn
        >
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: { pledge: { type: Object, default: () => {} } },
  data: () => ({ isRevoking: false, isRevoked: false }),
  computed: {
    ...mapGetters(['getDocumentById']),
  },
  async created() {},
  methods: {
    ...mapActions(['revokePledge']),
    showCampaignName(pledge) {
      const campaign = this.getDocumentById(pledge.campaignId)
      return campaign || { title: pledge.$id }
    },
    async revokePledgeWrapper(pledge) {
      this.isRevoking = true

      console.log('revoke pledge :>> ', pledge)

      await this.revokePledge(pledge)

      this.isRevoking = false

      this.isRevoked = true
    },
  },
}
</script>

<style></style>
