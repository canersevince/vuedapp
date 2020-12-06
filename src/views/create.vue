<template>
  <div class="container mx-auto flex flex-col">
    <CreateStep/>
    <CreateForm/>
  </div>
</template>

<script>
import CreateStep from "@/components/CreateStep";
import CreateForm from "@/components/CreateForm";

export default {
  name: "create",
  components: {CreateForm, CreateStep}
}
</script>

<style scoped>

</style>
