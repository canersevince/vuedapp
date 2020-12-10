<template>
  <div class="container mx-auto max-w-full">
    <div class="bg-gray-100 container md:mx-auto py-8 max-w-full">
      <h1 class="font-major lowercase my-4 text-gray-700 items-center justify-center text-5xl font-bold leading-tight text-center">
        MY COLLECTION </h1>
      <p class="text-md text-gray-400 text-center" v-if="total_owned">
        {{ total_owned && total_owned > 1 ? `You own ${total_owned} tokens` : `You own ${total_owned} token` }}</p>
    </div>
    <Loader v-if="!is_loaded"/>
    <div class="flex relative items-center justify-center">
      <button class="transform transition hover:scale-105 hover:shadow-lg
      duration-200 self-center font-major lowercase text-white py-3 shadow-md my-3 md:my-6 px-3 custom-red"
              @click="fetchUserTokens">
        REFRESH
        COLLECTION
      </button>
      <button v-if="false" @click="changeOrder" class="transform transition hover:scale-105 hover:shadow-lg
      duration-200 absolute right-10 m-auto self-center font-major lowercase
      text-white py-3 shadow-md my-3 md:my-6 px-3 custom-red">
        {{ !newest ? 'Newest First' : 'Oldest First' }}
      </button>
    </div>
    <div class="container mx-auto">
      <div class="grid grid-cols-12 gap-2 pb-12 pt-0 px-2 md:px-8">
        <div v-for="tokenObject in myTokens.slice(this.start, this.end)" :key="tokenObject.id"
             class="col-span-12 lg:col-span-4 mt-1 px-5 md:px-1 py-5 md:py-1">
          <TokenCard :fetch_price="true" :is_owner="true" :id="tokenObject.id" :token="tokenObject.token"/>
        </div>
      </div>
    </div>
    <div class="container mx-auto px-2 py-8" v-if="myTokens.length === 0 && is_loaded">
      <div class="text-center w-full flex items-center justify-center">
        <p class="text-red-600 text-xl font-bold w-full">
          <span v-if="error">Error while fetching blockchain.</span>
          <span v-else>Looks like your
          collection is
          empty 😔 <br></span>
          <router-link v-if="!error" tag="a" to="/browse" class="underline uppercase block mt-2">Start Collecting!
          </router-link>
        </p>
      </div>
    </div>
    <div class="container mx-auto max-w-full flex items-center justify-center pb-8">
      <nav class="relative z-0 inline-flex shadow-sm -space-x-px" aria-label="Pagination">
        <a href="#"
           v-if="currentPage>1 && pages.length>1"
           @click.prevent="currentPage--"
           style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;  "
           class="relative inline-flex items-center px-2 py-2 border rounded-full border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
          <span class="sr-only">Previous</span>
          <i class="fa fa-chevron-left text-md p-1"></i>
        </a>
        <a href="#"
           v-if="currentPage>3"
           @click.prevent="currentPage = 1"
           style="width: 40px; height: 40px; margin-left: 3px; display: flex; align-items: center; justify-content: center;  "
           class="relative inline-flex items-center px-2 py-2 border rounded-full border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
          <span class="sr-only">Previous</span>
          <span>...</span>
        </a>
        <a @click.prevent="currentPage = idx+1" :class="idx+1 == currentPage ? 'border-red-500 border-2' : 'border-0'"
           v-show="idx < currentPage+2 && idx > currentPage-3"
           :key="idx+1" v-for="(i, idx) in pages" href="#"
           style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin: 0 3px"
           class="relative inline-flex items-center px-4 py-2 border rounded-full  border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
          {{ idx + 1 }}
        </a>
        <a href="#"
           v-if="currentPage>3 && currentPage !== pages.length"
           @click.prevent="currentPage=pages.length"
           style="width: 40px; height: 40px; display: flex; margin-right: 3px; align-items: center; justify-content: center;  "
           class="relative inline-flex items-center px-2 py-2 border rounded-full border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
          <span class="sr-only">Last</span>
          <span>...</span>
        </a>
        <a
            v-if="pages.length>1 && currentPage !== pages.length"
            @click.prevent="currentPage++"
            style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;  "
            class="relative inline-flex items-center border rounded-full border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
          <span class="sr-only">Next</span>

          <i class="fa fa-chevron-right text-md p-1"></i>
        </a>
      </nav>
    </div>

  </div>
</template>

<script>
import TokenCard from "@/components/TokenCard";
import Loader from "@/components/Loader";
import {utils} from "near-api-js";
import axios from "axios";
import {constants} from "@/helpers/constants";

export default {
  name: "collection",
  components: {TokenCard, Loader},
  data() {
    return {
      currentPage: 1,
      newest: true,
      start: 0,
      end: 6,
      myTokens: [],
      is_loaded: false,
      error: false,
      perPage: 6,
      total_owned: null
    }
  },
  watch: {
    currentPage(val) {
      this.$nextTick(() => {
        this.fetchUserTokens()
      })
    }
  },
  computed: {
    pages() {
      if (this.total_owned > 0) {
        return new Array(Math.ceil(this.total_owned / this.perPage))
      }
      return new Array(1)
    }
  },
  methods: {
    changeOrder() {
      this.newest = !this.newest
    },
    async fetchUserTokens() {
      this.$store.dispatch('loader', true)
      /*t ry {
         const myTokens = await window.contract.get_tokens({accountId: window.accountId}) */
      /* const {data: myTokens} = await axios.get(`${constants.rpc_api}/tokens/get_tokens_of/${window.accountId}`)
      if (myTokens && typeof myTokens !== "string") {
        this.myTokens = myTokens
        this.is_loaded = true
        this.$store.commit('saveUserCollection', myTokens)
        this.$store.dispatch('loader', false)
      } else {
        this.myTokens = []
      }
    } catch (e) {
      console.log(e)
      this.is_loaded = true
      this.error = true
      this.$store.dispatch('loader', false)
    }
  } */
      /* const myTokens = await window.contract.tokens_of_paginated({
        accountId: window.accountId,
        page: this.currentPage,
        perPage: this.perPage
      }) */
      const {data: myTokens} = await axios.get(`${constants.rpc_api}/tokens/tokens_of_paginated/${window.accountId}/${this.currentPage}/${this.perPage}`)
      console.log(myTokens)
      if (typeof myTokens !== 'string') {
        this.myTokens = myTokens
        this.$store.commit('saveUserCollection', myTokens)
        this.$store.dispatch('loader', false)
      } else {
        this.error = true
      }
      this.$store.dispatch('loader', false)
      this.is_loaded = true
    }
  },
  async beforeMount() {
    const {data: tokenIds} = await axios.get(`${constants.rpc_api}/tokens/get_owned_token_ids/${window.accountId}`)
    this.total_owned = tokenIds.length;
    this.$store.dispatch('loader', true)
    if (this.$store.state.userCollection) {
      this.myTokens = this.$store.state.userCollection.slice()
      this.$store.dispatch('loader', false)
      this.is_loaded = true
      return
    }
    await this.fetchUserTokens()
  },
}
</script>

<style scoped>

</style>
