<template>
  <div>
    <v-btn
      color="cyan"
      class="ml-4 mr-2"
      to="/project/launch/"
      :disabled="!getIdentityId"
    >
      Launch a Project
    </v-btn>
    <v-btn
      v-if="!getIdentityId"
      right
      color="cyan"
      style="color: white"
      :loading="isLoggingIn"
      class="pledgedtext"
      @click.stop="showLoginDialog = true"
      >Log in</v-btn
    >
    <v-btn
      v-if="isLoggingIn"
      right
      color="purple"
      class="ml-2"
      @click.stop="logout()"
      >Cancel</v-btn
    >
    <v-menu v-if="getIdentityId" offset-y
      ><template v-slot:activator="{ on, attrs }">
        <v-btn color="purple" text v-bind="attrs" v-on="on"
          >Account: {{ getMyUsername }}</v-btn
        ></template
      >
      <v-list>
        <v-list-item
          >{{ Math.floor(getMyWalletBalance * 100) / 100 }} Dash</v-list-item
        ></v-list
      ><v-list-item @click="$router.push('/account')">My Account </v-list-item>
      <v-list-item @click.stop="logout()">Log out</v-list-item>
    </v-menu>
    <v-dialog
      v-model="showLoginDialog"
      vuetify-breakpoint-xs-only-
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Login</span>
          <v-spacer> </v-spacer>
          <span>
            <img :src="require('~/assets/springboard-logo-small.png')" />
          </span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-alert dense outlined color="#7B1FA2">
            <div>
              <strong>Hint:</strong> Never paste your mnemonic into a website in
              the real world!
            </div>
          </v-alert>
          <v-textarea
            ref="mnemonic"
            v-model="mnemonicText"
            :label="mnemonicDialogLabel"
            auto-grow
            outlined
            :loading="mnemonicDialogLoading"
            rows="3"
            row-height="25"
            clearable
            color="cyan"
            clear-icon="mdi-backspace"
          ></v-textarea>
        </v-card-text>
        <v-card-actions class="px-6">
          <v-btn large @click="showLoginDialog = false">Close</v-btn>
          <v-spacer></v-spacer>
          <v-btn large color="cyan" style="color: white" @click="login"
            >Login</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {},
  data() {
    return {
      showLoginDialog: false,
      mnemonicDialogTitle: 'Login',
      mnemonicDialogLabel: 'bean draw casual parrot ..',
      mnemonicDialogLoading: false,
      mnemonicText: '',
      mnemonicPin: '',
      isLoggingIn: false,
    }
  },
  computed: {
    ...mapGetters(['getIdentityId', 'getMyUsername', 'getMyWalletBalance']),
    displayName() {
      return this.getIdentityId ? this.getIdentityId.substr(0, 6) : ''
    },
  },
  created() {},
  methods: {
    ...mapActions(['initWallet', 'showSnackbar', 'resetState']),
    async login() {
      this.showSnackbar({
        text: 'Logging in, this may take a moment ..',
        color: 'cyan',
      })
      this.isLoggingIn = true
      this.showLoginDialog = false
      await this.initWallet({ mnemonic: this.mnemonicText })
      this.isLoggingIn = false
    },

    logout() {
      this.isLoggingIn = false
      this.initWallet({})
      this.$router.push('/')
    },
  },
}
</script>
