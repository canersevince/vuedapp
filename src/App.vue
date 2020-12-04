<template>
  <div id="root">
    <router-view />
  </div>
</template>

<script>
import "./global.css"
export default {
  created() {
    document.title = "nft-2"
  },
  name: "App",
  components: {
  },

  computed: {
    isSignedIn() {
      return window.walletConnection.isSignedIn()
    },
  },
}
</script>

