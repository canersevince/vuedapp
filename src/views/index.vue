<template>
  <div class="pt-12 relative min-h-screen min-w-screen bg-gray-100 overflow-hidden">
    <Background/>
    <div class="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
      <!--Left Col-->
      <div
          class="flex flex-col w-full md:w-3/5 justify-center items-start text-center md:text-left bg-gray-200 py-2 px-5 radius-50 shadow-md">
        <p class="font-major text-md">your digital museum on neaR.</p>
        <h1 class="my-4 items-center justify-center text-5xl font-bold leading-tight">
          Collect digital art and music on NEAR <span class="p-1">
          <img class="inline-block" width="25"
               :src="require('@/assets/near.logo.svg')"
               alt=""></span>
        </h1>
        <p class="uppercase font-light text-md leading-normal mb-8">
          Login with your near wallet, link your ETH and 3BOX address, start collecting now.
        </p>
        <button
            @click="$router.push('/browse')"
            class="mx-auto lg:mx-0 hover:underline hover:bg-gray-100 hover:text-gray-900 bg-white text-gray-800 font-bold rounded-full
            my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
          Start Collecting
        </button>
      </div>
      <!--Right Col-->
      <div class="relative w-full md:w-2/5 py-6 text-center p-8">
        <svg class="opacity-0 svg object-fit-cover" version="1.1" id="Layer_1"
             xmlns="http://www.w3.org/2000/svg"
             xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             viewBox="0 0 90.1 90" style="enable-background:new 0 0 90.1 90;" xml:space="preserve">
<path d="M72.2,4.6L53.4,32.5c-1.3,1.9,1.2,4.2,3,2.6L74.9,19c0.5-0.4,1.2-0.1,1.2,0.6v50.3c0,0.7-0.9,1-1.3,0.5l-56-67
	C17,1.2,14.4,0,11.5,0h-2C4.3,0,0,4.3,0,9.6v70.8C0,85.7,4.3,90,9.6,90c3.3,0,6.4-1.7,8.2-4.6l18.8-27.9c1.3-1.9-1.2-4.2-3-2.6
	l-18.5,16c-0.5,0.4-1.2,0.1-1.2-0.6V20.1c0-0.7,0.9-1,1.3-0.5l56,67c1.8,2.2,4.5,3.4,7.3,3.4h2c5.3,0,9.6-4.3,9.6-9.6V9.6
	c0-5.3-4.3-9.6-9.6-9.6C77.1,0,74,1.7,72.2,4.6z"/>
</svg>
        <svg class="absolute animated svg object-fit-cover" version="1.1" id="Layer_1"
             xmlns="http://www.w3.org/2000/svg"
             xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             viewBox="0 0 90.1 90" style="enable-background:new 0 0 90.1 90;" xml:space="preserve">
<path d="M72.2,4.6L53.4,32.5c-1.3,1.9,1.2,4.2,3,2.6L74.9,19c0.5-0.4,1.2-0.1,1.2,0.6v50.3c0,0.7-0.9,1-1.3,0.5l-56-67
	C17,1.2,14.4,0,11.5,0h-2C4.3,0,0,4.3,0,9.6v70.8C0,85.7,4.3,90,9.6,90c3.3,0,6.4-1.7,8.2-4.6l18.8-27.9c1.3-1.9-1.2-4.2-3-2.6
	l-18.5,16c-0.5,0.4-1.2,0.1-1.2-0.6V20.1c0-0.7,0.9-1,1.3-0.5l56,67c1.8,2.2,4.5,3.4,7.3,3.4h2c5.3,0,9.6-4.3,9.6-9.6V9.6
	c0-5.3-4.3-9.6-9.6-9.6C77.1,0,74,1.7,72.2,4.6z"/>
</svg>
        <svg class="absolute object-fit-cover svg" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
             xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             viewBox="0 0 90.1 90" style="enable-background:new 0 0 90.1 90;" xml:space="preserve">
<path d="M72.2,4.6L53.4,32.5c-1.3,1.9,1.2,4.2,3,2.6L74.9,19c0.5-0.4,1.2-0.1,1.2,0.6v50.3c0,0.7-0.9,1-1.3,0.5l-56-67
	C17,1.2,14.4,0,11.5,0h-2C4.3,0,0,4.3,0,9.6v70.8C0,85.7,4.3,90,9.6,90c3.3,0,6.4-1.7,8.2-4.6l18.8-27.9c1.3-1.9-1.2-4.2-3-2.6
	l-18.5,16c-0.5,0.4-1.2,0.1-1.2-0.6V20.1c0-0.7,0.9-1,1.3-0.5l56,67c1.8,2.2,4.5,3.4,7.3,3.4h2c5.3,0,9.6-4.3,9.6-9.6V9.6
	c0-5.3-4.3-9.6-9.6-9.6C77.1,0,74,1.7,72.2,4.6z"/>
</svg>

      </div>
    </div>
  </div>
</template>

<script>
import getConfig from "../config"
import Background from "@/components/Background";

const nearConfig = getConfig(process.env.NODE_ENV || "development")
console.log(
    `networkId:${nearConfig.networkId} CONTRACT_NAME:${nearConfig.contractName}`
)
window.networkId = nearConfig.networkId

export default {
  name: "index",
  components: {Background},
}
</script>

<style scoped>

.animated {
  animation: fill 5s infinite, shake 5s infinite;
  opacity: .7;
}

.opacity-0 {
  opacity: 0 !important;
}

.svg {
  max-width: 200px;
  transition: 300ms ease;
  margin: 0 auto;
  top: 50%;
  left: 50%;
  fill: black;
  opacity: 0.75;
  transform: translate(-50%, -50%);
}

.svg.animated {
  z-index: 2;
  left: 51%;
  top: 51%;
}


@-webkit-keyframes bounce {
  0%, 20%, 40%, 60%, 80%, 100% {
    -webkit-transform: translateY(0);
  }
  50% {
    -webkit-transform: translateY(-5px);
  }
}

@keyframes bounce {
  0%, 20%, 40%, 60%, 80%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@-webkit-keyframes rotate {
  0% {
    transform: rotate(0)
  }
  100% {
    transform: rotate(360deg)
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0)
  }
  100% {
    transform: rotate(360deg)
  }
}

@keyframes shake {
  0% {
    transform: translate(-51%, -51%) rotate(0deg);
  }
  1% {
    transform: translate(-50%, -51%) rotate(-1deg);
  }
  2% {
    transform: translate(-51%, -50%) rotate(1deg);
  }
  3% {
    transform: translate(-52%, -51%) rotate(0deg);
  }
  4% {
    transform: translate(-51%, -49%) rotate(1deg);
  }
  5% {
    transform: translate(-49%, -50%) rotate(-1deg);
  }
  7% {
    transform: translate(-51%, -51%) rotate(0deg);
  }
  8% {
    transform: translate(-50%, -51%) rotate(-1deg);
  }
  9% {
    transform: translate(-51%, -50%) rotate(1deg);
  }
  10% {
    transform: translate(-52%, -51%) rotate(0deg);
  }
  11% {
    transform: translate(-50%, -50%);
  }
}
</style>
