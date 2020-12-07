<template>
  <div class="flex loader flex-col items-center justify-center w-full fixed">
    <p class="font-major lowercase text-4xl">LOADING</p>
    <div>
      <div class="lds-circle">
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Loader",
}
</script>

<style scoped>
.loader {
  z-index: 99999999;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
}

.lds-circle {
  display: inline-block;
  transform: translateZ(1px);
}

.lds-circle > div {
  display: inline-block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  background: #fff;
  animation: lds-circle 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

@keyframes lds-circle {
  0%, 100% {
    animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
  }
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(1800deg);
    animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
  }
  100% {
    transform: rotateY(3600deg);
  }
}

</style>
