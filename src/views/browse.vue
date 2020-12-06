<template>
  <div class="w-100">
    <div class="bg-gray-100 container md:mx-auto py-8 max-w-full">
      <h1 class="font-major lowercase text-gray-700 my-4 items-center justify-center text-5xl font-bold leading-tight text-center">
        BROWSE </h1>
    </div>
    <div class="container mx-auto py-16">
      <div class="grid grid-cols-12">
        <div class="bg-gray-100 col-span-12 shadow-md md:col-span-3 border rounded-md border-grey-100">
          <h1 class="mx-auto uppercase text-gray-700 text-center text-xl font-bold mt-2">Visual Art</h1>
          <ul class="list list-none">
            <li @click="fetchRecent" :class="isActive('recent')? 'bg-gray-200' : ''"
                :exact="true"
                class="py-2 px-4 cursor-pointer transition-all duration-300 border border-gray-200 radius-lg font-light">
              Recent
            </li>
            <router-link
                tag="li" :to="`/browse/curated`" exact-active-class="bg-gray-200"
                class="py-2 px-4 cursor-pointer transition-all duration-300 border border-gray-200 radius-lg font-light">
              Curated
            </router-link>
            <li
                class="py-2 px-4 cursor-pointer transition-all duration-300 border border-gray-200 radius-lg font-light">
              or search by Artist Name
              <input
                  @keydown.enter.prevent="searchByArtist"
                  v-model="artistName"
                  class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text">
            </li>
          </ul>
          <h1 class="mx-auto uppercase text-gray-700 text-center text-xl font-bold mt-2">Music Genres</h1>
          <GenreFilter/>
        </div>
        <div class="col-span-12 lg:col-span-9 gap-1 px-5">
          <div class="grid grid-cols-12 gap-2">
            <div v-for="tokenObject in browsingTokens" :key="tokenObject.id" class="col-span-4">
              <TokenCard :price="tokenObject.price" :fetch_price="true" :is_owner="false" :id="tokenObject.id"
                         :token="tokenObject.token"/>
              <p v-if="browsingTokens.length === 0" class="text-red-500 text-md">There are no tokens here...</p>
            </div>
          </div>
          <div v-if="showEmpty">
            LOOKS LIKE THERE IS NOTHING HERE...
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import TokenCard from "@/components/TokenCard";
import GenreFilter from "@/components/GenreFilter";
import {utils} from "near-api-js";

export default {
  name: "browse",
  components: {GenreFilter, TokenCard},
  data() {
    return {
      artistName: "",
      perPage: 8,
      currentPage: 1,
      browsingTokens: [],
      showEmpty: false
    }
  },
  methods: {
    searchByArtist() {
      this.$router.push(`/browse/artist/${this.artistName}/1`).then(() => this.browseArtist())
    },
    isActive(a) {
      return this.$route.path.toLowerCase().indexOf(a) > -1
    },
    async browseArtist() {
      const artist = this.$route.params.name
      const page = this.$route.params.page
      if (!artist || !page) {
        this.browsingTokens = []
      } else {
        try {
          const tokens = await window.contract.get_tokens({accountId: artist})
          if (tokens) {
            for (const token of tokens) {
              const response = await window.contract.get_price({token_id: token.id})
              if (response) {
                token.price = utils.format.formatNearAmount(response)
              }
            }
            this.browsingTokens = tokens
          } else {
            this.showEmpty = true

          }
        } catch (e) {
          console.log(e)
          if (e.message.includes('BALANCE')) {
            this.showEmpty = true
            return
          }
          this.is_loaded = true
        }
      }
    },
    async fetchRecent() {
      try {
        const data = await window.contract.get_recent_tokens()
        this.browsingTokens = data.reverse()
        this.showEmpty = this.browsingTokens.length === 0
      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted() {
    if (this.$route.path.indexOf('recent') > -1) {
      this.fetchRecent()
      return
    }
    this.browseArtist()
  }
}
</script>

<style scoped>

</style>
