<template>
  <div class="overflow-hidden shadow-md p-1">
    <router-link :to="`/collection/${id}`">
      <img :alt="collection.name" class="collection_preview block object-contain object-center mx-auto"
           :src="collection.image_url">
    </router-link>
    <header class="flex flex-col items-start justify-between leading-tight p-1 md:p-2">
      <h1 class="text-lg">
        <router-link :to="`/collection/${id}`" tag="a" class="no-underline hover:underline text-black text-md"
                     href="#">
          {{ collection.name }}
        </router-link>
      </h1>
      <div class="w-full flex justify-between items-center">
        <p class="text-sm my-1">{{ collection.description && collection.description.length>25 ? collection.description.substring(0, 25)+'...' : collection.description }}</p>
        <p class="text-grey-darker text-xs ml-auto">
          14/4/20
        </p>
      </div>
    </header>

    <footer class="flex items-center justify-between leading-none p-1 md:p-2">
      <a class="flex items-center no-underline hover:underline text-black" href="#">
        <img alt="Placeholder" class="block rounded-full" src="https://picsum.photos/32/32/?random">
        <router-link tag="a" class="ml-2 text-sm text-gray-900" :to="'/profile/'+collection.owner">
          {{ collection.owner }}
        </router-link>
      </a>
    </footer>

  </div>
</template>

<script>
export default {
  name: "CollectionCard",
  props: {
    collection: Object,
    id: Number
  }
}
</script>

<style scoped>

.collection_preview {
  width: 268px;
  height: 268px
}
</style>
