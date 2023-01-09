<script setup lang="ts">
import { ref } from 'vue'
import { AxiosError } from "axios";
import { useSidebar } from '../hooks/useSidebar'
import AuthenticationService from "../services/AuthenticationService";
import template from '../plugins/svg-transformer/template';

const { isOpen } = useSidebar()
const activeClass = ref(
  'bg-gray-800 bg-opacity-25 text-gray-100 border-gray-100',
)
const inactiveClass = ref(
  'border-gray-900 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100',
)


const router = useRouter();

const isLoggedIn = ref<boolean>(false);
const username = ref<string>("");

const navigation = [
  { name: "Settings", href: "/settings", current: true },
  { name: "Logout", href: "/logout", current: true },
];

onMounted(async () => {
  const response = await AuthenticationService.GetUserInfo();
  if (!(response instanceof AxiosError)) {
    isLoggedIn.value = true;
    username.value = response.data.user.username;
    if (response.data.user.roles[0] == "user") {
      document.getElementById("usersRouterLink").style.display = "none";
      document.getElementById("tasksRouterLink").style.display = "none";
    }
  } else {
    router.push("/login");
  }
  } 
);

</script>

<template>
  <div class="flex h-screen fixed">
    <div
      id="sidebar"
      :class="isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
      class="top-0 inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-gray-900 lg:translate-x-0 lg:static lg:inset-0"
    >
      <div class="flex items-center justify-center mt-8">
        <div class="flex items-center">
          <img id="cloud7Image" alt="logo" style="width: 80px" src="../assets/mongo.png">
        </div>
      </div>

      <nav class="mt-10">

        <router-link
          id="homeRouterLink"
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'home' ? activeClass : inactiveClass]"
          to="/"
        >
          <Home class="w-5 h-5" />

          <span class="mx-4">Home</span>
        </router-link>

        <router-link
          id="usersRouterLink"
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'users' ? activeClass : inactiveClass]"
          to="/users"
        >
          <Person class="w-5 h-5" />

          <span class="mx-4">Users</span>
        </router-link>

        <router-link
          id="tasksRouterLink"
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'tasks' ? activeClass : inactiveClass]"
          to="/tasks"
        >
          <Home class="w-5 h-5" />

          <span class="mx-4">Tasks</span>
        </router-link>

      </nav>
    </div>
  </div>
</template>

  <style scoped>
  @media only screen and (min-width: 1024px) {
    #sidebar {
      width: 16vw !important;
    }
  }
  </style>

