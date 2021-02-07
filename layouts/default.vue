<template>
  <v-app>
    <v-app-bar app dense color="white" dark>
      <img
        :src="require('~/assets/springboard-appbar3.jpg')"
        style="cursor: pointer"
        @click="routerPushAndRefresh('/')"
      />
      <v-spacer></v-spacer>

      <LoginDialog />
    </v-app-bar>
    <v-main>
      <v-row class="flew-nowrap">
        <v-col align-self="center" align="center" class=""> </v-col>
      </v-row>
      <Snackbar />

      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import LoginDialog from '~/components/LoginDialog.vue'

import Snackbar from '~/components/Snackbar'

export default {
  components: { Snackbar, LoginDialog },
  data() {
    return { totalBalance: '' }
  },
  computed: { ...mapGetters(['getIdentityId']) },
  async created() {
    await this.initWallet({
      // mnemonic:
      // 'ritual zebra tiny hundred syrup bullet captain royal dinosaur void blind hotel',
      // 'cheese negative throw yard erase bitter struggle alter barrel found else velvet',
      // 'mushroom dove remember inmate garlic inflict fetch swallow write sponsor wall manage',
      //  'mushroom dove remember inmate garlic inflict fetch swallow write sponsor wall manage'
      // 'essay love suffer inquiry buffalo advance glue boil arrive glove clutch oyster',
      // 'bless fluid disagree depart trade donor uniform dust month side dad tray',
      // 'luggage vacuum solution element rigid have provide enough defense champion frog camera',
      // 'catch fine embrace frequent prepare cruise relax faculty artwork yard sustain report',
      //  'neither neither apple collect warm trip luggage path tenant test liquid effort'
      //  'neck neither tired bargain pizza quantum anxiety wait hire network nasty joke'
      //  'pride dolphin pluck orphan crunch erode soft damage metal corn risk slot'
      //  'injury slender heart powder shove canal crash exile nest cement impact chair'
      // 'shock immense hand zoo mean seat vehicle artwork element month story water',
      // 'economy annual cool rally minute toast gas oyster august lamp sail isolate',
    })
    this.loopRefreshBalance()
  },
  methods: {
    ...mapActions(['initWallet', 'refreshBalance', 'fetchDocuments']),
    routerPushAndRefresh(route) {
      this.$router.push(route)
      this.fetchDocuments({
        typeLocator: 'springboard.campaign',
        queryOpts: {
          orderBy: [['$createdAt', 'desc']],
        },
      })
    },
    async loopRefreshBalance() {
      this.refreshBalance()
      await this.$sleep(1000)
      this.loopRefreshBalance()
    },
  },
}
</script>

<style>
.pledged {
  font-weight: bold;
  color: #9c27b0 !important;
  font-size: 30px;
}
.pledgedtext {
  font-weight: bolder;
  font-size: 30px;
}
* {
  text-transform: none !important;
}
input {
  color: #9c27b0 !important;
}
.input_left input {
  text-align: left !important;
}
.input_center input {
  text-align: center !important;
}
textarea {
  color: #9c27b0 !important;
  font-size: 20px;
  font-weight: bolder;
}
</style>
