<template>
  <div class="flex-col flex pb-4">
    <div v-show="step==1" class="mx-auto py-5 w-full flex gap-1 flex-col md:flex-row">
      <form @submit.prevent class="w-full max-w-lg pr-3 mx-auto p-5">
        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-name">
              Name
            </label>
            <input
                v-model="token.name"
                class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-name" type="text" placeholder="My Precious...">
            <p class="text-red-500 text-xs italic">Please fill out this field.</p>
          </div>
          <div class="w-full md:w-1/2 px-3">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-amount">
              Amount
            </label>
            <input
                v-model="token.amount"
                class="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4
                leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-amount" type="number" step="1"
                min="1" max="20"
                placeholder="How many tokens?">
          </div>
        </div>
        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full px-3">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
              Description
            </label>
            <textarea
                v-model="token.description"
                class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-password" placeholder="..."></textarea>
            <p class="text-gray-600 text-xs italic">Describe your artwork with maximum 200 characters.</p>
          </div>
        </div>
        <div class="flex flex-wrap -mx-3 mb-2">
          <div class="w-full md:w-2/3 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-external">
              External Link
            </label>
            <input
                v-model="token.external_link"
                class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-external" type="text" placeholder="Detailed page, personal website etc.">
          </div>
          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label class="block uppercase w-full tracking-wide text-gray-700 text-xs font-bold" for="grid-bg">
              Background Color
            </label>
            <div>
              <verte
                  id="grid-bg"
                  class="picker appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  :style="{'background-color': token.background_color}"
                  :picker="'wheel'" :model="'hex'"
                  v-model="token.background_color"/>
            </div>
            <p class="text-xs w-full italic text-yellow-700">This will be used as background/border color.</p>
          </div>
        </div>
      </form>
      <form @submit.prevent class="w-full max-w-lg pr-3 mx-auto p-5">
        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full md:w-2/2 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="trait-name">
              Traits
            </label>
            <div class="flex gap-1 items-center justify-between">
              <input
                  v-model="new_trait_name"
                  class="flex-1 appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-2 leading-tight focus:outline-none focus:bg-white"
                  id="trait-name" type="text" placeholder="Key">
              <input
                  v-model="new_trait_value"
                  class="flex-1 appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-2 leading-tight focus:outline-none focus:bg-white"
                  id="trait-value" type="text" placeholder="Value">
              <button @click="addNewTrait" class="px-5 py-3 mx-auto custom-red radius-xl border text-white">Add Trait
              </button>
            </div>
          </div>
          <div class="w-full h-100 px-3">
            <ul class="w-full flex gap-1 pt-6 items-center justify-start">
              <li class="py-1 px-2 radius-sm shadow-sm text-left bg-gray-200 text-gray-600" :key="trait.key"
                  v-for="(trait,idx) in token.traits">
                <span class="font-bold">{{ trait.key }} </span>
                <span class="text-custom-red">:</span> <span
                  class="font-bold">{{ trait.value }}</span>
                <span @click="removeTrait(idx)"><i class="fa fa-times text-custom-red cursor-pointer"></i></span>
              </li>
            </ul>
          </div>
        </div>
        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full px-3">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
              Price
            </label>
            <input
                v-model="token.price"
                class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-price" type="number" min="1" max="1" placeholder="..."/>
          </div>
        </div>
        <div class="flex -mx-3 mb-6">
          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-select">
              Is this part of a collection?
            </label>
            <input
                v-model="is_collection"
                type="checkbox"
                class="select form-checkbox custom-red h-5 w-5 text-pink-600 block mt-3"
                id="is_collection">
          </div>
          <div class="w-full px-3" v-if="is_collection">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-collection">
              Collection Name
            </label>
            <select
                v-if="collections.length>0"
                v-model="token.collection_id"
                class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-collection">
              <option :value="collectionDTO.id" :key="collectionDTO.id" v-for="collectionDTO in collections">{{
                  collectionDTO.collection.name
                }}
              </option>
            </select>
            <div v-else class="w-full">
              <button @click="createCollection" class="px-3 py-2 mx-auto custom-red radius-xl border text-white">
                Create New Collection
              </button>
              <p class="text-sm text-gray-400 mt-1">Looks like you don't have any collection yet.</p>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap -mx-3 mb-2">
          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-select">
              On Sale
            </label>
            <input
                v-model="on_sale"
                type="checkbox"
                class="select form-checkbox custom-red h-5 w-5 text-pink-600 block mt-3"
                id="grid-select">
            <p class="text-gray-400 text-xs mt-2">You can always put it on sale.</p>
          </div>
          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-audio">
              Music / Audio
            </label>
            <input
                v-model="is_audio"
                type="checkbox"
                class="select form-checkbox custom-red h-5 w-5 text-pink-600 block mt-3"
                id="grid-audio">
          </div>
          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0"
               v-if="is_audio"
          >
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
              Genre
            </label>
            <div class="relative">
              <select
                  v-model="token.genre"
                  class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-state">
                <option :key="genre" v-for="genre in genres">{{ genre }}</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div v-show="step==2" class="mx-auto flex-col flex items-center justify-content-center is-full">
      <!-- component -->
      <div class="overflow-hidden relative w-64 mt-4 mb-4">
        <button @click="$refs.imageFile.click()"
                class="custom-red hover:bg-indigo-dark text-white font-bold py-2 px-4 w-full inline-flex items-center">
          <svg fill="#FFF" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
          </svg>
          <span class="ml-2">Select NFT Visual</span>
          <p class="text-xs text-gray-100">
            (Max. 9mb)
          </p>
        </button>
        <input :ref="'imageFile'" class="cursor-pointer absolute block opacity-0 pin-r pin-t" type="file"
               name="vacancyImageFiles"
               @change="pickImageFile"
               multiple>
      </div>
      <img :src="imageFilePreview" v-if="imageFilePreview" width="300" class="m-2 mb-5">

    </div>
    <div class="is-full container flex items-center justify-center mx-auto">
      <button
          v-if="$store.state.createStep > 1"
          @click="prevStep"
          class="shadow-md hover:text-purple-500 transition duration-200 hover:scale-110 transform border border-purple-100 px-5 py-2 text-gray-600">
        <i class="fa fa-chevron-left mr-1"></i>Previous
      </button>
      <button
          v-if="$store.state.createStep == 2"
          @click="mintToken"
          class="shadow-md hover:text-red-700 transition duration-200 hover:scale-110 transform border border-purple-100 px-5 py-2 ml-2 text-gray-600">
        Mint<i class="fa fa-chevron-right ml-1"></i></button>
      <button
          v-if="$store.state.createStep <2"
          @click="nextStep"
          class="shadow-md hover:text-red-700 transition duration-200 hover:scale-110 transform border border-purple-100 px-5 py-2 ml-2 text-gray-600">
        Next<i class="fa fa-chevron-right ml-1"></i></button>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import verte from 'verte'
