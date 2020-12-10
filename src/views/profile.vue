<template>
  <div class="container mx-auto flex-col flex max-w-full">
    <div v-if="account" class="relative container md:mx-auto py-4 max-w-full"
    >
      <img width="150" :src="base_src+account.pp" class="mx-auto rounded-full" :alt="id">
      <h1 class="z-100 lowercase text-white my-4 items-center justify-center text-3xl font-bold leading-tight text-center">
        {{ id }} </h1>
      <p class="z-100 text-center text-sm text-gray-100">
        {{ account.description }}
      </p>
      <div class="mx-auto text-center pt-2">
        <a v-if="account.website && account.website.length>0" :href="account.website">
          <i class="fab fa-instagram text-white transform transition duration-200 hover:scale-150 cursor-pointer"></i>
        </a>
        <a v-if="account.twitter" :href="account.twitter && account.twitter.length>0">
          <i class="fab fa-twitter text-white ml-1 transform transition duration-200 hover:scale-150 cursor-pointer"></i>
        </a>
        <a v-if="account.instagram" :href="account.instagram && account.instagram.length>0">
          <i class="fa fa-globe text-white ml-1 transform transition duration-200 hover:scale-150 cursor-pointer"></i>
        </a>
      </div>
      <div class="absolute bg-cover bg-center w-full h-full top-0 left-0"
           style="z-index : -1;" :style="{backgroundImage : `url(${account.pp})`}">
      </div>
      <div style="z-index : -1;"
           class="overlay bg-gray-800 opacity-75 top-0 left-0 pointer-events-none z-10 absolute w-full h-full"></div>
    </div>
    <div v-else class="bg-gray-900 relative container md:mx-auto py-4 max-w-full">
      <h1 class="z-100 lowercase text-white my-4 items-center justify-center text-3xl font-bold leading-tight text-center">
        {{ id }} </h1>
      <p class="text-xs text-gray-200 mx-auto text-center">
        this is all we know about {{ id }}
      </p>
    </div>
    <div class="container mx-auto">
      <div class="bg-white text-center">
        <nav class="flex sm:flex-row mx-auto items-center justify-center">
          <button
              @click="activeTab = 'token'"
              :class="activeTab ==='token' ? ' border-b-2 font-medium border-red-900' : ''"
              class="text-gray-600 py-4 px-6 block hover:text-blue-500
              focus:outline-none text-custom-red">
            Tokens
          </button>
          <button
              :class="activeTab ==='collection' ? ' border-b-2 font-medium border-red-900' : ''"
              @click="activeTab = 'collection'"
              class="text-gray-600 py-4 px-6 block hover:text-red-900 focus:outline-none">
            Collections
          </button>
        </nav>
      </div>
    </div>
    <div class="container mx-auto py-6" v-if="activeTab === 'token'">
      <div class="grid grid-cols-12">
        <div class="col-span-12 py-4 gap-1 px-5">
          <div class="grid grid-cols-12 gap-4">
            <div
                v-for="tokenObject in tokens"
                :key="tokenObject.id" class="col-span-12 mt-2 md:col-span-4">
              <TokenCard :price="tokenObject.price" :fetch_price="true" :is_owner="false" :id="tokenObject.id"
                         :token="tokenObject.token"/>
              <p v-if="tokens.length === 0" class="text-red-500 text-md">There are no tokens here...</p>
            </div>
          </div>
          <div v-if="showEmpty">
            <p class="text-center font-major lowercase text-xl leading-10">
              THIS COLLECTION LOOKS EMPTY...😢
              <br>
              BUT YOU CAN CHECK
              <router-link to="/browse-collections" class="underline">OTHER COLLECTIONS</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="container mx-auto py-6">
      <div class="grid grid-cols-12">
        <div class="col-span-12 gap-1 px-5">
          <div class="grid grid-cols-12 gap-6">
            <div :key="collectionObj.id" v-for="collectionObj in collections" class="col-span-12 md:col-span-4">
              <CollectionCard :id="collectionObj.id" :collection="collectionObj.collection"/>
              <p v-if="collectionObj.length === 0" class="text-red-500 text-md">There are no collections created,
                yet...</p>
            </div>
          </div>
          <div v-if="showEmpty">
            LOOKS LIKE THERE IS NOTHING HERE...
          </div>
        </div>
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
import CollectionCard from '@/components/CollectionCard'
import axios from "axios";
import {constants} from "@/helpers/constants";

export default {
  name: "profile",
  components: {TokenCard, CollectionCard},
  data() {
    return {
      currentPage: 1,
      perPage: 6,
      activeTab: "token",
      showEmpty: false,
      account: "",
      tokens: [],
      collections: [],
      total_owned: null,
      total_owned_collections: null,
      base_src: constants.img_base_url
    }
  },
  watch: {
    currentPage(val) {
      this.$nextTick(() => {
        if (this.activeTab === 'token') {
          this.fetchTokens()
        } else {
          this.fetchCollections()
        }
      })
    },
    activeTab() {
      this.currentPage = 1;
    }
  },
  computed: {
    pages() {
      if (this.activeTab === 'token') {
        if (this.total_owned > 0) {
          return new Array(Math.ceil(this.total_owned / this.perPage))
        }
      } else {
        if (this.total_owned_collections > 0) {
          return new Array(Math.ceil(this.total_owned_collections / this.perPage))
        }
      }
      return new Array(1)
    },
    id() {
      return this.$route.params.id
    }
  },
  methods: {
    async fetchTokens() {
      this.$store.dispatch('loader', true)
      const {data: Tokens} = await axios.get(`${constants.rpc_api}/tokens/tokens_of_paginated/${this.id}/${this.currentPage}/${this.perPage}`)
      if (typeof Tokens === "string") {
        console.log(Tokens)
        this.tokens = []
      } else {
        this.tokens = Tokens
      }
      this.$store.dispatch('loader', false)
    },
    async fetchCollections() {
      this.$store.dispatch('loader', true)
      const {data: Collections} = await axios.get(`${constants.rpc_api}/collections/collections_of_paginated/${this.id}/${this.currentPage}/${this.perPage}`)
      if (typeof Collections === "string") {
        this.collections = []
      } else {
        this.collections = Collections
      }
      this.$store.dispatch('loader', false)
    },
    loadMoreCol() {
      if (this.collectionMax > this.tokens.length) return;
      this.collectionMax += 8
    }
  },
  async beforeMount() {
    this.$store.dispatch('loader', true)
    if (!this.id) {
      return this.$router.push('/404')
    }
    try {
      const {data: tokenIds} = await axios.get(`${constants.rpc_api}/tokens/get_owned_token_ids/${this.id}`)
      const {data: collIds} = await axios.get(`${constants.rpc_api}/collections/get_collections_by_account_id/${this.id}`)
      this.total_owned = tokenIds.length;
      this.total_owned_collections = collIds.length;
      await this.fetchTokens()
      await this.fetchCollections()
      const {data: Account} = await axios.get(`${constants.rpc_api}/accounts/get_account_details/${this.id}`)
      if (typeof Account === "string" && Account.indexOf('Error') > -1) {
        this.account = false
      } else {
        this.account = Account
      }
    } catch (e) {
      console.log(e)
      this.$store.dispatch('loader', false)
    }
  }
}
</script>

<style scoped>

</style>
