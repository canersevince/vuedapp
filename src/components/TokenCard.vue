<template>
  <div class="overflow-hidden shadow-md p-1">
    <router-link :to="`/tokens/${id}`">
      <img :alt="token.name" class="token_preview block object-contain object-center mx-auto" :src="token.image_url">
    </router-link>

    <header class="flex flex-col items-start justify-between leading-tight p-1 md:p-2">
      <h1 class="text-lg">
        <router-link :to="`/tokens/${id}`" tag="a" class="no-underline hover:underline text-black text-md" href="#">
          {{ token.name }}
        </router-link>
      </h1>
      <router-link tag="a" :to="'/collection/'+token.collection_id" v-if="collection"
                   class="hover:text-red-700 text-xs font-bold"
                   style="min-height: 16px">
        {{ collection.name }}
      </router-link>
      <div v-else style="min-height:16px" />
      <div class="w-full flex justify-between items-center">
        <p class="text-sm my-1">{{ token.description }}</p>
        <p class="text-grey-darker text-xs ml-auto">
          14/4/20
        </p>
      </div>
    </header>

    <footer class="flex items-center justify-between leading-none p-1 md:p-2">
      <a class="flex items-center no-underline hover:underline text-black" href="#">
        <img alt="Placeholder" class="block rounded-full" src="https://picsum.photos/32/32/?random">
        <p class="ml-2 text-sm">
          {{ token.creator }}
        </p>
      </a>
      <a class="no-underline flex items-center ml-auto justify-between text-grey-darker hover:text-red-dark" href="#">
        <span class="text-sm w-full ml-auto" v-if="price" @click="remove_from_sale">{{
            price
          }} <strong>Ⓝ</strong></span>
        <span class="text-xs w-full ml-auto" v-if="!price && !is_owner"></span>
        <button class="px-3 py-2 text-white rounded-md shadow-md custom-red" v-if="!price && is_owner === true">
          Sell
        </button>
      </a>
    </footer>

  </div>
</template>
<script>

export default {
  name: "TokenCard",
  props: {
    token: Object,
    id: Number,
    is_owner: Boolean,
    price: String || null
  },
  data() {
    return {
      collection: null
    }
  },
  methods: {
    remove_from_sale() {
      if (this.is_owner === true && this.price) {
        console.log('removing.')
      }
    }
  },
  created() {
    if (this.token.collection_id) {
      this.collection = window.contract.get_collection_by_id({collection_id: this.token.collection_id})
          .then((response) => this.collection = response).catch((error) => {
            console.log('cannot find collection')
          })
    }
  }
}
</script>

<style scoped>
.token_preview {
  width: 268px;
  height: 268px
}
</style>
