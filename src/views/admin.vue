<template>
  <div class="py-24 px-8 mx-auto container">
    <div class="grid grid-cols-12 gap-2">
      <div class="col-span-6 admin">
        <div class="flex items-center justify-content-between col-span-6">
          <input v-model="minter" type="text" class="px-8 py-3 border" placeholder="ADD MINTER"/>
          <button @click="addMinter" class="custom-red text-white py-3 px-8">ADD</button>
        </div>
        <div class="flex items-center justify-content-between col-span-6">
          <input v-model="fee" type="text" class="px-8 py-3 border" placeholder="SET FEE"/>
          <button @click="setFee" class="custom-red text-white py-3 px-8">FEE %</button>
        </div>
      </div>
      <div class="col-span-6 border p-2">
        <h1 class="text-xl font-bold font-major">Artists:</h1>
        <ul class="list list-reset list-none">
          <li v-for="minter in minters" :key="minter"
              class="py-1 my-1text-sm font-bold font-major flex items-center justify-between">
            <router-link :to="'profile/'+minter" class>{{ minter }}</router-link>
            <i class="cursor-pointer bg-gray-200 radius fa fa-times p-2 text-red-500"></i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'

export default {
  name: "admin",
  data() {
    return {
      minter: "",
      minters: [],
      fee: null
    }
  },
  methods: {
    setFee() {
      const fee = 100/this.fee
      window.contract.set_fee({payload: fee}).then(res => {
        console.log(res)
        Swal.fire({
          title: "Fee has been set!",
          icon: "success"
        })
      }).catch(err  => {
        console.log(err)
      })
    },
    addMinter() {
      window.contract.add_minter({minter: this.minter}).then(res => {
        Swal.fire({
          title: "Added new minter: " + this.minter,
          icon: "success"
        })
      }).catch(err => {
        console.log(err)
        Swal.fire({
          title: "Error while adding new minter: " + this.minter,
          icon: "error"
        })
      })
    }
  },
  mounted() {
    window.contract.get_all_minters().then(res => {
      this.minters = res
      console.log(res)
    }).catch(err => console.log(err))
    window.contract.get_fee().then(res => {
      this.fee = 100/res
      console.log(res)
    }).catch(err => console.log(err))
  }
}
</script>

<style scoped>
.admin div button {
  min-width: 100px;
}
</style>
