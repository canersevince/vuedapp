<template>
  <div class="container bg-gray-50 p-8 max-w-full">
    <div class="sm:flex mb-4">
      <div class="sm:w-1/4 h-auto">
        <div class="text-yellow-500 mb-2">Menu1</div>
        <ul class="list-reset leading-normal">
          <li class="hover:text-yellow-500 text-gray-700">One</li>
          <li class="hover:text-yellow-500 text-gray-700">Two</li>
          <li class="hover:text-yellow-500 text-gray-700">Three</li>
        </ul>
      </div>
      <div class="sm:w-1/4 h-auto sm:mt-0 mt-8">
        <div class="text-blue-500 mb-2">Menu2</div>
        <ul class="list-reset leading-normal">
          <li class="hover:text-blue-500 text-gray-700">One</li>
          <li class="hover:text-blue-500 text-gray-700">Two</li>
          <li class="hover:text-blue-500 text-gray-700">Three</li>
        </ul>

        <div class="text-blue-600 mb-2 mt-4">Menu3</div>
        <ul class="list-reset leading-normal">
          <li class="hover:text-blue-500 text-gray-700">One</li>
          <li class="hover:text-blue-500 text-gray-700">Two</li>
          <li class="hover:text-blue-500 text-gray-700">Three</li>
        </ul>

      </div>
      <div class="sm:w-1/4 h-auto sm:mt-0 mt-8">
        <div class="text-green-700 mb-2">Menu4</div>
        <ul class="list-reset leading-normal">
          <li class="hover:text-green-700 text-gray-700">One</li>
          <li class="hover:text-green-700 text-gray-700">Two</li>
          <li class="hover:text-green-700 text-gray-700">Three</li>
        </ul>

        <div class="text-green-500 mb-2 mt-4">Menu5</div>
        <ul class="list-reset leading-normal">
          <li class="hover:text-green-500 text-gray-700">One</li>
          <li class="hover:text-green-500 text-gray-700">Two</li>
          <li class="hover:text-green-500 text-gray-700">Three</li>
        </ul>
      </div>
      <div class="sm:w-1/2 sm:mt-0 mt-8 h-auto">
        <div class="text-red-500 mb-2">Newsletter</div>
        <p class="text-gray-700 leading-normal">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi,
          consectetur. </p>
        <div class="mt-4 flex">
          <input type="text" class="p-2 border border-gray-500 round text-gray-dark text-sm h-auto"
                 placeholder="Your email address">
          <button class="bg-orange text-white rounded-sm h-auto text-xs p-3">Subscribe</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "Footer"
}
</script>

<style scoped>

</style>
