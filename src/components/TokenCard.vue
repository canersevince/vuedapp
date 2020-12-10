<template>
  <div v-if="tokenObj" class="overflow-hidden shadow-md p-1">
    <router-link :to="`/tokens/${id}`">
      <img :alt="tokenObj.name" class="token_preview block object-contain object-center mx-auto"
           :src="base_src+token.image_url">
    </router-link>

    <header class="flex flex-col items-start justify-between leading-tight p-1 md:p-2">
      <h1 class="text-lg mt-3">
        <router-link :to="`/tokens/${id}`" tag="a" class="no-underline hover:underline text-gray-600 text-md font-bold">
          {{ tokenObj.name && tokenObj.name.length > 20 ? tokenObj.name.substring(0, 20) + ' ...' : tokenObj.name }}
        </router-link>
      </h1>
      <router-link tag="a" :to="'/collection/'+tokenObj.collection_id"
                   v-if="collection && collection.length>0"
                   class="hover:text-red-700 text-xs font-bold"
                   style="min-height: 16px">
        {{ collection.name }}
      </router-link>
      <div v-else style="min-height:16px"/>
      <div class="w-full flex justify-between items-center" style="min-height:32px">
        <p class="text-xs my-1" style="min-height:32px">
          {{
            tokenObj.description.length > 35 ? tokenObj.description.substring(0, 35) + '...' : tokenObj.description
          }}</p>
        <p class="text-grey-darker text-xs ml-auto" style="min-height:32px">
          14/4/20
        </p>
      </div>
    </header>
    <footer class="flex items-center justify-between leading-none p-1 md:p-2">
      <router-link v-if="!is_collection_page" tag="a" :to="`/profile/${tokenObj.creator}`"
                   class="flex items-center no-underline hover:underline text-black">
        <img width="32" alt="Placeholder" class="block rounded-full"
             :src="user_picture && user_picture.length> 0 ? user_picture : 'https://picsum.photos/32/32/?random'">
        <p class="ml-2 text-sm">
          {{ tokenObj.creator }}
        </p>
      </router-link>
      <router-link v-if="!is_collection_page" tag="a" :to="`/token/${id}`"
                   class="no-underline flex block ml-6 items-center ml-auto justify-between text-grey-darker hover:text-red-dark">
        <span v-if="fetch_price && fetchedPrice" class="flex text-sm">
          {{
            fetchedPrice
          }} <strong>Ⓝ</strong></span>
        <span class="text-xs w-full ml-auto" v-if="!price && !is_owner"></span>
      </router-link>
    </footer>

  </div>
</template>
<script>

import {utils} from "near-api-js";
import axios from "axios";
import {constants} from "@/helpers/constants";
import Swal from 'sweetalert2'

export default {
  name: "TokenCard",
  props: {
    token: Object,
    id: Number,
    is_owner: Boolean,
    price: String || null,
    fetch_price: Boolean,
    is_collection_page: Boolean
  },
  data() {
    return {
      collection: null,
      tokenObj: null,
      fetchedPrice: null,
      user_picture: null,
      owner: null,
      base_src: constants.img_base_url
    }
  },
  methods: {
    async fetch_price$() {
      if (this.is_collection_page) return;
      this.$nextTick(() => {
        setTimeout(async () => {
          try {
            /* const response = await window.contract.get_price({token_id: this.id}) */
            const {data: Price} = await axios.get(`${constants.rpc_api}/tokens/get_price/${this.id}`)
            if (Price && Price.indexOf('Error') < 0) {
              this.fetchedPrice = utils.format.formatNearAmount(Price)
            }
          } catch (e) {
            console.log({error: e})
          }
        }, 10)
      })
    }
  },
  async beforeMount() {
    this.tokenObj = JSON.parse(JSON.stringify(this.token))
    if (this.token.collection_id) {
      /* this.collection = window.contract.get_collection_by_id({collection_id: this.token.collection_id})
          .then((response) => this.collection = response).catch((error) => {
            console.log('cannot find collection')
          })
      */
      const {data: Collection} = await axios.get(`${constants.rpc_api}/collections/get_collection_by_id/${this.token.collection_id}`)
      if (typeof Collection !== 'string') {
        this.collection = Collection
      }
      if (this.fetch_price) {
        this.fetch_price$()
      }
    }
    try {
      /* this.user_picture = await window.contract.get_user_profile_picture({accountId: this.tokenObj.creator}) */
      const {data: Picture} = await axios.get(`${constants.rpc_api}/accounts/get_user_profile_picture/${this.tokenObj.creator}`)
      if (Picture && Picture.indexOf('Error') < 0) {
        this.user_picture = Picture
      }
    } catch (e) {
      console.log(e)
    }
  }
}
</script>

<style scoped>
.token_preview {
  width: 268px;
  height: 268px
}
</style>
