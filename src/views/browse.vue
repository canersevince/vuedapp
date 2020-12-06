<template>
  <div class="w-100">
    <div class="bg-gray-100 container md:mx-auto py-8 max-w-full">
      <h1 class="font-major lowercase my-4 items-center justify-center text-5xl font-bold leading-tight text-center">
        BROWSE </h1>
    </div>
    <div class="container mx-auto py-16">
      <div class="grid grid-cols-12 ">
        <div class="bg-gray-100 col-span-12 shadow-md md:col-span-3 border rounded-md border-grey-100">
          <h1 class="mx-auto uppercase text-gray-600 text-center text-xl font-bold mt-2">Filters</h1>
          <GenreFilter/>
        </div>
        <div class="col-span-12 lg:col-span-9 gap-1 px-5">
          <div class="grid grid-cols-12 gap-2">
            <div class="col-span-4">
              <TokenCard/>
            </div>
            <div class="col-span-4">
              <TokenCard/>
            </div>
            <div class="col-span-4">
              <TokenCard/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import TokenCard from "@/components/TokenCard";
import GenreFilter from "@/components/GenreFilter";

export default {
  name: "browse",
  components: {GenreFilter, TokenCard}
}
</script>

<style scoped>

</style>
