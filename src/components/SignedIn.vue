<template>
  <div>
    <p style="font-size: 24px">Welcome Pokemon Trainer <strong>{{ accountId }}</strong>
      <br>
      Balance: <small>{{ balance }}N</small>
    </p>
    <button @click="transaction()">Dummy NFT</button>
    <hr>

    <h1>My Pokemons</h1>
    <ul style="display: flex; list-style: none; justify-content: space-between; align-items: center">
      <li :key=idx v-for="(nft, idx) in nfts"
          style="display: flex; align-items:center; justify-content: center; flex-direction:column; margin: 1em; border: 1px solid #333; padding: 1em; width: 200px; height: 270px;">
        <img :src="nft.token.image" width="50" alt="">
        <h3>{{ nft.token.name }}</h3>
        <Sale :tokenId="nft.id"></Sale>
        <button @click="showTransferModal(nft.token, nft.id)"
                style="padding: .3em 1em; font-size: 14px; background: #ff9900; font-family: sans-serif; border:none; border-radius: 6px; color: white">
          Transfer
        </button>
        <button @click="putOnSale(nft.id)">Put On Sale</button>
      </li>
    </ul>
    <Transfer @close="closeTransferModal()" v-if="showTransferModal$" :token="tokenToTransfer"
              :token-id="toTransferTokenId"/>
    <br>
    <hr>
    <div>
      <h1> Sales </h1>
      <ul style="display: flex; list-style: none; justify-content: space-between; align-items: center">
        <li :key=idx v-for="(nft, idx) in sales"
            style="display: flex; align-items:center; justify-content: center; flex-direction:column; margin: 1em; border: 1px solid #333; padding: 1em; width: 200px; height: 270px;">
          <img :src="nft.token.image" width="50" alt="">
          <h3>{{ nft.token.name }}</h3>
          <Sale @loaded="updatePrice($event, nft)" :tokenId="nft.id"></Sale>
          <button @click="buyNFT(nft, nft.id)"
                  v-if="!isOwned(nft.id)"
                  style="padding: .3em 1em; font-size: 14px; background: #ff9900; font-family: sans-serif; border:none; border-radius: 6px; color: white">
            Buy
          </button>
          <p v-else>You are the owner</p>
        </li>
      </ul>

    </div>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import {logout} from "../utils"
import {utils} from 'near-api-js'
import Transfer from "@/components/Transfer";
import Sale from "@/components/Sale";

export default {
  name: "SignedIn",

  mounted() {
    if (this.isSignedIn) {
      window.contract.get_tokens({accountId: window.accountId}).then(response => {
        this.nfts = response
        console.log('get_tokens')
        console.log(response)
      }).catch(error => {
        if (error.message.indexOf('NO BALANCE') > -1) {
          console.log('Balance is empty.')
        }
      })
      window.contract.get_sales({account_id: "seadox3.testnet"}).then(response => {
        this.sales = response
        console.log('get_tokens')
        console.log(response)
      }).catch(error => {
        console.log(error)
      })
      window.contract.account.getAccountBalance().then(response => {
        const parsed = utils.format.formatNearAmount(response.total, 2)
        this.balance = parsed
      }).catch(error => {
        console.log(error)
      })
    }
  },

  components: {Sale, Transfer},

  data: function () {
    return {
      notificationVisible: false,
      nfts: [],
      name: "",
      description: "",
      image: "",
      transferOwner: "",
      amount: 1,
      showTransferModal$: false,
      toTransferTokenId: null,
      tokenToTransfer: null,
      sales: [],
      balance: null
    }
  },

  computed: {
    isSignedIn() {
      return window.walletConnection ? window.walletConnection.isSignedIn() : false
    },
    accountId() {
      return window.accountId
    },
    contractId() {
      return window.contract ? window.contract.contractId : null
    },
    networkId() {
      return window.networkId
    }
  },

  methods: {
    updatePrice(e, n) {
      n.price = e
    },
    async buyNFT(nft) {
      if (nft.price) {
        const transferAmount = await utils.format.parseNearAmount(nft.price.toString())
        window.contract.buy({token_id: nft.id}, 300000000000000,
            transferAmount)
            .then(res => console.log(res))
            .catch(err => console.log(err))
      }
    },
    isOwned(id) {
      return this.nfts.findIndex(t => t.id === id) > -1
    },
    showTransferModal(token, idx) {
      this.showTransferModal$ = true
      this.tokenToTransfer = token
      this.toTransferTokenId = idx
    },
    closeTransferModal() {
      this.tokenToTransfer = null
      this.toTransferTokenId = null
      this.showTransferModal$ = false
    },
    createNFT(e) {
      e.preventDefault()
      const name = this.name
      const description = this.description
      const image = this.image
      const amount = parseInt(this.amount)

      return
      if (amount === 1) {
        window.contract.mint_token({name, description, image}, 100000000000000)
            .then(res => console.log(res))
            .catch(err => console.log(err))
      } else {
        window.contract.batch_mint({name, description, image, amount}, 100000000000000)
            .then(res => console.log(res))
            .catch(err => console.log(err))
      }
    },
    async transaction() {
      const charmeleon = {
        name: "Charmeleon",
        description: "It will be the strongest pokemon, if it wants to evolve of course!",
        image: "https://upload.wikimedia.org/wikipedia/tr/3/35/Charmeleon_Artwork.png"
      }
      const charmander = {
        name: "Charmander",
        description: "It will be the strongest pokemon!",
        image: "https://w7.pngwing.com/pngs/9/929/png-transparent-pokemon-charmander-pikachu-pokemon-x-and-y-charmander-charizard-charmander-food-orange-vertebrate.png"
      }

      const charizard = {
        name: "Charizard",
        description: "My strongest pokemon! He can beat Mew2 on 1v1, trust me. Bets on Charizard!",
        image: "https://img.pokemondb.net/artwork/large/charizard.jpg",
      }
      const amount = 5
      const transferAmount = await utils.format.parseNearAmount("2")
      console.log(transferAmount)
      window.contract
          .mint_payment(charizard,
              300000000000000,
              transferAmount
          )
          .then(res => console.log(res))
          .catch(err => console.log(err))
    },
    putOnSale(id) {
      let price = utils.format.parseNearAmount("100")
      window.contract.put_token_to_sale({token_id: id, price: price})
          .then(res => console.log(res))
          .catch(err => console.log(err))
    },
    logout: logout,
  },
}
</script>

<style>
body {
  overflow-x: hidden;
}

.w-100 {
  width: 100%
}

.nftList {
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1em;
  flex-wrap: wrap;
}

.nftList li {
  flex-basis: 30%;
  width: 30%
}

.nftList li h4 {
  max-width: 90%;
  text-overflow: ellipsis;
  overflow: hidden
}

.nftList li p {
  font-size: 12px;
  width: 90%;
  text-overflow: ellipsis;
}

button[disabled] {
  background: #333
}
</style>