import 'verte/dist/verte.css';
import Genres from "@/helpers/genres.json";
import {utils} from 'near-api-js'
import {toBase64} from '@/helpers/toBaseUrl'
import {uploadFile} from "@/helpers/uploader";
import {constants} from "@/helpers/constants";

export default {
  name: "CreateForm",
  components: {
    verte
  },
  data() {
    return {
      token: {
        name: "",
        description: "",
        background_color: "#ff0000",
        amount: 1,
        genre: null,
        external_link: "",
        traits: [],
        collection_id: null,
      },
      new_trait_name: "",
      new_trait_value: "",
      on_sale: true,
      is_audio: false,
      genres: null,
      is_collection: false,
      collections: [],
      imageFile: null,
      mediaFile: null,
      imageFilePreview: null
    }
  },
  computed: {
    step() {
      return this.$store.getters.getStep
    }
  },
  watch: {
    is_collection(val) {
      if (val === true) {
        if (this.token.amount > 1) {
          Swal.fire({
            title: "Warning",
            description: "Collection NFT's cannot batch minted."
          })
          this.token.amount = 1
        }
      }
    }
  },
  methods: {
    removeTrait(i) {
      this.token.traits.splice(i, 1)
    },
    async pickImageFile(e) {
      const file = e.target.files[0]
      const data = await toBase64(file)
      this.imageFilePreview = data
      this.imageFile = file
    },
    addNewTrait() {
      if (this.new_trait_name.length == 0 || this.new_trait_value.length == 0) return;
      const newTrait = {
        key: this.new_trait_name.toString(),
        value: this.new_trait_value.toString(),
      }
      this.token.traits.push(newTrait)
      this.new_trait_name = ""
      this.new_trait_value = ""
    },
    nextStep() {
      this.$store.commit('increaseStep')
    },
    prevStep() {
      this.$store.commit('decreaseStep')
    },
    createCollection() {
      Swal.fire({
        title: "Create New Collection",
        text: "Are you sure you want to leave this page? You will be redirected to collections page.",
        icon: "question",
        showCancelButton: true
      }).then((response) => {
        if (response.value) {
          this.$router.push('/create/collection')
        }
      })
    },
    validate() {
      console.log(this.token)
      if (this.is_collection) {
        if (this.token.collection_id === null) {
          return false;
        }
      }
      return !(this.token.name.length === 0 || this.token.description.length === 0);
    },
    async mintToken() {
      if (!this.token.price || this.token.price < 1) {
        Swal.fire({
          title: "Warning!",
          text: "Price cannot be zero.",
          icon: "warning",
        })
        return
      }
      console.log(this.token)
      if (this.token.amount < 1 || this.token.amount > 10) {
        Swal.fire({
          title: "Warning!",
          text: "You can mint maximum 10 tokens.",
          icon: "warning",
        })
        return
      }
      if (!this.validate()) {
        Swal.fire({
          title: "Warning!",
          text: "Please fill the all required fields. A token must have a valid name, description and collection name if it is part of a collection",
          icon: "warning",
        })
        return
      }
      if (!this.imageFile) {
        Swal.fire({
          title: "Warning!",
          text: "Please select at least the image file.",
          icon: "warning",
        })
        return
      }

      const {path: ImageLink} = await uploadFile(this.imageFile)
      if (!ImageLink) {
        Swal.fire({
          title: "Error!",
          text: "There was an error while upload. Please try again..",
          icon: "error",
        })
        return
      }

      const token = {
        name: this.token.name,
        description: this.token.description,
        image_url: ImageLink,
        background_color: this.token.background_color,
        genre: this.token.genre,
        file: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
        external_link: this.token.external_link,
        traits: this.token.traits,
        collection_id: this.is_collection ? this.token.collection_id : 0,
        on_sale: this.on_sale,
        price: await utils.format.parseNearAmount(this.token.price)
      }
      if (this.token.amount > 1) {
        const fee = constants.account_update_fee * this.token.amount;
        const formatted = await utils.format.parseNearAmount(fee.toString(),)
        window.contract.batch_mint_payment({
          name: token.name,
          description: token.description,
          image_url: token.image_url,
          background_color: token.background_color,
          genre: token.genre,
          file: token.file,
          external_link: token.external_link,
          traits: token.traits,
          collection_id: token.collection_id,
          on_sale: token.on_sale ? '1' : null,
          price: token.price,
          amount: parseInt(this.token.amount)
        }, constants.gas, formatted)
            .then((response) => {
              console.log(response)
            }).catch((error) => console.log(error))
      } else {
        const formatted = await utils.format.parseNearAmount(constants.mint_fee.toString())
        window.contract.mint_payment({
          name: token.name,
          description: token.description,
          image_url: token.image_url,
          background_color: token.background_color,
          genre: token.genre,
          file: token.file,
          external_link: token.external_link,
          traits: token.traits,
          collection_id: token.collection_id,
          on_sale: token.on_sale ? '1' : null,
          price: token.price
        }, constants.gas, formatted)
            .then((response) => {
              console.log(response)
            }).catch((error) => console.log(error))
      }

    }
  },

  created() {
    this.genres = Genres.sort((prev, next) => {
      if (prev > next) return 1
      else if (prev < next) return -1
      return 0
    })
    const link = `https://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?slug=NEAR`
  },
  mounted() {
    window.contract.get_collections_by_account_id({account_id: window.accountId}).then(res => {
      console.log(res)
      this.collections = res
      this.$store.dispatch('loader', false)
    }).catch((error) => console.log(error))
    this.$store.dispatch('loader', true)
  },
  beforeDestroy() {
    this.$store.commit('resetStep')
  }
}
</script>

<style>

.picker > button {
  width: 100%;
  height: 30px;
}

.picker button svg {
  display: none;
}
</style>
