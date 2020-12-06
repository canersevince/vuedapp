<template>
  <div class="py-24 px-8 mx-auto container">
    <div class="grid grid-cols-12 gap-2">
      <div class="flex items-center justify-content-between col-span-6">
        <input v-model="minter" type="text" class="px-8 py-3 border" placeholder="Add Minter"/>
        <button @click="addMinter" class="custom-red text-white py-3 px-8">Add</button>
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
      minters: []
    }
  },
  methods: {
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
  }
}
</script>

<style scoped>

</style>
