<template>
  <div>
    <h3 v-if="this.price">{{ this.price }}N</h3>
    <h3 v-else>Not for sale</h3>
  </div>
</template>

<script>
import {utils} from 'near-api-js'

export default {
  name: "Sale",
  props: {
    tokenId: Number
  },
  data() {
    return {
      price: null
    }
  },
  created() {
    window.contract.get_price({token_id: this.tokenId}).then(res => {
      console.log(res)
      if (res) {
        this.price = utils.format.formatNearAmount(res)
        this.$emit('loaded', this.price)
      }
    }).catch(err => console.log(err))
  }
}
</script>

<style scoped>

</style>
