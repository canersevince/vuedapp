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
              transition duration-200 transform hover:scale-105 text-xs">
            CANCEL SALE | <span class="text-md font-bold lowercase">current price: {{ price }} <span
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
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import {constants} from "@/helpers/constants";
import {utils} from 'near-api-js'
import Swal from 'sweetalert2'

export default {
  name: "token_detail",
  data: () => ({
    token: null,
    owner: null,
    collection: null,
    price: null,
    id: null,
    base_url: constants.img_base_url
  }),
  methods: {
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
        title: `Are you want to cancel this sale?`,
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
    buy() {
      if (!this.id) return;
      const formatted = utils.format.parseNearAmount(this.price.toString())
      Swal.fire({
        title: `Are you want to buy this NFT for ${this.price}Ⓝ`,
        description: "It might take couple minutes before it shows up in your wallet.",
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
