<template>
  <div class="flex-col flex pb-4 py-12">
    <h1 class="mb-4 text-center font-black text-gray-700">CREATE NEW COLLECTION</h1>
    <div class="mx-auto py-5 w-full flex gap-1 flex-col md:flex-row">
      <form @submit.prevent="" class="w-full max-w-lg pr-3 mx-auto p-5">
        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full md:w-100 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-name">
              Collection Name
            </label>
            <input
                v-model="collection.collection_name"
                class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-name" type="text" placeholder="My Precious...">
            <p class="text-red-500 text-xs italic" v-if="collection.collection_name.length < 1">Please fill out this field.</p>
          </div>
        </div>
        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full px-3">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
              Description
            </label>
            <textarea
                v-model="collection.description"
                class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-password" placeholder="..."></textarea>
            <p class="text-gray-600 text-xs italic">Describe your artwork with maximum 200 characters.</p>
          </div>
        </div>
        <div class="flex flex-wrap -mx-3 mb-2 items-center justify-content-between">
          <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-external">
              External Link
            </label>
            <input
                v-model="collection.external_url"
                class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-external" type="text" placeholder="Detailed page, personal website etc.">
          </div>
          <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0 text-right">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-external">
              Collection Image
            </label>
            <button @drop="onDrop" @click="selectImage"
                    class="w-full px-3 py-2 mx-auto custom-red radius-xl border text-white">
              <i class="fa fa-image"></i> Select Image
            </button>
          </div>
          <p v-if="file_error" class="border-2 border-red-300 p-2 text-red-500 text-md mx-auto text-center mt-4">You can
            only select image files</p>
        </div>
        <div class="w-full md:w-100 px-3 mb-6 md:mb-0 flex items-center justify-content-center mt-5">
          <button @click="createCollection" class="px-3 py-2 mx-auto custom-red radius-xl border text-white">
            Create Collection
          </button>
        </div>
        <input @change="fileSelected" type="file" class="hidden" ref="fileUpload">
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "collection_creation",
  data() {
    return {
      collection: {
        collection_name: "",
        description: "",
        image_url: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
        external_url: ""
      },
      collectionImage: null,
      file_error: false
    }
  },
  methods: {
    selectImage(e) {
      e.preventDefault()
      this.file_error = false
      this.$refs.fileUpload.click()
    },
    onDrop(e) {
      e.preventDefault()
      console.log(e)
    },
    createCollection() {
      const {collection_name, description, image_url, external_url} = this.collection
      window.contract.create_collection({collection_name, description, image_url, external_url}).then(response => {
        console.log(response)
      }).catch(error => console.error(error))
    },
    fileSelected(e) {
      if (e.target.files[0].type !== 'image/png') {
        this.file_error = true
        return false
      }
      this.collectionImage = e.target.files[0]
    }
  }
}
</script>

<style scoped>

</style>
