<template>
  <div class="container mx-auto flex-col flex max-w-full">
    <div v-if="account" class="relative container md:mx-auto py-4 max-w-full"
    >
      <img width="150" :src="account.pp" class="mx-auto rounded-full" :alt="id">
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
          <div class="grid grid-cols-12 gap-2">
            <div
                v-for="tokenObject in tokens.slice(0, tokens.length>= 8 ? tokenMax : tokens.length)"
                :key="tokenObject.id" class="col-span-12 md:col-span-4">
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
          <div @click="loadMoreTokens"
               v-if="this.tokenMax <= this.tokens.length"
               class="cursor-pointer mx-auto col-span-12 mt-8 text-gray-700 text-center text-xl font-bold">
            Load More<i class="fa fa-plus text-gray-900 text-custom-red p-3"></i>
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

  </div>
</template>

<script>
import TokenCard from "@/components/TokenCard";
import CollectionCard from '@/components/CollectionCard'

export default {
  name: "profile",
  components: {TokenCard, CollectionCard},
  data() {
    return {
      activeTab: "token",
      showEmpty: false,
      tokenMax: 8,
      collectionMax: 8,
      account: "",
      tokens: [],
      collections: []
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  methods: {
    loadMoreTokens() {
      if (this.tokenMax > this.tokens.length) return;
      this.tokenMax += 8
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
      this.account = await window.contract.get_account_details({accountId: this.id})
      this.tokens = await window.contract.get_tokens({accountId: this.id})
      this.collections = await window.contract.get_collections_by_account_id({account_id: this.id})
      this.tokens = this.tokens.reverse()
      this.collections = this.collections.reverse()
      this.$store.dispatch('loader', false)
    } catch (e) {
      console.log(e)
      this.$store.dispatch('loader', false)
    }
  }
}
</script>

<style scoped>

</style>
