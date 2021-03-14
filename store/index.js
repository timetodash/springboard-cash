import Dash from 'dash'
import Vue from 'vue'
// import localforage from 'localforage'

const Dashcore = require('@dashevo/dashcore-lib')
const Unit = Dashcore.Unit
const feeSatoshis = 1000

const timeFunction = async (promiseToTime) => {
  const timingStart = Date.now()

  const promiseResult = await promiseToTime

  const timing = (Date.now() - timingStart) / 1000

  console.log(promiseResult, ` finished in ${timing}:>> `)

  return promiseResult
}

console.log('process.env:>> ', process.env)

let client, clientInitFinished

const getInitState = () => {
  return {
    snackbar: { show: false, color: 'red', text: '', timestamp: 0, link: null },
    dppCache: {},
    dpns: {},
    userName: '',
    identityId: null,
    walletBalance: -1,
    redemptionTxs: {},
    L1: { UTXOS: {} },
  }
}
export const state = () => getInitState()

export const getters = {
  getLatestDocument: (state) => (docType) => {
    const dppCache = Object.entries(state.dppCache)

    const documents = []

    for (let idx = 0; idx < dppCache.length; idx++) {
      const element = { ...dppCache[idx][1] }
      if (element.$type === docType) {
        documents.push(element)
      }
    }

    const mostRecentDoc = documents.sort((a, b) =>
      a.$createdAt < b.$createdAt ? 1 : -1
    )

    return mostRecentDoc[0] ? mostRecentDoc[0].$createdAt : 0
  },
  pledgeUTXOExistsOnL1: (state) => (pledge) => {
    const pledgeFromAddressUTXOS =
      state.L1.UTXOS[pledge._pledgeFromAddress] || []
    const utxoExists = pledgeFromAddressUTXOS.filter((L1UTXO) => {
      if (
        L1UTXO.vout === pledge._tx.inputs[0].outputIndex &&
        L1UTXO.txid === pledge._tx.inputs[0].prevTxId &&
        L1UTXO.satoshis === pledge._satoshis &&
        L1UTXO.scriptPubKey === pledge._tx.inputs[0].output.script
      ) {
        return true
      }
    })

    return utxoExists.length > 0
  },
  getUserPledges(state, getters) {
    if (!state.identityId) return ''

    const dppCache = Object.entries(state.dppCache)

    console.log('dppCache', dppCache)
    const pledges = []

    for (let idx = 0; idx < dppCache.length; idx++) {
      const pledge = { ...dppCache[idx][1] }

      if (pledge.$type !== 'pledge') continue
      const itexists = getters.pledgeUTXOExistsOnL1(pledge)
      console.log('etters', itexists)
      if (
        pledge.$ownerId === state.identityId &&
        pledge.$type === 'pledge' &&
        pledge._isFullySigned &&
        getters.pledgeUTXOExistsOnL1(pledge)
      ) {
        pledges.push(pledge)
      }
    }

    return pledges
  },
  getMyUsername(state) {
    if (!state.identityId) return ''

    return state.dpns[state.identityId]
      ? state.dpns[state.identityId].label
      : '#' + state.identityId.substring(0, 5)
  },
  getMyWalletBalance(state) {
    return state.walletBalance
  },
  getUsernameByOwnerId: (state) => (ownerId) => {
    return state.dpns[ownerId]
      ? state.dpns[ownerId].label
      : '#' + ownerId.substring(0, 5)
  },
  getRedemptionTxId: (state) => (campaignId) => {
    return state.redemptionTxs[campaignId] || null
  },
  getIdentityId(state) {
    // TODO refactor to getMyIdentityId
    return state.identityId
  },
  getSumPledges: (state, getters) => (campaignId) => {
    if (!campaignId) return -1 // throw new Error('Not a valid campaignId') // TODO use regexp
    console.log(campaignId)
    console.log('state.dppCache[campaignId] :>> ', state.dppCache)
    const dppCache = Object.entries(state.dppCache)

    let sum = 0

    for (let idx = 0; idx < dppCache.length; idx++) {
      const element = dppCache[idx][1]

      if (
        element.$type === 'pledge' &&
        element.campaignId === campaignId &&
        element._isFullySigned &&
        getters.pledgeUTXOExistsOnL1(element)
      )
        sum += element._tx.inputs[0].output.satoshis
    }

    return sum
  },
  getDocumentById: (state) => (docId) => {
    if (!docId)
      // TODO replace check with regexp
      throw new Error(
        `getDocumentById: Cannot get a document with docId: ${docId}`
      )
    return state.dppCache[docId]
  },
  getCampaignPledges: (state, getters) => (campaignId) => {
    const dppCache = Object.entries(state.dppCache)

    const pledges = []

    for (let idx = 0; idx < dppCache.length; idx++) {
      const pledge = { ...dppCache[idx][1] }

      if (
        pledge.$type === 'pledge' &&
        pledge.campaignId === campaignId &&
        pledge._isFullySigned &&
        getters.pledgeUTXOExistsOnL1(pledge)
      ) {
        pledge.utxo = JSON.parse(Buffer.from(pledge.utxo, 'base64').toString()) // TODO remove deprecated

        pledges.push(pledge)
      }
    }
    console.log('pledges :>> ', pledges)
    return pledges.sort(function (a, b) {
      return a.$createdAt - b.$createdAt
    })
  },
  getCampaigns(state) {
    const dppCache = Object.entries(state.dppCache)

    const campaigns = []

    for (let idx = 0; idx < dppCache.length; idx++) {
      const campaign = { ...dppCache[idx][1] }

      if (campaign.$type === 'campaign') campaigns.push(campaign)
    }
    return campaigns.sort(function (a, b) {
      return b.$createdAt - a.$createdAt
    })
  },
}

