<script setup lang="ts">
import { useHead } from '@vueuse/head'
import AuthenticationService from "../services/AuthenticationService";
import { useRouter } from 'vue-router'

const router = useRouter()

useHead({
  title: 'Logout',
  meta: [
    {
      name: 'logout',
      content: 'Logout',
    },
  ],

})

onMounted(() => {
  AuthenticationService.DoLogout()
  sessionStorage.clear()
  router.push("/login");
})
</script>
