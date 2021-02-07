<template>
  <div>
    <v-card v-if="!campaign" class="mx-5 my-5">
      <v-skeleton-loader type="card-heading, list-item-two-line">
      </v-skeleton-loader>
    </v-card>

    <v-container v-if="campaign" style="max-width: 1000px">
      <v-alert
        v-if="
          getRedemptionTxId(campaignId) ||
          getSumPledges(campaignId) >= campaign.amount
        "
        color="cyan"
        outlined
        icon="mdi-balloon"
      >
        <strong>Congratulations!</strong> This Project is successfully funded!
      </v-alert>
      <v-row>
        <v-col>
          <v-card class="mx-5 my-5" elevation="0" min-height="155">
            <v-card-subtitle class="mb-0 py-0 px-0">
              {{ getUsernameByOwnerId(campaign.$ownerId) }}
            </v-card-subtitle>
            <v-card-title class="pledged mt-0 pt-0 px-0">
              {{ campaign.title }}
            </v-card-title>
            <v-card-text
              class="px-0"
              style="font-size: 20px; font-weight: 500px"
              aria-autocomplete="false
              "
            >
              {{ campaign.description }}
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
                {{ DuffsinDash(getSumPledges(campaignId)) }} Dash
              </span>
            </div>
            <div class="pledgedtext">
              goal
              <span class="pledged">
                {{ DuffsinDash(campaign.amount) }} Dash
              </span>
              <span></span>
            </div>

            <v-dialog v-model="dialog" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-row no-gutters>
                  <v-btn
                    v-if="!getRedemptionTxId(campaignId)"
                    block
                    class="mt-2 mx-auto"
                    color="#7B1FA2"
                    :dark="!!getIdentityId"
                    v-bind="attrs"
                    :disabled="
                      !getIdentityId ||
                      getSumPledges(campaignId) >= campaign.amount
                    "
                    v-on="on"
                  >
                    Back this Project
                  </v-btn>
                  <v-btn
                    v-if="
                      getRedemptionTxId(campaignId) ||
                      getSumPledges(campaignId) >= campaign.amount
                    "
                    block
                    color="#00BCD4"
                    class="pledgedtext"
                  >
                    <a
                      style="text-decoration: none; color: white"
                      :href="
                        'https://testnet-insight.dashevo.org/insight/tx/' +
                        getRedemptionTxId(campaignId)
                      "
                      target="_blank"
                      >View Transaction</a
                    >
                  </v-btn>
                </v-row>
              </template>

              <v-card max-width="600" class="mx-auto" align="start">
                <v-card-title>
                  <div class="pr-4 mb-4 pledgedtext">Back project</div>
                  <div
                    style="font-size: 30px; font-weight: bold; color: purple"
                    class="mb-4"
                  >
                    {{ campaign.title }}
                  </div>
                  <v-text-field
                    v-model="pledgeAmount"
                    :rules="[
                      isNotPledgeAmountTooLarge(),
                      isNotPledgeAmountTooSmall(),
                    ]"
                    height="55"
                    class="input_center"
                    style="font-size: 35px"
                    color="#00BCD4"
                    placeholder="1 Dash"
                    aria-autocomplete="false"
                    autocomplete="false"
                    required
                    autofocus
                  >
                  </v-text-field>
                  <v-btn
                    text
                    link
                    class="mx-auto"
                    style="font-size: 12px"
                    color="#7b1fa2"
                    depressed
                    @click="pledgeAmount = chooseMaxPledgeAmount(campaign)"
                  >
                    Pledge Max Amount:
                    {{ chooseMaxPledgeAmount(campaign) + ' Dash' }}
                  </v-btn>
                  <v-card-text class="px-0">
                    <v-textarea
                      v-model="pledgeMessage"
                      class="mt-4 mx-auto"
                      rows="1"
                      color="cyan"
                      placeholder="Add Optional Message"
                    >
                    </v-textarea>
                  </v-card-text>
                </v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    :loading="isConfirmLoading"
                    color="#00BCD4"
                    style="color: white"
                    :disabled="
                      !isPledgeAmountValid &&
                      chooseMaxPledgeAmount(campaign) > 0
                    "
                    @click="confirmPledge"
                    >Back this Project</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-timeline style="max-width: 900px; margin: auto">
      <v-timeline-item
        v-for="(pledge, idx) in getCampaignPledges(campaignId).reverse()"
        :key="idx"
        small
        color="#00BCD4"
      >
        <v-card class="elevation-2 pl-4 pr-4 pt-2" max-width="400" shaped>
          <div style="font-weight: 400; font-size: 18px">
            <span style="color: #7b1fa2; font-weight: bold">
              {{ getUsernameByOwnerId(pledge.$ownerId) }}
            </span>
            backed
            <span style="color: #7b1fa2; font-weight: bold">
              {{ pledge._dash }}
            </span>
            Dash
          </div>
          <div v-if="pledge.message" style="font-style: italic">
            "{{ pledge.message }}"
          </div>
          <Timeago
            :datetime="pledge.$createdAt"
            style="color: #787878; font-size: 15px"
          />
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

