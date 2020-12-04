<template>
  <div>
    <Navigation/>
    <SignedOut v-show="!isSignedIn" />
    <SignedIn v-show="isSignedIn"/>
  </div>
</template>

<script>
import Navigation from "@/components/Nav";
import getConfig from "../config"
import SignedOut from "../components/SignedOut.vue"
import SignedIn from "../components/SignedIn.vue"

const nearConfig = getConfig(process.env.NODE_ENV || "development")
console.log(
    `networkId:${nearConfig.networkId} CONTRACT_NAME:${nearConfig.contractName}`
)
window.networkId = nearConfig.networkId

export default {
  name: "index",
  components: {
    Navigation, SignedIn, SignedOut,
  },
  computed: {
    isSignedIn() {
      return window.walletConnection.isSignedIn()
    },
  }
}
</script>

<style scoped>

</style>
