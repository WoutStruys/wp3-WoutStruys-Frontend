<script setup lang="ts">
import { ref } from "vue";
import { useHead } from "@vueuse/head";
import AuthenticationService from "../services/AuthenticationService";
import { AxiosError } from "axios";
import { useRouter, useRoute } from "vue-router";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css'
const router = useRouter();
const route = useRoute();

const url = `${import.meta.env.VITE_BACKEND_PROTOCOL}://${
  import.meta.env.VITE_BACKEND_DOMAIN
}:${import.meta.env.VITE_BACKEND_PORT}/auth/google/login`;

useHead({
  title: "Login",
  meta: [
    {
      name: "Login View",
      content: "This is the login page of the application.",
    },
  ],
});

const username = ref<string>("");
const password = ref<string>("");
const errormessage = ref<string>("");

const handleSignIn = async (e: MouseEvent) => {
  e.preventDefault();
  errormessage.value = "";
  const regex = /^[a-zA-Z0-9_]+$/;

  let emailok = false;
  let passwordok = false;

  if (username.value != "") {
    if (!regex.test(username.value)) {
      errormessage.value +=
        "- Username mag enkel letters, cijfers en underscores bevatten.<br>";
    } else {
      emailok = true;
    }
  }

  if (password.value != "") {
    passwordok = true;
  } else {
    errormessage.value += "- Password is verplicht.<br>";
  }

  if (emailok && passwordok) {
    const response = await AuthenticationService.DoLogin(
      username.value,
      password.value
    );
    if (response instanceof AxiosError) {
      errormessage.value = response.response?.data.error as string;
      console.log(errormessage.value);
      Swal.fire({
      title: "Oeps!",
      html: errormessage.value.substring(0, errormessage.value.length - 4),
      icon: "error",
    });
    } else {
      router.push("/");
    }
  } else {
    Swal.fire({
      title: "Oeps!",
      html: errormessage.value.substring(0, errormessage.value.length - 4),
      icon: "error",
    });
  }
};

onMounted(async () => {
  const response = await AuthenticationService.GetUserInfo();
  if (!(response instanceof AxiosError)) {
    router.push("/");
  } else {
    router.push("/login");
  }
});
</script>

<template>
  <main id="oauth2-login">
    <a href="/">
      <section id="logo"><img src="/img/mongo.png" alt="logo" /></section>
    </a>
    <div id="logintop">
      <section id="auth">
        <section id="auth-content">
          <div>
            <h1 class="text-white">Welcome Back!</h1>
            <p>We're so excited to see you again!</p>
          </div>
          <form method="post">
            <label for="Input_UserName"
              >USERNAME
              <span
                class="errormessage field-validation-valid"
                data-valmsg-for="Input.UserName"
                data-valmsg-replace="true"
              ></span
            ></label>
            <input
             v-model="username"
              autocomplete="email"
              aria-required="true"
              type="text"
              data-val="true"
              data-val-required="The UserName field is required."
              id="Input_UserName"
              name="Input.UserName"
            />

            <label for="Input_Password"
              >PASSWORD
              <span
                class="errormessage field-validation-valid"
                data-valmsg-for="Input.Password"
                data-valmsg-replace="true"
              ></span
            ></label>
            <input
              v-model="password"
              autocomplete="current-password"
              aria-required="true"
              type="password"
              data-val="true"
              data-val-required="The Password field is required."
              id="Input_Password"
              name="Input.Password"
            />

            <button id="loginbtn" type="submit" @click="(e) => handleSignIn(e)">Login</button>
          </form>
          
        </section>
      </section>
    </div>
  </main>
</template>

<style scoped>
#logintop {
  animation: fadeInDown;
  animation-duration: 0.8s;
}

/* Link */

#auth-content #external-account button {
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all ease 0.4s;
  padding: 0.2rem 1rem;
  margin-right: auto;
  width: 100%;
  border-radius: 5px;
  margin: 0.5rem 0;
  cursor: pointer;
}

#auth-content #external-account button:hover {
  transform: scale(1.01);
}

#auth-content #external-account button img {
  width: 25px;
  margin: 0.2rem;
  margin-right: 0.5rem;
  display: block;
}

#auth-content #linkgoogle {
  background-color: #fff;
  color: #000;
}

#auth-content #linkgoogle:hover {
  color: #000;
}

