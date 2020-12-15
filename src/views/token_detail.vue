<template>
  <div v-if="token" class="container mx-auto max-w-full">
    <div class="relative container md:mx-auto py-2 max-w-full"
    >
      <h1
          class="z-100 font-major lowercase text-white my-4 items-center justify-center text-3xl font-bold leading-tight text-center">
        {{ token.name }} </h1>
      <p v-if="collection" class="z-100 text-center text-xs text-gray-100">from collection
        <router-link
            :to="'/collection/'+token.collection_id"
            class="cursor-pointer text-sm font-bold text-white">
          {{ collection.name }}
        </router-link>
      </p>
      <p class="z-100 text-center text-xs text-gray-100">minted by
        <router-link
            :to="'/profile/'+token.creator"
            class="cursor-pointer text-sm font-bold text-white">
          {{ token.creator }}
        </router-link>
      </p>
      <p v-if="owner" class="z-100 text-center text-xs text-gray-100">current owner
        <router-link
            :to="'/profile/'+owner"
            class="cursor-pointer text-sm font-bold text-white">
          {{ owner }}
        </router-link>
      </p>
      <div class="absolute bg-cover bg-center w-full h-full top-0 left-0"
           style="z-index : -1;" :style="{backgroundImage : `url(${token.image_url})`}">
      </div>
      <div style="z-index : -1;"
           class="overlay bg-black opacity-90 top-0 left-0 pointer-events-none z-10 absolute w-full h-full"></div>
    </div>

    <div class="container mx-auto">
      <div class="grid grid-cols-12 py-12 gap-3">
        <div class="col-span-12 md:col-span-7 gap-1 px-5 md:px-2">
          <div class="w-full mx-auto border-2 shadow-lg p-1"
               v-if="token"
               :style="{borderColor: token.background_color && token.background_color.length>0 && token.background_color !== '#ffffff' ? token.background_color : 'transparent'}">
            <img @dragstart="e => e.preventDefault()" @contextmenu="(e) => e.preventDefault()"
                 class="mx-auto object-contain w-full" :src="base_url + token.image_url" alt="">
          </div>
        </div>
        <div
            class="col-span-12 text-gray-700 md:col-span-5 gap-1 px-5 md:px-5 pt-8 md:pt-0
            flex flex-col items-start justify-start">
          <h1 class="text-2xl font-bold">{{
              token.name
            }}</h1>
          <div class="py-3">
            <p class="text-gray-700 text-md">{{ token.description }}</p>
          </div>
          <p class="text-sm" v-if="token.external_link.length>0">external:
            <a class="text-custom-red"
               :href="token.external_link">{{
                token.external_link
              }}</a>
          </p>

          <button
              @click="buy"
              v-if="price && owner !== accountId"
              class="mt-4 font-major lowercase px-4 py-2 custom-red text-gray-100
              hover:text-white buy-button shadow-md hover:shadow-xl
              transition duration-200 transform hover:scale-105">
            BUY FOR {{ price }} <span class="text-xl font-bold uppercase">Ⓝ</span>
          </button>
          <button
              @click="removeFromSale"
              v-if="owner === accountId && price"
              class="mt-4 font-major lowercase px-4 py-2 bg-black text-gray-100
              hover:text-white buy-button shadow-md hover:shadow-xl
              transition duration-200 transform hover:scale-105 text-sm">
            CANCEL SALE <br> <span class="text-xs font-bold lowercase">current price: {{ price }} <span
              class="uppercase">Ⓝ</span></span>
          </button>
          <button
              @click="sell"
              v-if="owner === accountId && !price"
              class="mt-4 font-major lowercase px-4 py-2 bg-black text-gray-100
              hover:text-white buy-button shadow-md hover:shadow-xl
              transition duration-200 transform hover:scale-105 text-xs">
            SELL
          </button>
          <button
              @click="transfer"
              v-if="owner === accountId && !price"
              class="mt-4 font-major lowercase px-4 py-2 bg-black text-gray-100
              hover:text-white buy-button shadow-md hover:shadow-xl
              transition duration-200 transform hover:scale-105 text-xs">
            Transfer
          </button>
          <button
              @click="bid"
              v-if="owner !== accountId && accountId"
              class="mt-4 font-major lowercase px-4 py-2 bg-green-500 text-gray-100
              hover:text-white buy-button shadow-md hover:shadow-xl
              transition duration-200 transform hover:scale-105 text-xs">
            Offer
          </button>
          <div v-if="bids.length>0">
            <h1 class="text-md font-major lowercase mt-5 font-extrabold">Offers</h1>
            <ul class="mx-0 px-0">
              <li :key="i" v-for="(bid, i) in bids" class="mt-1 text-sm border px-1 text-gray-900 rounded-xs py-1">
                <a class="cursor-pointer">
                  {{
                    `${bid.bidder} offered ${formatter(bid.amount)}Ⓝ - ${getDate(bid)}`
                  }}
                  <span v-if="owner == accountId" @click="acceptBid(bid, i)" class="text-xs text-green-500">
                    ACCEPT OFFER
                    <i class="fa fa-check"></i>
                  </span>
                  <span v-if="accountId == bid.bidder" @click="removeBid(bid, i)" class="text-xs text-custom-red">
                    REMOVE OFFER
                    <i class="fa fa-times"></i>
                  </span>
                </a>
              </li>
            </ul>
          </div>
          <div v-else>
            <h1 class="text-md font-major lowercase mt-5 font-extrabold">Offers</h1>
            <p class="font-major lowercase text-xs mt-1 px-2 py-1 bg-gray-500 text-white">
              There are no offers yet. Be the first one!
            </p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import {constants} from "@/helpers/constants";
