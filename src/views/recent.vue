<template>
  <div class="container mx-auto max-w-full">
    <div class="bg-gray-100 container md:mx-auto py-8 max-w-full">
      <h1 class="font-major lowercase text-gray-700 my-4 items-center justify-center text-5xl font-bold leading-tight text-center">
        RECENTLY MINTED
      </h1>
    </div>
    <div class="container mx-auto py-16">
      <div class="grid grid-cols-12">
        <div class="col-span-12 gap-1 px-3">
          <div class="grid grid-cols-12 gap-4">
            <div v-for="tokenObject in recentTokens" :key="tokenObject.id" class="col-span-12 md:col-span-3 w-full">
              <TokenCard :fetch_price="true" :is_owner="false" :id="tokenObject.id" :token="tokenObject.token"/>
              <p v-if="recentTokens.length === 0" class="text-red-500 text-md">There are no tokens here...</p>
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
import TokenCard from '@/components/TokenCard'
import {constants} from '@/helpers/constants'
import axios from 'axios'
export default {
  components: {TokenCard},
  name: "recent",
  data() {
    return {
      recentTokens: [],
      showEmpty: false
    }
  },
  computed: {
    pages() {
      if (this.totalCollection > 0) {
        return new Array(Math.ceil(this.totalCollection / this.perPage))
      }
      return new Array(1)
    }
  },
  methods: {
    async fetchRecent() {
      try {
        // const data = await window.contract.get_recent_tokens()
        const {data} = await axios.get(`${constants.rpc_api}/tokens/get_recent_tokens`)
        console.log(data)
        console.log(data)
        console.log(data)
        this.recentTokens = data.reverse()
        this.showEmpty = this.recentTokens.length === 0
      } catch (e) {
        console.log(e)
        console.log(e)
        console.log(e)
        console.log(e)
      }
    },

    changePage(i) {
      this.currentPage = i
    }
  },
  beforeMount() {
    if (this.recentTokens.length === 0) {
      this.fetchRecent();
    }
  }
}
</script>

<style scoped>

</style>