#external-login-description {
  text-align: center;
}

/* Login */

#oauth2-login {
  height: 100vh;
  background: #000 url("/img/abstract-colorful-bg.webp") no-repeat center
    center/cover;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

#oauth2-login #logo {
  position: absolute;
  top: 10px;
  left: 10px;
}

#oauth2-login #logo img {
  width: 150px;
}

#oauth2-login #auth {
  width: 450px;
}

#oauth2-login #auth #auth-content {
  background-color: #36393f;
  border-radius: 5px;
  padding: 1.5rem;
}

#oauth2-login #auth #auth-content h2 {
  text-align: center;
}

#oauth2-login #auth #auth-content h3 {
  text-align: center;
  margin: 0.5rem 0;
}

#oauth2-login #auth #auth-content > div {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

#oauth2-login #auth #auth-content > div h1 {
  font-size: 24px;
  margin-top: 1rem;
  margin-bottom: 7px;
}

#oauth2-login #auth #auth-content > div p {
  color: #b9bbbe;
  font-size: 16px;
  margin-bottom: 1rem;
}

#oauth2-login #auth #auth-content > form label {
  display: block;
  font-size: 12px;
  color: #8e9297;
  font-weight: 600;
  transition: ease 0.4s all;
  margin-bottom: 5px;
}

#oauth2-login #auth #auth-content > form input {
  border: 1px solid rgba(0, 0, 0, 0.2);
  background-color: rgba(0, 0, 0, 0.17);
  color: #dcddde;
  border-radius: 3px;
  height: 40px;
  width: 100%;
  padding-left: 5px;
  transition: ease 0.4s all;
  margin-bottom: 0.5rem;
}

#oauth2-login #auth #auth-content > form .checkbox {
  display: flex;
  align-items: center;
}

#oauth2-login #auth #auth-content > form .checkbox label {
  margin-right: 0.5rem;
}

#oauth2-login #auth #auth-content > form input[type="checkbox"] {
  width: inherit;
  display: inline-block;
  height: inherit;
}

#oauth2-login #auth #auth-content > form button {
  display: block;
  width: 100%;
  border: none;
  color: #fff;
  background: #38e7fc !important;
  font-weight: 600;
  margin-top: 0.5rem;
  padding: 0.6rem;
  font-size: 16px;
  border-radius: 3px;
  transition: ease 0.4s all;
}

#oauth2-login #auth #auth-content > form button:hover {
  background: #2fbfcf !important;
}

#oauth2-login #auth #auth-content > form > a {
  display: block;
  padding-top: 3px;
  padding-bottom: 15px;
}

#oauth2-login #auth #auth-content > form a {
  color: #38e7fc;
  font-size: 14px;
}

#oauth2-login #auth #auth-content > form p {
  font-size: 14px;
  color: #72767d;
  margin-top: 5px;
  padding-bottom: 15px;
}

#oauth2-login #auth #auth-content > form #username {
  margin-bottom: 15px;
}

#oauth2-login #auth #auth-content > form button {
  background-color: #38e7fc;
}

#oauth2-login #auth #auth-content > form button:hover {
  background-color: #2fbfcf;
}

#oauth2-login #auth #auth-content #external-account {
  width: 100%;
}

#oauth2-login #auth #auth-content #register input {
  margin-bottom: 15px;
}

#oauth2-login #auth #auth-content .confirmation {
  text-align: center;
}

#oauth2-login #auth #auth-content .confirmation a {
  color: #38e7fc;
  transition: ease 0.4s all;
}

#oauth2-login #auth #auth-content .confirmation a:hover {
  color: #2fbfcf;
}

@media screen and (max-width: 960px) {
  #oauth2-auth #logo {
    position: relative;
    margin: 1.5rem;
  }

  #oauth2-login {
    min-height: 100vh;
  }

  #oauth2-login #logo {
    position: relative;
    margin: 1rem;
  }

  #oauth2-login #auth {
    width: 90vw;
    margin-bottom: 1rem;
  }

  #oauth2-login #auth #auth-content {
    padding: 1rem 1.5rem;
  }

  #oauth2-login #auth #auth-content > div h1 {
    margin-top: 0;
  }
}

/* Mobile */

@media screen and (max-width: 768px) {
  /* Login */

  #login > h1 {
    text-align: center;
  }
}
</style>
