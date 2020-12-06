<template>
  <div id="root">
    {{isLoading  ? 'true' : 'false'}}
    <Navigation/>
    <router-view/>
    <Loader v-if="isLoading"></Loader>
    <Footer></Footer>
  </div>
</template>

<script>
import "./global.css"
import Navigation from "@/components/Nav";
import Loader from "@/components/Loader";
import Footer from "@/components/Footer";

export default {
  name: "App",
  components: {
    Navigation,
    Loader,
    Footer
  },
  computed: {
    isSignedIn() {
      return window.walletConnection.isSignedIn()
    },
    isLoading(){
      return this.$store.getters.getLoading
    }
  },
  methods: {
    async threeBox() {
      if (window.ethereum && window.ethereum.selectedAddress) {
        const profile = await Box.getProfile(window.ethereum.selectedAddress)
        console.log(profile)
        const box = await Box.openBox(window.ethereum.selectedAddress, window.ethereum)
        await this.$store.dispatch('set3Box', profile)
      }
    }
  },
  watch: {
    isSignedIn(val) {
      console.log(val)
      if (val === true) {
        this.$store.dispatch('auth/login', window.accountId)
        this.threeBox()
      }
    }
  },
  mounted() {
    if (this.isSignedIn) {
      if (window.ethereum && !window.ethereum.selectedAddress) {
        window.ethereum.enable().then(() => {
        })
        this.threeBox()
        return
      }
      this.threeBox()
    }
  }
}
</script>

<style>

@-webkit-keyframes hue {
  0% {
    stroke: red;
  }
  33% {
    stroke: deeppink;
  }
  50% {
    stroke: darkblue;
  }
  66% {
    stroke: greenyellow;
  }
  100% {
    stroke: red;
  }
}

@keyframes hue {
  0% {
    stroke: red;
  }
  33% {
    stroke: deeppink;
  }
  50% {
    stroke: darkblue;
  }
  66% {
    stroke: greenyellow;
  }
  100% {
    stroke: red;
  }
}

@-webkit-keyframes fill {
  0% {
    fill: red;
  }
  33% {
    fill: deeppink;
  }
  66% {
    fill: greenyellow;
  }
  99% {
    fill: black;
  }
}

@keyframes fill {
  0% {
    fill: darkred;
  }
  10% {
    fill: deeppink;
  }
  20% {
    fill: greenyellow;
  }
  30% {
    fill: purple;
  }
  40% {
    fill: deeppink;
  }
  50% {
    fill: greenyellow;
  }
  60% {
    fill: cyan;
  }
  70% {
    fill: rebeccapurple;
  }
  80% {
    fill: greenyellow;
  }
  90% {
    fill: #88cffc;
  }
  100% {
    fill: black;
  }
}


.nav-custom-red {
  background-color: #782634 !important;
  z-index: 9999;
}
.custom-red{
  background-color: #782634 !important;
}
</style>
