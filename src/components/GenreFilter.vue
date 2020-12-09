<template>
  <div class="w-100">
    <div class="p-3">
      <input v-model="filterWord"
             class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"

             type="text" placeholder="Search...">
    </div>
    <ul class="list list-none">
      <li v-for="genre in filtered" :key="genre"
          class="py-2 px-4 transition-all duration-300 border border-gray-200 radius-lg font-light"
          :class="genre == id ? 'bg-gray-200 shadow-sm' : ''"
      >
        <router-link tag="a" :to="'/browse/'+genre">{{ genre }}</router-link>
      </li>
      <li
          v-if="filterWord.length===0"
          class="py-2 px-3 transition-all duration-300 border-0 border-red-100 radius-lg font-light"
      >
        ...
      </li>
    </ul>
  </div>
</template>

<script>
import Genres from '../helpers/genres'

export default {
  name: "GenreFilter",
  data() {
    return {
      genres: null,
      filterWord: "",
    }
  },
  computed: {
    id() {
      return this.$route.params.genre
    },
    filtered() {
      if (this.genres && this.filterWord.length > 0) {
        return this.genres.filter(genre => genre.toLowerCase().includes(this.filterWord))
      }
      return this.genres.slice(0, 10)
    }
  },
  created() {
    this.genres = Genres.sort((prev, next) => {
      if (prev > next) return 1
      else if (prev < next) return -1
      return 0
    })
  }
}
</script>

<style scoped>

</style>