import {utils, providers} from 'near-api-js'
import Swal from 'sweetalert2'

export default {
  name: "token_detail",
  data: () => ({
    token: null,
    owner: null,
    collection: null,
    price: null,
    id: null,
    base_url: constants.img_base_url,
    bids: []
  }),
  methods: {
    redirectAlert() {
      Swal.fire({
        title: `Redirecting to wallet`,
        text: "You need to sign this transaction.",
        icon: "warning",
      })
    },
    getDate(bid) {
      console.log({bid})
      const date = new Date(parseInt(bid.date) / 1000000)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    },
    formatter(val) {
      return utils.format.formatNearAmount(val)
    },
    acceptBid(bid, idx) {
      Swal.fire({
        title: "Are you sure you want to accept this bid?",
        html: `Bidder: ${bid.bidder}, Amount: ${utils.format.formatNearAmount(bid.amount)}NEAR`,
        icon: "question",
        confirmButtonText: "ACCEPT",
        showCancelButton: true,
        cancelButtonText: "CANCEL"
      }).then(res => {
        if (res.isConfirmed) {
          this.$store.dispatch('loader', true)
          window.contract.accept_bid({token_id: parseInt(this.id), bid_index: parseInt(idx)}).then(res => {
            this.$store.dispatch('loader', false)
            Swal.fire({
              title: `Bid accepted! Tokens successfully transferred.`,
              html: "It might take couple minutes before it shows up on token page.",
              icon: "success",
              confirmButtonText: "WOAH",
            })
            setTimeout(() => {
              location.reload();
            }, 250)
          }).catch(err => {
            console.log(err)
            this.redirectAlert()
          })
        }
      })
    },
    removeBid(bid, idx) {
      Swal.fire({
        title: "Are you sure you want to remove this bid?",
        html: `Bid Amount: ${utils.format.formatNearAmount(bid.amount)}NEAR`,
        icon: "question",
        confirmButtonText: "REMOVE BID",
        showCancelButton: true,
        cancelButtonText: "CANCEL"
      }).then(res => {
        if (res.isConfirmed) {
          window.contract.remove_bid({token_id: parseInt(this.id), bid_index: parseInt(idx)}).then(res => {
            this.bids.splice(idx, 1)
          }).catch(err => {
            console.log(err)
            this.redirectAlert()
          })
        }
      })
    },
    bid() {
      Swal.fire({
        title: `Enter the Ⓝ amount to bid`,
        html: "It might take couple minutes before it shows up on token page",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Bid!",
        input: "text"
      }).then(res => {
            if (res.value) {

              // check if bid lower than before or users bid exists

              const formatted = utils.format.parseNearAmount(res.value.toString())

              for (let i = 0; i < this.bids.length; i++) {
                if (this.bids[i].bidder === this.accountId) {
                  if (parseInt(res.value) < utils.format.formatNearAmount(this.bids[i].amount)) {
                    Swal.fire({
                      title: "You already have a higher bid than this."
                    })
                    return
                  }
                }
              }
              window.contract.bid({token_id: parseInt(this.id)}, constants.gas, formatted).then(res => {
                console.log({res})
              }).catch(err => {
                this.redirectAlert()
                console.log(err)
              })
            }
          }
      )
    },
    async isAvailable() {
      const isAvailable = await window.contract.get_price({token_id: JSON.parse(this.id)});
      if (!isAvailable) {
        Swal.fire({
          title: "Oops...",
          html: `Looks like this token not available for sale anymore.`,
          icon: "error"
        })
        return false
      }
      return true
    },
    sell() {
      Swal.fire({
        title: "Please enter a price",
        text: "min: 1 NEAR",
        input: "number",
        icon: "question"
      }).then(async response => {
        const parsed = JSON.parse(response.value)
        if (parsed > 1) {
          this.$store.dispatch('loader', true)
          await window.contract.put_token_to_sale({
            token_id: parseInt(this.id),
            price: utils.format.parseNearAmount(parsed.toString())
          }).then(result => {
            Swal.fire({
              title: `Success!`,
              text: "It might take couple minutes before changes shows up. Please wait.",
              icon: "success",
            })
            this.$store.dispatch('loader', false)
          }).catch(error => {
            console.log(error)
            Swal.fire({
              title: `Error!`,
              text: "There was an error while interacting with contract. Please try again or re login..",
              icon: "warning",
            })
            this.$store.dispatch('loader', false)
          })
        } else {
          Swal.fire({
            title: "Price cannot be less than 1Ⓝ",
            icon: "error"
          })
        }
      })
    },
    removeFromSale() {
      Swal.fire({
        title: `Do you want to cancel this sale?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
      }).then(res => {
        if (res.value) {
          window.contract.cancel_sale({token_id: parseInt(this.id)}).then(response => {
            Swal.fire({
              title: `Success!`,
              text: "It might take couple minutes before changes show up. Please wait.",
              icon: "success",
            })
          }).catch(error => {
            Swal.fire({
              title: `Error!`,
              text: "There was an error while interacting with contract. Please try again or re login..",
              icon: "warning",
            })
          })
        }
      })
    },
    async buy() {
      if (!this.id) return;
      if (await this.isAvailable() === false) {
        return
      }
      const formatted = utils.format.parseNearAmount(this.price.toString())
      Swal.fire({
        title: `Are you want to buy this NFT for ${this.price}Ⓝ`,
        html: "It might take couple minutes before it shows up in your wallet.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "BUY!"
      }).then(res => {
        if (res.value) {
          window.contract.buy({token_id: parseInt(this.id)}, constants.gas, formatted)
        }
      }).catch(err => {
        Swal.fire({
          title: `Error!`,
          text: "There was an error while interacting with contract. Please try again or re login..",
          icon: "warning",
        })
      })
    },
    async transfer() {
      if (await this.isAvailable() === true) {
        Swal.fire({
          title: "Oops...",
          html: `Looks like this token is on sale at the moment.`,
          icon: "error"
        })
        return
      }
      Swal.fire({
        title: "Transfer Token",
        html: "Enter the account name you want to transfer this token.",
        icon: "question",
        input: "text"
      }).then(res => {
        console.log(res.value)
        if (res.value) {
          Swal.fire({
            title: "Confirm",
            html: `Token will be transfered to: ${res.value}  -Do you confirm?`,
            icon: "question",
            cancelButtonText: "NO",
            confirmButtonText: "YES",
            showCancelButton: true
          }).then(response => {
            console.log({response})
            if (response.isConfirmed) {
              window.contract.transfer({new_owner_id: res.value, token_id: JSON.parse(this.id)}).then(response => {
                console.log(response)
                if (response) {
                  Swal.fire({
                    title: "Success!",
                    html: `Token succesfully transfered to: ${res.value}! It might take couple minutes before it shows up`,
                    icon: "success",
                    confirmButtonText: "NICE!",
                  })
                }
              }).catch(err => {
                console.log(err)
              })
            }
          })
        }
      })
    }
  },
  computed: {
    accountId() {
      return window.accountId
    }
  },
  async beforeMount() {
    this.$store.dispatch('loader', true)
    const id = this.$route.params.id
    this.id = id
    if (!id) return;
    const {data: token} = await axios.get(`${constants.rpc_api}/tokens/token_details/${id}`)
    if (typeof token !== 'string') {
      this.token = token
    } else {
      this.$router.push('/404')
      this.$store.dispatch('loader', false)
    }
    window.contract.get_bids({token_id: parseInt(this.id)})
        .then(res => {
          if (typeof res !== "string") {
            this.bids = res
          }
        }).catch(err => {
      console.log(err)
    })

    const {data: owner} = await axios.get(`${constants.rpc_api}/tokens/get_token_owner/${id}`)
    if (typeof owner == 'string' && owner.indexOf('Error') < 0) {
      this.owner = owner
    }


    if (token.collection_id > 0 && token.collection_id.toString().length > 0) {
      const {data: collection} = await axios.get(`${constants.rpc_api}/collections/get_collection_by_id/${token.collection_id}`)
      if (typeof collection !== 'string') {
        this.collection = collection
      }
    }

    const {data: Price} = await axios.get(`${constants.rpc_api}/tokens/get_price/${this.id}`)
    if (Price && Price && Price.toString().indexOf('Error') < 0) {
      this.price = utils.format.formatNearAmount(Price.toString())
      console.log(this.price)
    }

    this.$store.dispatch('loader', false)
  }
}
</script>

<style scoped>
.buy-button:hover {
  background: #333 !important
}
</style>