const Dashcore = require('@dashevo/dashcore-lib')
// eslint-disable-next-line no-unused-vars
const Unit = Dashcore.Unit

export default {
  data: () => {
    console.log('this :>> ', this)
    return {
      campaignId: undefined,
      dialog: false,
      pledgeAmount: '',
      pledgeMessage: '',
      isConfirmLoading: false,
    }
  },
  computed: {
    ...mapGetters([
      'getDocumentById',
      'getSumPledges',
      'getIdentityId',
      'getCampaignPledges',
      'getRedemptionTxId',
      'getUsernameByOwnerId',
    ]),
    campaign() {
      const document = this.getDocumentById(this.campaignId)
      return document || undefined
    },
    isPledgeAmountValid() {
      return (
        this.isNotPledgeAmountTooLarge() === true &&
        this.isNotPledgeAmountTooSmall() === true
      )
    },
  },
  async created() {
    this.campaignId = this.$route.params.id

    await this.isClientReady()

    await this.fetchDocumentById({
      typeLocator: 'springboard.campaign',
      docId: this.campaignId,
    })
  },
  methods: {
    ...mapActions([
      'fetchDocuments',
      'fetchDocumentById',
      'isClientReady',
      'createPledgeUtxo',
      'submitDocument',
      'fetchPledges',
      'redeemTx',
      'fetchRedemptionState',
    ]),
    DuffsinDash(duffs) {
      return Unit.fromSatoshis(duffs).toBTC()
    },
    isNotPledgeAmountTooLarge() {
      const maxAmount = this.chooseMaxPledgeAmount(this.campaignId)

      if (!maxAmount) return 'Max Amount not available'

      const res =
        Unit.fromBTC(this.pledgeAmount).toSatoshis() <=
          Unit.fromBTC(maxAmount).toSatoshis() || 'Amount too large'

      return res
    },
    isNotPledgeAmountTooSmall() {
      const pledgeAmount = Dashcore.Unit.fromBTC(this.pledgeAmount).toSatoshis()

      const dustAmount = 500

      const minAmount = this.campaign.amount / 16

      if (pledgeAmount <= 0) return 'Be positive'

      if (pledgeAmount < dustAmount) return 'This is just dust'

      if (pledgeAmount < minAmount)
        return `Min amount is ${Dashcore.Unit.fromSatoshis(minAmount).toBTC()}`

      return true
    },
    async confirmPledge() {
      this.isConfirmLoading = true

      const [pledgeUtxo, tx] = await this.createPledgeUtxo({
        campaignRecipient: this.campaign.payoutAddress,
        campaignSatoshis: this.campaign.amount,
        pledgeSatoshis: Unit.fromBTC(this.pledgeAmount).toSatoshis(),
      })

      const doc = {
        campaignId: this.campaign.$id,
        message: this.pledgeMessage,
        utxo: pledgeUtxo,
        tx,
      }
      await this.submitDocument({ typeLocator: 'springboard.pledge', doc })

      await this.fetchDocuments({
        typeLocator: 'springboard.pledge',
        queryOpts: {
          where: [['campaignId', '==', this.campaignId]],
          orderBy: [['$createdAt', 'desc']],
        },
      })

      console.log(
        'this.getSumPledges(this.campaignId) :>> ',
        this.getSumPledges(this.campaignId)
      )

      console.log('this.campaign.amount :>> ', this.campaign.amount)

      if (this.getSumPledges(this.campaignId) >= this.campaign.amount)
        this.redeemTx({ campaignId: this.campaignId })

      this.dialog = false
      this.isConfirmLoading = false
      this.pledgeMessage = ''
      this.pledgeAmount = ''
    },
    progressPledges(campaign) {
      return (
        (parseInt(this.getSumPledges(campaign.$id)) /
          parseInt(this.campaign.amount)) *
        100
      )
    },
    chooseMaxPledgeAmount(campaign) {
      const walletMax = Unit.fromBTC(
        this.$store.state.walletBalance
      ).toSatoshis()
      const pledgeMax =
        parseInt(this.campaign.amount) - this.getSumPledges(campaign.$id)

      const satoshis = walletMax > pledgeMax ? pledgeMax : walletMax

      return this.DuffsinDash(satoshis)
    },
  },
}
</script>
