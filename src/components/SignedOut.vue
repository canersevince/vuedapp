<template>
  <main>
    <button @click="login()">Login</button>
  </main>
</template>

<script>
import {login} from "../utils"

export default {
  name: "SignedOut",

  methods: {
    login() {
      console.log("calling utils.login")
      login()
    },
  },
}
</script>
