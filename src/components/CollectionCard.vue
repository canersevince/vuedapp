<template>
  <div class="overflow-hidden shadow-md p-1">
    <router-link :to="`/collection/${id}`">
      <img :alt="collection.name" class="collection_preview block object-contain object-center mx-auto"
           :src="base_src+collection.image_url">
    </router-link>
    <header class="flex flex-col items-start justify-between leading-tight p-1 md:p-2">
      <h1 class="text-lg">
        <router-link :to="`/collection/${id}`" tag="a" class="no-underline hover:underline text-black text-md">
          {{ collection.name }}
        </router-link>
      </h1>
      <div class="w-full flex justify-between items-center">
        <p class="text-sm my-1">{{
            collection.description && collection.description.length > 25 ? collection.description.substring(0, 25) + '...' : collection.description
          }}</p>
        <p class="text-grey-darker text-xs ml-auto">
          14/4/20
        </p>
      </div>
    </header>

    <footer class="flex items-center justify-between leading-none p-1 md:p-2">
      <a class="flex items-center no-underline hover:underline text-black" href="#">
        <img width="32" alt="Placeholder" class="block rounded-full"
             :src="user_picture && user_picture.length> 0 ? base_src+user_picture : 'https://picsum.photos/32/32/?random'">
        <router-link tag="a" class="ml-2 text-sm text-gray-900" :to="'/profile/'+collection.owner">
          {{ collection.owner }}
        </router-link>
      </a>
    </footer>

  </div>
</template>

<script>
import axios from "axios";
import {constants} from "@/helpers/constants";

export default {
  name: "CollectionCard",
  props: {
    collection: Object,
    id: Number
  },
  data() {
    return {
      user_picture: null,
      base_src: constants.img_base_url
    }
  },
  async created() {
    try {
      /* this.user_picture = await window.contract.get_user_profile_picture({accountId: this.collection.owner}) */
      const {data: Picture} = await axios.get(`${constants.rpc_api}/accounts/get_user_profile_picture/${this.collection.owner}`)
      if (Picture && Picture.indexOf('Error') < 0) {
        this.user_picture = Picture
      }
    } catch (e) {
      console.log(e)
    }
  }
}
</script>

<style scoped>

.collection_preview {
  width: 268px;
  height: 268px
}
</style>
