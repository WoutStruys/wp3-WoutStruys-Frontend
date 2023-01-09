<script setup lang="ts">

</script>


<template>
    <NavigationBar />
    <main>
      <Sidebar />
      <div id="side">
        <slot />
      </div>
    </main>
</template>