export const mutations = {
  setL1UTXOS(state, { address, utxos }) {
    console.log('set state utxos :>> ', utxos)
    Vue.set(state.L1.UTXOS, address, utxos)
    console.log('state.L1.UTXOS :>> ', state.L1.UTXOS)
  },
  setMyUsername(state, userName) {
    state.userName = userName
  },
  setDpns(state, userDoc) {
    Vue.set(state.dpns, userDoc.$ownerId, userDoc)
  },
  setRedemptionTxId(state, { redeemTxId, campaignId }) {
    Vue.set(state.redemptionTxs, campaignId, redeemTxId)
  },
  setWalletBalance(state, balance) {
    state.walletBalance = balance
  },
  setIdentityId(state, identityId) {
    state.identityId = identityId
  },
  setSnackBar(state, { text, color = 'red', link = null }) {
    state.snackbar.text = text
    state.snackbar.color = color
    state.snackbar.link = link
    state.snackbar.show = true
    state.snackbar.timestamp = Date.now()
  },
  setDppCache(state, { typeLocator, documents }) {
    if (!documents) throw new Error('SetDppCache cannot set ' + documents)

    console.log('setting cache documents :>> ', documents)

    for (let i = 0; i < documents.length; i++) {
      const document = documents[i]

      console.log('document :>> ', document)

      Vue.set(state.dppCache, `${document.$id}`, document)
    }
  },
}

