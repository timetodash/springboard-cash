<template>
  <v-form>
    <v-container fluid>
      <v-card
        width="700px"
        class="px-8 py-5 mx-5 my-5 mx-auto"
        style="font-size: 20px"
        elevation="0"
      >
        <v-row>
          <v-col cols="12">
            <span class="pledgedtext">Title</span>
            <v-text-field
              v-model="title"
              placeholder="To the moon"
              required
              class="pledged input_left"
              color="cyan"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <span class="pledgedtext">Description</span>
            <v-textarea
              v-model="description"
              placeholder="The Cow Jumped Over the Moon, since the cow did, will Dash soon?"
              value="description"
              required
              color="cyan"
            ></v-textarea>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-row class="flex-nowrap" no-gutters>
              <v-col cols="2" class="mt-3">
                <span class="pledgedtext">Goal</span>
              </v-col>
              <v-col cols="3" style="width: 100px">
                <v-text-field
                  v-model="amount"
                  placeholder="2"
                  required
                  class="pledged input_center ml-2"
                  color="cyan"
                ></v-text-field>
              </v-col>
              <v-col cols="7" class="mt-3">
                <span class="pledgedtext pl-2">Dash</span>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row class="pb-6">
          <v-col cols="12">
            <span class="pledgedtext">Address</span>
            <v-text-field
              v-model="payoutAddress"
              placeholder="Payout Address"
              required
              style="font-weight: bolder; font-size: 25px"
              color="cyan"
            ></v-text-field>
          </v-col>
          <v-btn
            class="mx-auto mt-12"
            color="cyan"
            :loading="launch"
            style="color: white"
            large
            @click="submitCampaign"
            >Launch Project
          </v-btn>
        </v-row>
      </v-card>
    </v-container>
  </v-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

const Dashcore = require('@dashevo/dashcore-lib')
// eslint-disable-next-line no-unused-vars
const Unit = Dashcore.Unit

export default {
  data: () => ({
    title: '',
    description: '',
    amount: '',
    payoutAddress: '',
    launch: false,
  }),
  computed: { ...mapGetters(['getIdentityId']) },
  async created() {
    if (!this.getIdentityId) this.$router.push('/')
    this.payoutAddress = (await this.getUnusedAddress()).address
  },
  methods: {
    ...mapActions(['submitDocument', 'getUnusedAddress']),
    async submitCampaign() {
      this.launch = true
      const { title, description, amount, payoutAddress } = this

      const result = await this.submitDocument({
        typeLocator: 'springboard.campaign',
        doc: {
          title,
          description,
          amount: Unit.fromBTC(amount).toSatoshis().toString(),
          payoutAddress,
        },
      })

      const campaignId = result.transitions[0].id.toString()

      this.$router.push(`/project/view/${campaignId}`)
    },
  },
}
</script>
