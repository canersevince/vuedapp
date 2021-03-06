<template>
  <div class="container mx-auto max-w-full">
    <div class="bg-gray-100 container md:mx-auto py-8 max-w-full">
      <h1 class="font-major lowercase text-gray-700 my-4 items-center justify-center text-5xl font-bold leading-tight text-center">
        COLLECTIONS
      </h1>
      <h3 class="text-lg font-weight-bold text-gray-600 font-major lowercase text-center my-3">Explore Artists
        Collections</h3>
    </div>


    <p class="pb-2 pt-3 text-center text-gray-500">
      {{
        totalCollection > 2 ? `There are ${totalCollection-1} collections.` : `There is ${totalCollection-1} collection`
      }}</p>
    <div class="container mx-auto">
      <div class="grid grid-cols-12">
        <div class="col-span-12 gap-1 px-5">
          <div class="grid grid-cols-12 gap-6">
            <div :key="collectionObj.id" v-for="collectionObj in collections" class="col-span-12 md:col-span-4">
              <CollectionCard v-if="collectionObj.id>0" :id="collectionObj.id" :collection="collectionObj.collection"/>
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

    <div class="container mx-auto max-w-full flex items-center justify-center py-8">
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
           v-if="currentPage>3"
           @click.prevent="currentPage=pages.length"
           style="width: 40px; height: 40px; display: flex; margin-right: 3px; align-items: center; justify-content: center;  "
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
</template>

<script>
import CollectionCard from "@/components/CollectionCard";
import axios from "axios";
import {constants} from "@/helpers/constants";

export default {
  name: "browse_collections",
  components: {
    CollectionCard
  },
  data() {
    return {
      currentPage: 1,
      perPage: 6,
      collections: [],
      showEmpty: false,
      totalCollection: 0,
      fetched: false
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
  watch: {
    currentPage(val) {
      if (!this.fetched) return;
      if (!val) return;
      this.$router.push('/browse-collections/' + val).then(res => {
        this.$nextTick(() => this.fetchCollection())
      })
    }
  },
  methods: {
    async fetchCollection() {
      this.$store.dispatch('loader', true)
      const page = this.$route.params.page
      try {
        this.fetched = true
        const {data: TotalCollections} = await axios.get(`${constants.rpc_api}/collections/total_collections`)
        this.totalCollection = TotalCollections
        const {data: Collections} = await axios.get(`${constants.rpc_api}/collections/get_collections_by_pages/${page ? parseInt(page) : 1}/${parseInt(this.perPage)}`)
        /* this.collections = await window.contract.get_collections({
          page: page ? parseInt(page) : 1,
          perPage: this.perPage
        }) */
        this.collections = Collections
        this.showEmpty = this.collections.length === 0;
      } catch (err) {
        this.showEmpty = true
        console.log(err)
      }
      this.$store.dispatch('loader', false)
    },
    changePage(i) {
      this.currentPage = i
    }
  },
  mounted() {
    const page = this.$route.params.page
    if (!page) {
      this.$router.push('/browse-collections/1').then(res => this.fetchCollection())
    } else {
      this.fetchCollection()
    }
  }
}
</script>

<style scoped>

</style>
