<template>
  <div class="pt-12">
    <h1 class="mb-4 text-center font-black text-gray-700">MINT NEW NFT</h1>
    <div class="flex">
      <div class="w-1/3 text-center px-6">
        <div
            :class="$store.state.createStep == 1 ? 'custom-red' : 'bg-gray-300'"
            class="rounded-lg flex items-center justify-center border border-gray-200">
          <div class="w-1/3 bg-transparent h-20 flex items-center justify-center icon-step">
            <i class="fa fa-align-center"></i>
          </div>
          <div class="w-2/3 bg-gray-200 h-24 flex flex-col items-center justify-center px-1 rounded-r-lg body-step">
            <h2 class="font-bold text-sm">Token Info</h2>
            <p class="text-xs text-gray-600">
              Token properties and data.
            </p>
          </div>
        </div>
      </div>
      <div class="flex-1 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M14 2h-7.229l7.014 7h-13.785v6h13.785l-7.014 7h7.229l10-10z"/>
        </svg>
      </div>
      <div class="w-1/3 text-center px-6">
        <div :class="$store.state.createStep == 2 ? 'custom-red' : 'bg-gray-300'"
             class="rounded-lg flex items-center justify-center border border-gray-200">
          <div class="w-1/3 bg-transparent h-20 flex items-center justify-center icon-step">
            <i class="fa fa-file"></i>
          </div>
          <div class="w-2/3 bg-gray-200 h-24 flex flex-col items-center justify-center px-1 rounded-r-lg body-step">
            <h2 class="font-bold text-sm">Upload Files</h2>
            <p class="text-xs text-gray-600">
              Anything you want for your credentials
            </p>
          </div>
        </div>
      </div>
      <div class="flex-1 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M14 2h-7.229l7.014 7h-13.785v6h13.785l-7.014 7h7.229l10-10z"/>
        </svg>
      </div>
      <div class="w-1/3 text-center px-6">
        <div :class="$store.state.createStep == 3 ? 'custom-red' : 'bg-gray-300'"
             class="rounded-lg flex items-center justify-center border border-gray-200">
          <div class="w-1/3 bg-transparent h-20 flex items-center justify-center icon-step">
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd">
              <path d="M21 6.285l-11.16 12.733-6.84-6.018 1.319-1.49 5.341 4.686 9.865-11.196 1.475 1.285z"/>
            </svg>
          </div>
          <div class="w-2/3 bg-gray-200 h-24 flex flex-col items-center justify-center px-1 rounded-r-lg body-step">
            <h2 class="font-bold text-sm">Transaction</h2>
            <p class="text-xs text-gray-600">
              Mint it!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateStep"
}
</script>

<style scoped>

</style>
