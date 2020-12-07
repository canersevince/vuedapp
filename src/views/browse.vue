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
            <div v-for="tokenObject in browsingTokens" :key="tokenObject.id" class="col-span-6 md:col-span-4 h-full">
              <TokenCard  style="border: 0.01em dashed;"  :style="{borderColor: tokenObject.token.background_color}"  :price="tokenObject.price" :fetch_price="true" :is_owner="false" :id="tokenObject.id"
                         :token="tokenObject.token"/>
              <p v-if="browsingTokens.length === 0" class="text-red-500 text-md">There are no tokens here...</p>
            </div>
          </div>
          <div v-if="showEmpty">
            LOOKS LIKE THERE IS NOTHING HERE...
          </div>
        </div>
      </div>
      <div class="container mx-auto max-w-full flex items-center justify-center py-8">
        <nav class="relative z-0 inline-flex shadow-sm -space-x-px" aria-label="Pagination">
          <a href="#"
             v-if="currentPage>1 && pages.length>1"
             @click.prevent="currentPage++"
             style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;  "
             class="relative inline-flex items-center px-2 py-2 border rounded-full border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            <span class="sr-only">Previous</span>
            <i class="fa fa-chevron-left text-md p-1"></i>
          </a>
          <a href="#"
             v-if="currentPage>3"
             @click.prevent="currentPage = 1"
             style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-left: 3px"
             class="relative inline-flex items-center px-2 py-2 border rounded-full border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            <span class="sr-only">Previous</span>
            <span>...</span>
          </a>
          <a @click.prevent="currentPage = idx+1" :class="idx+1 == currentPage ? 'border-red-500 border-0' : 'border-0'"
             v-show="idx < currentPage+2 && idx > currentPage-3"
             :key="idx+1" v-for="(i, idx) in pages" href="#"
             style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin: 0 3px"
             class="relative inline-flex items-center px-4 py-2 border rounded-full  border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            {{ idx + 1 }}
          </a>
          <a href="#"
             v-if="currentPage>3 && currentPage<pages.length"
             @click.prevent="currentPage=pages.length"
             style="width: 40px; height: 40px; margin-right: 3px; display: flex; align-items: center; justify-content: center;  "
             class="relative inline-flex items-center px-2 py-2 border rounded-full border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            <span class="sr-only">Previous</span>
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
      perPage: 6,
      currentPage: 1,
      browsingTokens: [],
      showEmpty: false,
      totalSupply: 0,
      fetched: false
    }
  },
  watch: {
    currentPage(val) {
      if (!this.fetched) return;
      if (!val) return;
      this.$router.push('/browse/recent/' + val).then(res => {
        this.$nextTick(() => {
          this.fetchByPage()
        })
      })
    }
  },
  methods: {
    changePage(i) {
      this.currentPage = i
    },
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
    },
    fetchByPage() {
      this.$store.dispatch('loader', true)
      window.contract.get_tokens_by_page({page: this.currentPage, perPage: this.perPage}).then(res => {
        console.log(res)
        this.browsingTokens = res;
        this.fetched = true
        this.$store.dispatch('loader', false)
      }).catch(err => {
        console.log(err)
        this.$store.dispatch('loader', false)
      })
    }
  },
  computed: {
    pages() {
      if (this.totalSupply > 0) {
        return new Array(Math.ceil(this.totalSupply / this.perPage))
      }
      return new Array(1)
    }
  },
  async mounted() {
    this.totalSupply = await window.contract.token_supply()
    if (!this.fetched) {
      const page = this.$route.params.page
      console.log(page)
      console.log(page)
      console.log(page)
      if (page) {
        this.currentPage = parseInt(page)
      }
    }
    console.log(this.totalSupply)

    this.fetchByPage()
  }
}
</script>

<style scoped>

</style>
