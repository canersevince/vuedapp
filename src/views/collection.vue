<template>
  <div class="container mx-auto max-w-full">
    <div class="bg-gray-100 container md:mx-auto py-8 max-w-full">
      <h1 class="font-major lowercase my-4 text-gray-700 items-center justify-center text-5xl font-bold leading-tight text-center">
        MY COLLECTION </h1>
    </div>
    <Loader v-if="!is_loaded"/>
    <div class="flex relative items-center justify-center">
      <button class="transform transition hover:scale-105 hover:shadow-lg
      duration-200 self-center font-major lowercase text-white py-3 shadow-md my-3 md:my-6 px-3 custom-red"
              @click="fetchUserTokens">
        REFRESH
        COLLECTION
      </button>
      <button @click="changeOrder" class="transform transition hover:scale-105 hover:shadow-lg
      duration-200 absolute right-10 m-auto self-center font-major lowercase
      text-white py-3 shadow-md my-3 md:my-6 px-3 custom-red">
        {{ !newest ? 'Newest First' : 'Oldest First' }}
      </button>
    </div>
    <div class="container mx-auto">
      <div class="grid grid-cols-12 gap-2 pb-12 pt-0 px-2 md:px-8">
        <div v-for="tokenObject in myTokens.slice(this.start, this.end)" :key="tokenObject.id"
             class="col-span-12 lg:col-span-3 mt-1 px-5 md:px-1 py-5 md:py-1">
          <TokenCard :fetch_price="true" :is_owner="true" :id="tokenObject.id" :token="tokenObject.token"/>
        </div>
      </div>
    </div>
    <div class="container mx-auto px-2 py-8">
      <div class="text-center w-full flex items-center justify-center">
        <p v-if="myTokens.length === 0 && is_loaded" class="text-red-600 text-xl font-bold w-full">
          <span v-if="error">Error while fetching blockchain.</span>
          <span v-else>Looks like your
          collection is
          empty 😔 <br></span>
          <router-link v-if="!error" tag="a" to="/browse" class="underline uppercase block mt-2">Start Collecting!
          </router-link>
        </p>
      </div>
    </div>
    <div v-if="is_loaded && !error" @click="showMore"
         class="cursor-pointer mx-auto col-span-12 mb-5 text-gray-700 text-center text-xl font-bold">
      Load More<i class="fa fa-plus text-gray-900 text-custom-red p-3"></i>
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
      newest: true,
      start: 0,
      end: 4,
      myTokens: [],
      is_loaded: false,
      error: false
    }
  },
  watch: {
    newest(val) {
      this.end = 8
      this.myTokens = this.myTokens.reverse()
    }
  },
  methods: {
    showMore() {
      this.end += 4
    },
    changeOrder() {
      this.newest = !this.newest
    },
    async fetchUserTokens() {
      await this.$store.dispatch('loader', true)
      try {
        /* const myTokens = await window.contract.get_tokens({accountId: window.accountId}) */
        const {data: myTokens} = await axios.get(`${constants.rpc_api}/tokens/get_tokens_of/${window.accountId}`)
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
    }
  },
  async beforeMount() {
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
