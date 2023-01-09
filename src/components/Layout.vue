<template>
    <NavigationBar />
    <main>
      <Sidebar />
      <div class="z-10" id="side">
        <slot />
      </div>
    </main>
</template>