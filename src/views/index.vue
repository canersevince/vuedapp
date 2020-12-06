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
      <div class="relative w-full md:w-2/5 text-center p-8">
        <img class="object-cover object-center main-svg" :src="require('@/assets/main-2.svg')" alt="">
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
.main-svg {
  transform: scale(2);
}
</style>
