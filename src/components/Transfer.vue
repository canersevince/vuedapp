<template>
  <div class="transfer-modal transfer-close" @click="close">
    <form @submit.prevent="transferNFT" class="transfer-close">
      <div class="token">
        <h3>{{ token.name }}</h3>
        <img :src="token.image" width="150" alt="">
        <p>Will be transfered.</p>
      </div>
      <p style="color: white;">Receiver:</p>
      <input v-model="receiver" style="padding: .5em 2em; color: #ff9900" type="text"
             placeholder="Enter a valid NEAR address."/>
      <div style="display: flex; justify-content: space-between; width:100%">
        <button @click="transferNFT"
                style="margin-top:1em; padding: .3em 1em; font-size: 14px; background: #ff9900; font-family: sans-serif; border:none; border-radius: 6px; color: white">
          Transfer
        </button>
        <button
            style="margin-top:1em; padding: .3em 1em; font-size: 14px; background: #ff0000; font-family: sans-serif; border:none; border-radius: 6px; color: white"
            @click="$emit('close')">Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "Transfer",
  props: {
    token: {
      type: Object,
      required: true
    },
    tokenId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      receiver: ""
    }
  },
  methods: {
    transferNFT(e) {
      e.preventDefault()
      console.log("transfering token: " + this.tokenId)
      window.contract.transfer({new_owner_id: this.receiver, token_id: this.tokenId}).then(res => {
        console.log(res)
      }).catch(error => console.log(error))
    },
    close(e) {
      console.log(e.target)
      if (e.target.classList.contains('transfer-close')) {
        this.$emit('close')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.transfer-modal {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.75);
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }

  .token {

  }
}
</style>