export const actions = {
  async getUnusedAddress({ dispatch }) {
    await dispatch('isAccountReady')
    return client.account.getUnusedAddress()
  },
  async revokePledge({ commit, dispatch }, pledge) {
    const specialFeatureKey = client.account.keyChain.HDPrivateKey.derive(
      "m/44'/1'/123'/1'/1" // TODO production LIVENET switch to 9/5
    )

    const privateKey = specialFeatureKey.privateKey.toString()

    console.log('privateKey :>> ', privateKey)

    const input = pledge._tx.inputs[0]

    const pledgeUtxo = {
      txId: input.prevTxId,
      outputIndex: input.outputIndex,
      address: pledge._pledgeFromAddress,
      script: input.output.script,
      satoshis: pledge._satoshis,
    }

    console.log('pledgeUtxo :>> ', pledgeUtxo)

    const myWalletAddress = client.account.getUnusedAddress()

    const tx = new Dashcore.Transaction()
      .from([pledgeUtxo])
      .to(myWalletAddress.address, pledgeUtxo.satoshis - 250) // TODO dynamic fee amount
      .sign([privateKey])

    console.log('tx :>> ', tx)

    const txId = await client.account.broadcastTransaction(tx)

    console.log('txId :>> ', txId)

    dispatch('fetchL1UTXOSByAddress', pledge._pledgeFromAddress)
  },
  async fetchL1UTXOSByAddress({ commit, dispatch }, address) {
    try {
      const pledgeFromAddressUTXOS = await this.$axios.get(
        `${process.env.INSIGHTAPI}/insight-api/addr/${address}/utxo`
      )
      commit('setL1UTXOS', { address, utxos: pledgeFromAddressUTXOS.data })
    } catch (e) {
      dispatch('showSnackbar', { text: e.message })
    }
  },
  async fetchUsernameByOwnerId({ commit, state }, ownerId) {
    if (state.dpns[ownerId]) return

    const [usernameDoc] = await client.platform.names.resolveByRecord(
      'dashUniqueIdentityId',
      ownerId
    )

    console.log('usernameDoc :>> ', ownerId, usernameDoc)

    if (usernameDoc) commit('setDpns', usernameDoc.toJSON())
  },
  refreshBalance({ commit, state }) {
    const balance =
      client && client.account
        ? Unit.fromSatoshis(client.account.getTotalBalance()).toBTC()
        : -1

    if (balance !== state.walletBalance) commit('setWalletBalance', balance)
  },
  showSnackbar({ commit }, snackbar) {
    commit('setSnackBar', snackbar)
  },
  async isClientReady() {
    // eslint-disable-next-line no-unmodified-loop-condition
    while (!clientInitFinished) {
      console.log('client not ready')
      await this.$sleep(250)
    }
    return true
  },
  async isAccountReady() {
    // eslint-disable-next-line no-unmodified-loop-condition
    while (!clientInitFinished) {
      console.log('client.account not ready')
      await this.$sleep(250)
    }

    while (!client.wallet) {
      console.log('client init without mnemonic, please log in')
      await this.$sleep(250)
    }

    client.account = await client.wallet.getAccount({ index: 0 })
  },
  async initWallet({ dispatch, commit }, { mnemonic }) {
    try {
      clientInitFinished = false

      commit('setIdentityId', null)
      commit('setMyUsername', '')
      commit('setWalletBalance', null)

      console.log('Initializing Dash.Client with mnemonic: ', mnemonic)

      let clientOpts = {
        passFakeAssetLockProofForTests: process.env.LOCALNODE,
        dapiAddresses: process.env.DAPIADDRESSES,
        wallet: typeof mnemonic !== 'undefined' ? { mnemonic } : undefined,
        apps: {
          dpns: process.env.DPNS,
          springboard: {
            contractId: process.env.SPRINGBOARD_CONTRACT_ID,
          },
        },
      }

      // Remove undefined keys
      clientOpts = JSON.parse(JSON.stringify(clientOpts))

      // if (clientOpts.wallet) clientOpts.wallet.adapter = localforage

      console.dir({ clientOpts }, { depth: 100 })

      if (client) timeFunction(client.disconnect())

      client = new Dash.Client(clientOpts)

      console.log('client.wallet :>> ', client.wallet)

      Object.entries(client.getApps().apps).forEach(([name, entry]) =>
        console.log(name, entry.contractId.toString())
      )

      if (client.wallet) {
        console.log('get account start')
        client.account = await timeFunction(
          client.wallet.getAccount({ debug: true })
        )
        console.log('getaccountend')

        console.log(
          'init Funding address',
          client.account.getUnusedAddress().address
        )
        console.log('init total Balance', client.account.getTotalBalance())

        // An account without identity can't submit documents, so let's create one
        if (!client.account.getIdentityIds().length) {
          const start = Date.now()
          const identity = await client.platform.identities.register()
          const timing = Math.floor(start - Date.now() / 1000)
          console.log(`identity registered in ${timing}:>> `, identity)
        }

        const identityId = client.account.getIdentityIds()[0].toString()

        commit('setIdentityId', identityId)

        dispatch('fetchUsernameByOwnerId', identityId)

        dispatch('showSnackbar', { text: 'Login successful!', color: 'cyan' })
      } else {
        console.log(
          'Initialized client without a wallet, you can fetch documents but not create documents, identities or names !!'
        )
      }
      clientInitFinished = true
    } catch (e) {
      dispatch('showSnackbar', { text: e.message, color: 'red' })
      console.error(e)
    }
  },
  async submitDocument({ dispatch, commit }, { typeLocator, doc }) {
    console.log(`submitDocument to ${typeLocator}`, doc)

    await dispatch('isAccountReady')

    const { platform } = client

    try {
      const identityId = client.account.getIdentityIds()[0]

      const getStart = Date.now()

      const identity = await platform.identities.get(identityId)

      console.log(
        'Get identity finished in: ',
        (Date.now() - getStart) / 1000,
        identity
      )

      const document = await platform.documents.create(
        typeLocator,
        identity,
        doc
      )

      console.log('created document :>> ', document)

      const documentBatch = {
        create: [document],
        replace: [],
        delete: [],
      }

      const result = await platform.documents.broadcast(documentBatch, identity)

      console.log(`submitDocument result: ${typeLocator} :>> `, result)

      const processedDocuments = await dispatch(
        'postProcessDocuments',
        result.transitions
      )

      commit('setDppCache', { typeLocator, documents: processedDocuments })

      return result
    } catch (e) {
      dispatch('showSnackbar', { text: e.message })
      console.error('Something went wrong:', e)
    }
  },
  async fetchDocumentById({ dispatch, commit }, { typeLocator, docId }) {
    const queryOpts = {
      limit: 1,
      startAt: 1,
      where: [['$id', '==', docId]],
    }

    console.log(
      `fetchDocumentById ${typeLocator}`,
      client.getApps().get(typeLocator.split('.')[0]).contractId.toString(),
      queryOpts
    )

    await dispatch('isClientReady')

    try {
      const [result] = await client.platform.documents.get(
        `${typeLocator}`,
        queryOpts
      )

      const document = result.toJSON()

      console.log(
        `fetched DocumentById ${typeLocator}`,
        { queryOpts },
        document
      )

      const processedDocuments = await dispatch('postProcessDocuments', [
        document,
      ])

      commit('setDppCache', { typeLocator, documents: processedDocuments })
      return document
    } catch (e) {
      console.error(
        'Something went wrong:',
        'fetchDocuments()',
        {
          typeLocator,
          queryOpts,
        },
        e
      )
      dispatch('showSnackbar', { text: e, color: 'red' })
    }
  },
  async fetchDocuments(
    { dispatch, getters, commit },
    {
      typeLocator,
      queryOpts = {
        limit: 1,
        startAt: 1,
        where: [
          [
            '$createdAt',
            '>',
            getters.getLatestDocument(typeLocator.split('.')[1]),
          ],
        ],
      },
    }
  ) {
    console.log(
      `fetchDocuments ${typeLocator}`,
      client.getApps().get(typeLocator.split('.')[0]).contractId.toString(),
      queryOpts
    )

    await dispatch('isClientReady')

    try {
      const result = await client.platform.documents.get(
        `${typeLocator}`,
        queryOpts
      )

      const documents = result.map((el) => el.toJSON())

      console.log(`fetched Documents ${typeLocator}`, { queryOpts }, documents)

      const processedDocuments = await dispatch(
        'postProcessDocuments',
        documents
      )

      commit('setDppCache', { typeLocator, documents: processedDocuments })

      return processedDocuments
    } catch (e) {
      console.error(
        'Something went wrong:',
        'fetchDocuments()',
        {
          typeLocator,
          queryOpts,
        },
        e
      )
      dispatch('showSnackbar', { text: e, color: 'red' })
    }
  },
  postProcessDocuments({ dispatch, commit }, documents) {
    if (documents[0] && documents[0].$type === 'redemptionTx') {
      documents.forEach((doc) => {
        commit('setRedemptionTxId', {
          campaignId: doc.campaignId,
          redeemTxId: doc.txId,
        })
      })
      return documents
    } else if (documents[0] && documents[0].$type === 'pledge') {
      const processedDocuments = documents.map((doc) => {
        doc._tx = JSON.parse(Buffer.from(doc.tx, 'hex'))

        const tx = new Dashcore.Transaction(doc._tx)

        doc._isFullySigned = tx.isFullySigned()

        doc._pledgeFromAddress = tx.inputs[0].script
          .toAddress(Dashcore.Networks.testnet)
          .toString() // TODO deploy switch ti livenet

        console.log('doc._pledgeFromAddress :>> ', doc._pledgeFromAddress)

        doc._satoshis = doc._tx.inputs[0].output.satoshis

        doc._dash = Unit.fromSatoshis(doc._satoshis).toBTC()

        dispatch('fetchL1UTXOSByAddress', doc._pledgeFromAddress)

        return doc
      })

      processedDocuments.forEach((doc) =>
        dispatch('fetchUsernameByOwnerId', doc.$ownerId)
      )

      return processedDocuments
    } else if (documents[0] && documents[0].$type === 'campaign') {
      documents.forEach((campaign) => {
        dispatch('fetchUsernameByOwnerId', campaign.$ownerId)

        dispatch('fetchDocuments', {
          typeLocator: 'springboard.pledge',
          queryOpts: {
            where: [['campaignId', '==', campaign.$id]],
            orderBy: [['$createdAt', 'desc']],
          },
        })

        dispatch('fetchDocuments', {
          typeLocator: 'springboard.redemptionTx',
          queryOpts: { where: [['campaignId', '==', campaign.$id]] },
        })
      })

      return documents
    } else return documents
  },
  async createPledgeUtxo(
    { state, dispatch, commit },
    { campaignSatoshis, pledgeSatoshis, campaignRecipient }
  ) {
    await dispatch('isAccountReady')

    const specialFeatureKey = client.account.keyChain.HDPrivateKey.derive(
      "m/44'/1'/123'/1'/1" // TODO production LIVENET switch to 9/5
    )

    const privateKey = specialFeatureKey.privateKey.toString()

    const pledgeFromAddress = specialFeatureKey.publicKey.toAddress().toString()

    console.log(
      'createPledgeUtxo transaction, pledgeFromAddress',
      pledgeFromAddress
    )

    const transaction = client.account.createTransaction({
      deductFee: false,
      recipients: [
        {
          recipient: pledgeFromAddress,
          satoshis: parseInt(pledgeSatoshis),
        },
      ],
    })

    console.log('Broadcasting pledgeUtxo tx:')
    const transactionId = await client.account.broadcastTransaction(transaction)

    const pledgeUtxo = {
      txId: transactionId,
      outputIndex: 0,
      address: pledgeFromAddress,
      script: transaction.outputs[0]._script,
      satoshis: transaction.outputs[0]._satoshis,
    }

    console.log('pledgeUtxo :>> ', pledgeUtxo)
    console.log(
      'Pledge UTXO transaction successfully broadcast:',
      '\nWallet:',
      client.wallet.exportWallet(),
      '\ntxId:',
      transactionId,
      '\nfromAddress:',
      pledgeFromAddress
    )

    // const privateKey = client.account.getPrivateKeys([
    //   pledgeFromAddress.address,
    // ])[0].privateKey

    const tx = new Dashcore.Transaction()
      .from([pledgeUtxo])
      .to(campaignRecipient, parseInt(campaignSatoshis) - feeSatoshis)
      .sign([privateKey], 0x81)

    console.log(
      'tx :>> ',
      tx,
      Buffer.from(JSON.stringify(tx.toJSON())).toString('hex')
    )

    console.log('Created and signed input :>> ', tx.inputs[0])
    console.log(
      'JSON.stringify(tx.inputs[0]) :>> ',
      JSON.stringify(tx.inputs[0])
    )
    return [
      Buffer.from(JSON.stringify(tx.inputs[0].toJSON())).toString('base64'),
      Buffer.from(JSON.stringify(tx.toJSON())).toString('hex'),
    ]
  },
  async fetchRedemptionState({ commit, getters }, { campaignId }) {
    const tx = await client
      .getDAPIClient()
      .core.getTransaction(
        '3e38095dbea9c628cede35577281d7e14c393781a1ae2b0cb1b6de47102e54cd'
      )
    console.log('tx :>> ', tx)
    const newTx = new Dashcore.Transaction()
    newTx.fromString(tx.toString('hex'))
    // debugger
  },
  async redeemTx({ commit, getters, dispatch }, { campaignId }) {
    const pledges = getters.getCampaignPledges(campaignId)

    console.log('pledges :>> ', pledges)

    const txs = pledges.map((el) => new Dashcore.Transaction(el._tx))

    const redeemTx = txs[0]

    for (let idx = 1; idx < txs.length; idx++) {
      redeemTx.addInput(txs[idx].inputs[0])
    }

    console.log('redeemTx :>> ', redeemTx)

    const redeemTxId = await client.account.broadcastTransaction(redeemTx)

    const redemptionDocResult = await dispatch('submitDocument', {
      typeLocator: 'springboard.redemptionTx',
      doc: { campaignId, txId: redeemTxId },
    })

    console.log('redemptionDocResult :>> ', redemptionDocResult)

    console.log('txBroadcast :>> ', redeemTxId)
    commit('setRedemptionTxId', { campaignId, redeemTxId })
    return redeemTxId
  },
}
