<template>
  <div class="container mx-auto max-w-full">
    <div class="bg-gray-100 container md:mx-auto py-8 max-w-full">
      <h1 class="font-major lowercase my-4 items-center justify-center text-5xl font-bold leading-tight text-center">
        MY COLLECTION </h1>
    </div>
    <div class="flex items-center justify-center">
      <button class="transform transition hover:scale-105 hover:shadow-lg
      duration-200 font-major lowercase text-white py-3 shadow-md my-3 md:my-6 px-3 custom-red"
              @click="fetchUserTokens">
        REFRESH
        COLLECTION
      </button>
    </div>
    <div class="grid grid-cols-12 gap-2 pb-12 pt-0 px-2 md:px-8">
      <div v-for="tokenObject in myTokens" :key="tokenObject.id"
           class="col-span-12 lg:col-span-3 mt-1 px-5 md:px-1 py-5 md:py-1">
        <TokenCard :price="tokenObject.price" :is_owner="true" :id="tokenObject.id" :token="tokenObject.token"/>
      </div>
    </div>
    <div class="container mx-auto px-2 py-8">
      <div class="text-center w-full flex items-center justify-center">
        <p v-if="myTokens.length === 0 && is_loaded" class="text-red-600 text-xl font-bold w-full">Looks like your
          collection is
          empty 😔 <br>
          <router-link tag="a" to="/browse" class="underline uppercase block mt-2">Start Collecting!</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import TokenCard from "@/components/TokenCard";
import {utils} from "near-api-js";

export default {
  name: "collection",
  components: {TokenCard},
  data() {
    return {
      myTokens: [],
      is_loaded: false
    }
  },
  methods: {
    async fetchUserTokens() {
      this.$store.commit('showLoader')
      try {
        const myTokens = await window.contract.get_tokens({accountId: window.accountId})
        if (myTokens) {
          for (const token of myTokens) {
            const response = await window.contract.get_price({token_id: token.id})
            if (response) {
              token.price = utils.format.formatNearAmount(response)
            }
          }
          this.myTokens = myTokens
          this.is_loaded = true
          this.$store.commit('saveUserCollection', myTokens)
          this.$store.commit('hideLoader')
        }
      } catch (e) {
        console.log(e)
        this.is_loaded = true
        this.$store.commit('hideLoader')
      }
    }
  },
  async beforeMount() {
    this.$store.commit('showLoader')
    if (this.$store.state.userCollection) {
      this.myTokens = this.$store.state.userCollection.slice()
      this.$store.commit('hideLoader')
      return
    }
    await this.fetchUserTokens()
  }
}
</script>

<style scoped>

</style>
