<template>
  <div class="container mx-auto flex-col flex max-w-full">
    <div v-if="collection" class="relative container md:mx-auto py-8 max-w-full"
    >
      <h1 class="z-100 font-major lowercase text-white my-4 items-center justify-center text-5xl font-bold leading-tight text-center">
        {{ collection.name }} </h1>
      <p class="z-100 text-center text-xs text-gray-100">a collection by
        <router-link
            :to="'/artist/'+collection.owner"
            class="cursor-pointer text-sm font-bold text-white">
          {{ collection.owner }}
        </router-link>
      </p>
      <div class="absolute bg-cover bg-center w-full h-full top-0 left-0"
           style="z-index : -1;" :style="{backgroundImage : `url(${base_url+collection.image_url})`}">
      </div>
      <div style="z-index : -1;"
           class="overlay bg-gray-800 opacity-75 top-0 left-0 pointer-events-none z-10 absolute w-full h-full"></div>
    </div>
    <div class="flex relative items-center justify-center">
      <button class="transform transition hover:scale-105 hover:shadow-lg
      duration-200 opacity-0 self-center font-major lowercase text-white py-3 shadow-md my-3 md:my-6 px-3 custom-red"
              :class="{'opacity-100' : canReFetch}"
              @click="fetchCollectionDetail">
        REFRESH
        COLLECTION
      </button>
      <button @click="changeOrder" class="transform transition hover:scale-105 hover:shadow-lg
      duration-200 absolute right-10 m-auto self-center font-major lowercase
      text-white py-3 shadow-md my-3 md:my-6 px-3 custom-red">
        {{ !newest ? 'Newest First' : 'Oldest First' }}
      </button>
    </div>
    <div class="container mx-auto py-6">
      <div class="grid grid-cols-12">
        <div class="col-span-12 py-4 gap-1 px-5">
          <div class="grid grid-cols-12 gap-2">
            <div
                v-for="tokenObject in collectionTokens.slice(0, collectionTokens.length>= 8 ? max : collectionTokens.length)"
                :key="tokenObject.id" class="col-span-12 md:col-span-4">
              <TokenCard :is_collection_page="true" :price="tokenObject.price" :fetch_price="true" :is_owner="false"
                         :id="tokenObject.id"
                         :token="tokenObject.token"/>
              <p v-if="collectionTokens.length === 0" class="text-red-500 text-md">There are no tokens here...</p>
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
          <div @click="loadMore"
               v-if="this.max <= this.collectionTokens.length"
               class="cursor-pointer mx-auto col-span-12 mb-5 text-gray-700 text-center text-xl font-bold">
            Load More<i class="fa fa-plus text-gray-900 text-custom-red p-3"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TokenCard from '@/components/TokenCard'
import {constants} from "@/helpers/constants";

export default {
  name: "collection_detail",
  components: {
    TokenCard
  },
  data() {
    return {
      canReFetch: false,
      newest: true,
      max: 8,
      collection: null,
      collectionTokens: [],
      showEmpty: false,
      base_url: constants.img_base_url
    }
  },
  watch: {
    newest() {
      this.collectionTokens = this.collectionTokens.reverse();
    }
  },
  methods: {
    loadMore() {
      if (this.max > this.collectionTokens.length) return;
      this.max += 8
    },
    changeOrder() {
      this.newest = !this.newest
    },
    async fetchTokens(parsed) {
      this.$store.dispatch('loader', true)
      try {
        this.collectionTokens = await window.contract.get_tokens_by_collection({collectionId: parsed})

        setTimeout(() => {
          if (self.canReFetch !== null) {
            self.canReFetch = true
          }
        }, 15000)
      } catch (e) {
        console.log(e)
        this.showEmpty = true
      }
      this.$store.dispatch('loader', false)
    },
    async fetchCollectionDetail() {
      this.$store.dispatch('loader', true)
      const id = this.$route.params.id
      const parsed = parseInt(id)
      if (!parsed) {
        console.log('wrong id')
        this.$router.push('/browse-collections')
      }
      try {
        const collection = await window.contract.get_collection_by_id({collection_id: parsed})
        if (collection) {
          console.log({collection})
          this.collection = collection
          this.$store.dispatch('loader', false)
          if (collection.tokens.length < 1) {
            console.log('wtf')
            this.showEmpty = true
          } else {
            this.fetchTokens(parsed)
          }
        }
      } catch (e) {
        console.log(e)
        this.$store.dispatch('loader', true)
        this.$router.push('/collections')
      }
    }
  },
  beforeMount() {
    this.fetchCollectionDetail()
  }
}
</script>

<style scoped>

</style>
