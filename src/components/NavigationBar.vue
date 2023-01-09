<script setup lang="ts">
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import { AxiosError } from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";
import AuthenticationService from "../services/AuthenticationService";

const router = useRouter();

const isLoggedIn = ref<boolean>(false);
const username = ref<string>("");

const navigation = [
  { name: "Logout", href: "/logout", current: true },
];


onMounted(async () => {
  const response = await AuthenticationService.GetUserInfo();
  if (!(response instanceof AxiosError)) {
    isLoggedIn.value = true;
    username.value = response.data.user.username;
  } else {
    router.push("/login");
  }
  } 
);
</script>

<template>
  <Disclosure v-slot="{ open }" as="nav" class="bg-gray-800 sticky top-0">
    <div class="mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <DisclosureButton
            class="
              inline-flex
              items-center
              justify-center
              rounded-md
              p-2
              text-gray-400
              hover:bg-gray-700 hover:text-white
              focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white
            "
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
        <div
          class="
            flex flex-1
            items-center
            justify-center
            sm:items-stretch sm:justify-start
          "
        >
          <div class="flex flex-shrink-0 items-center">
            <p
              class="
                font-['Open_Sans']
                font-semibold
                text-xl text-gray-100
                align-middle
              "
            >
              WP-3
            </p>
          </div>
        </div>
        <div
          class="
            absolute
            inset-y-0
            right-0
            flex
            items-center
            pr-2
            sm:static sm:inset-auto sm:ml-6 sm:pr-0
          "
        >
          <p v-if="isLoggedIn" id="loginname" class="text-white">
            {{ username }}
          </p>
          <Menu as="div" class="relative ml-3">
            <div>
              <MenuButton
                id="optionsButton"
                class="
                  flex
                  rounded-full
                  bg-gray-800
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-white
                  focus:ring-offset-2
                  focus:ring-offset-gray-800
                "
              >
                <span class="sr-only">Open user menu</span>
                <img
                  class="h-8 w-8 rounded-full"
                  src="https://cdn-icons-png.flaticon.com/512/667/667416.png?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </MenuButton>
            </div>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="
                  absolute
                  right-0
                  z-10
                  mt-2
                  w-48
                  origin-top-right
                  rounded-md
                  bg-white
                  py-1
                  shadow-lg
                  ring-1 ring-black ring-opacity-5
                  focus:outline-none
                "
              >
                
                <MenuItem id="logoutItem" v-slot="{ active }">
                  <a
                    href="/logout"
                    class="block px-4 py-2 text-sm text-gray-700"
                    :class="[active ? 'bg-gray-100' : '']"
                    >Logout</a
                  >
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 pt-2 pb-3">
        <DisclosureButton
          v-for="item in navigation"
          :key="item.name"
          as="a"
          :href="item.href"
          class="block px-3 py-2 rounded-md text-base font-medium"
          :class="[
            item.current
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
          ]"
          :aria-current="item.current ? 'page' : undefined"
        >
          {{ item.name }}
        </DisclosureButton>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>
