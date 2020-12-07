<template>
  <div class="w-100">
    <div class="bg-gray-100 container md:mx-auto py-8 max-w-full">
      <h1 class="font-major lowercase text-gray-700 my-4 items-center justify-center text-5xl font-bold leading-tight text-center">
        ACCOUNT </h1>
      <p class="text-center w-100 text-gray-700 text-sm">These is what will others see when they visit your profile. All data
        is stored on-chain. You will have to pay gas + storage price. </p>
    </div>
    <div class="container mx-auto">
      <form @submit.prevent="" class="w-full max-w-lg pr-3 mx-auto p-5">
        <label class="hidden block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-file">
          Profile Photo
        </label>
        <input
            :ref="'pp'"
            @change="setPP"
            type="file"
            class="hidden appearance-none block w-full bg-gray-200 text-gray-700 border
                rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            id="grid-file" placeholder="My Precious...">
        <div class="text-center my-2">
          <img width="125" class="rounded-full mx-auto" :src="currentImage ? currentImage : imgData"
               v-if="currentImage || imgData" alt="">
          <button
              class="transition mt-2 duration-300 mx-auto px-5 py-2 custom-red text-gray-100 hover:text-white transform hover:scale-110 hover:shadow-md"
              @click="photoChanger">Change Photo<i class="fa fa-camera ml-1"></i></button>
          <p class="text-xs text-custom-red my-2 font-bold">Do not select new image, if you don't want to change your photo</p>
        </div>
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
          Description
        </label>
        <textarea
            maxlength="60"
            v-model="description"
            :class="description.length==0 ? 'border-red-500' : ''"
            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-password" placeholder="..."></textarea>
        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full md:w-100 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-description">
              Website
            </label>
            <input
                maxlength="30"
                v-model="website"
                :class="website.length==0 ? 'border-red-500' : ''"
                type="text"
                class="appearance-none block w-full bg-gray-200 text-gray-700 border
                rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-description" placeholder="...">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-description">
              Instagram
            </label>
            <input
                maxlength="25"
                v-model="instagram"
                :class="instagram.length==0 ? 'border-red-500' : ''"
                type="text"
                class="appearance-none block w-full bg-gray-200 text-gray-700 border
                rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-instagram" placeholder="...">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-description">
              Twitter
            </label>
            <input
                maxlength="25"
                v-model="twitter"
                type="text"
                :class="twitter.length==0 ? 'border-red-500' : ''"
                class="appearance-none block w-full bg-gray-200 text-gray-700 border
                rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-twitter" placeholder="...">
          </div>
          <button @click="updateProfile" class="px-3 py-2 mx-auto custom-red radius-xl border text-white">
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {toBase64} from '@/helpers/toBaseUrl'
import uploader from "@/helpers/uploader";
import Swal from 'sweetalert2'
import {utils} from "near-api-js";
import {constants} from "@/helpers/constants";

export default {
  name: "account",
  data: () => ({
    changePhoto: false,
    website: "",
    description: "",
    instagram: "",
    twitter: "",
    image: null,
    imgData: null,
    currentImage: ""
  }),
  methods: {
    async setPP(e) {
      this.image = e.target.files[0];
      this.imgData = await toBase64(this.image)
    },
    async updateProfile() {
      let PP;
      if (this.image) {
        try {
          this.$store.dispatch('loader', true)
          PP = await uploader(this.image);
          this.$store.dispatch('false', true)
        } catch (e) {
          Swal.fire({
            title: "There was an error while uploading file. Please try again.",
            icon: "error"
          })
        }
      }
      const payload = {
        pp: PP && PP.data ? PP.data : this.currentImage,
        website: this.website,
        description: this.description,
        instagram: this.instagram,
        twitter: this.twitter
      }
      await window.contract.update_account_details(payload, constants.gas, utils.format.parseNearAmount(constants.account_update_fee.toString())).then(response => {
        location.reload();
      }).catch(error => {
        Swal.fire({
          title: "You are being redirected to your wallet.",
          icon: "warning"
        })
      })
    },
    uploader: uploader,
    photoChanger() {
      this.changePhoto = true
      this.$refs.pp.click()
    }
  },
  async beforeMount() {
    try {
      const userData = await window.contract.get_account_details({accountId: window.accountId})
      if (userData) {
        this.currentImage = userData.pp
        this.twitter = userData.twitter
        this.instagram = userData.instagram
        this.description = userData.description
        this.website = userData.website
      }
    } catch (e) {

    }
  }
}
</script>

<style scoped>

</style>
