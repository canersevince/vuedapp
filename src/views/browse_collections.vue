<template>
  <div class="container mx-auto max-w-full">
    <div class="bg-gray-100 container md:mx-auto py-8 max-w-full">
      <h1 class="font-major lowercase text-gray-700 my-4 items-center justify-center text-5xl font-bold leading-tight text-center">
        COLLECTIONS
      </h1>
    </div>
    <p class="pb-2 pt-3 text-center text-gray-500">
      {{
        totalCollection > 1 ? `There are ${totalCollection} collections.` : `There is ${totalCollection} collection`
      }}</p>
    <div class="grid grid-cols-12">
      <div class="col-span-12 gap-1 px-5">
        <div class="grid grid-cols-12 gap-4">
          <div :key="collectionObj.id" v-for="collectionObj in collections" class="col-span-12 md:col-span-3">
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


    <div class="container mx-auto max-w-full flex items-center justify-center py-8">
      <nav class="relative z-0 inline-flex shadow-sm -space-x-px" aria-label="Pagination">
        <a href="#"
           v-if="currentPage>1 && pages.length>1"
           @click.prevent="currentPage++"
           class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
          <span class="sr-only">Previous</span>
          <i class="fa fa-chevron-left text-md p-1"></i>
        </a>
        <a @click.prevent="currentPage = idx+1" :key="idx+1" v-for="(i, idx) in pages" href="#"
           class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
          {{ idx + 1 }}
        </a>
        <a
            v-if="pages.length>1"
            @click.prevent="currentPage++"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
          <span class="sr-only">Next</span>
          <i class="fa fa-chevron-right text-md p-1"></i>
        </a>
      </nav>
    </div>
  </div>
</template>

<script>
import CollectionCard from "@/components/CollectionCard";

export default {
  name: "browse_collections",
  components: {
    CollectionCard
  },
  data() {
    return {
      currentPage: 1,
      perPage: 8,
      collections: [],
      showEmpty: false,
      totalCollection: 0
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
    async fetchCollection() {
      try {
        this.totalCollection = await window.contract.total_collections()
        this.collections = await window.contract.get_collections({perPage: this.perPage, page: this.currentPage})
        this.showEmpty = this.collections.length == 0;
      } catch (err) {
        this.showEmpty = true
        console.log(err)
      }
    },
    changePage(i) {
      this.currentPage = i
    }
  },
  mounted() {
    this.fetchCollection()
  }
}
</script>

<style scoped>

</style>
