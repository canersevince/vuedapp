<template>
  <div class="overflow-hidden rounded-md shadow-md">
    <a href="#">
      <img alt="Placeholder" class="block h-auto w-full" src="https://picsum.photos/600/400/?random">
    </a>

    <header class="flex items-center justify-between leading-tight p-1 md:p-2">
      <h1 class="text-lg">
        <a class="no-underline hover:underline text-black text-sm" href="#">
          Some NFT
        </a>
      </h1>
      <p class="text-grey-darker text-xs">
        14/4/20
      </p>
    </header>

    <footer class="flex items-center justify-between leading-none p-2 md:p-4">
      <a class="flex items-center no-underline hover:underline text-black" href="#">
        <img alt="Placeholder" class="block rounded-full" src="https://picsum.photos/32/32/?random">
        <p class="ml-2 text-sm">
          Author Name
        </p>
      </a>
      <a class="no-underline text-grey-darker hover:text-red-dark" href="#">
        <span>15 <strong>Ⓝ</strong></span>
      </a>
    </footer>

  </div>
</template>
<script>
export default {
  name: "TokenCard"
}
</script>

<style scoped>

</style>
