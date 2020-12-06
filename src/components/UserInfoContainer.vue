<template>
  <div class="info text-white cursor-pointer" :class="mobile? 'block md:hidden px-4 py-2 ' : 'hidden md:block '">
    <p class="px-1 text-sm flex items-center justify-between" v-if="ethereum && ethereum.selectedAddress"
       :class="mobile? 'flex items-center justify-between px-1' : ''">
      <i
          class="fab fa-ethereum justify-between mr-auto"
          style="font-size: 18px;"
          :class="mobile? 'text-black ' : ''"
      ></i>
      <span
          class="text-xs"
          :class="mobile? 'text-black ' : ''"
      >
              {{
          ethereum && ethereum.selectedAddress ? ethereum.selectedAddress.substring(0, user && user.length ? user.length - 3 : 0) + '...' : ''
        }}
            </span>
    </p>
    <p class="text-sm flex items-center justify-between px-1"
       :class="mobile? 'text-black ' : ''"
    >
      <img :src="require('@/assets/near.logo.svg')"/>
      <span class="text-xs"
      >{{ user }}</span></p>
    <p v-if="threeBoxUser" class="text-sm flex items-center justify-between px-1"
       :class="mobile? 'text-black ' : ''"
    >
      <img width="14" src="https://gblobscdn.gitbook.com/spaces%2F-LhO2_ejGQCK7k9RNsZc%2Favatar.png?alt=media"
           alt="3box">
      <span class="text-xs"
      >{{ threeBoxUser.name }}</span>
    </p>
  </div>
</template>

<script>
export default {
  name: "UserInfoContainer",
  props: {
    mobile: Boolean
  },
  computed: {
    ethereum() {
      if (window.ethereum) {
        return window.ethereum
      } else return null
    },
    auth() {
      return window.walletConnection.isSignedIn()
    },
    user() {
      if (this.$store.getters['auth/getAuth']) {
        return this.$store.getters['auth/getUser']
      }
      return window.accountId
    },
    threeBoxUser() {
      return this.$store.getters['get3Box']
    }
  }
}
</script>

<style scoped>

.info {
  width: 170px
}

i, img {
  background: white;
  color: black;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  font-size: 16px;
  border-radius: 50%;
  padding: 4px;
}
</style>
