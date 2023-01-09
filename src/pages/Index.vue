<script setup lang="ts">
import { useHead } from "@vueuse/head";
import { AxiosError } from "axios";
import { onMounted, ref } from "vue";
import type ITask from "../models/ITask";
import TasksService from "../services/TasksService";
import AuthenticationService from "../services/AuthenticationService";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css'

useHead({
  title: "Tasks",
  meta: [
    {
      name: "Tasks",
      content: "Tasks",
    },
  ],
});

let tasks = ref<ITask[]>([]);

let userId = ref<string>("");

onMounted(async () => {
  const response = await AuthenticationService.GetUserInfo();
  if (!(response instanceof AxiosError)) {
    userId.value = response.data.user._id;
    await reloadTasks(response.data.user._id);
  } 
});

const CompleteTask = async (id: number) => {
  Swal.fire({
    title: "Are you sure?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Complete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      console.log(id);
      console.log(userId.value);
      const response = await TasksService.SetTaskAsDone(id, userId.value);
      window.location.reload();


    }
  });
};
const reloadTasks = async (userid: string) => {
  
  const response = await TasksService.GetAllUserTasks(userid);
      if (!(response instanceof AxiosError))
        if (response.status === 200) tasks.value = response.data;
}

</script>

<template>
  <Layout>
    <main class="flex" />
    <section id="typeList">
      <section class="typeRow" id="firstLine">
        <div />
        <P class="headerT">Name</P>
        <P class="headerT">Status</P>
        <div />
      </section>
      <section v-for="(line, index) in tasks" :key="line._id">
        <div class="typeRow">
          <div />
          <p class="name">
            {{ line.todo }}
          </p>
          <p class="duration">{{ line.completed }}</p>
          <div />
          

          <button
            class="deleteButton"
            :id="`${index}-DeleteButton`"
            @click="() => CompleteTask(line._id)"
          >
            Complete
          </button>
        </div>
      </section>
    </section>
  </Layout>
</template>

<style scoped>
#typeList {
  margin-top: 2rem;
}
.typeRow {
  display: grid;
  grid-template-columns: 3% 41% 10% 34% 6% 6%;
  margin-bottom: 2rem;
  background-color: #e2e3e6;
  border-radius: 6px;
  margin-right: 2rem;
  height: 3rem;
}
#firstLine {
  background-color: #1f2937;
}

.name {
  font-size: 1.4rem;
  color: rgb(0, 0, 0);
  font-weight: 600;
}

.duration {
  font-size: 1.3rem;
  font-weight: 700;
  color: rgb(22, 19, 19);
}

.editName {
  font-size: 1.4rem;
  font-weight: 600;
  background-color: #e2e3e6;
  color: rgb(214, 86, 0);
  align-self: baseline;
}
.editDur {
  font-size: 1.3rem;
  font-weight: 700;
  background-color: #e2e3e6;
  color: rgb(214, 86, 0);
  align-self: baseline;
}
.headerT {
  font-size: 1.7rem;
  color: rgb(255, 255, 255);
}

.editButton {
  font-size: 1.2rem;
  color: rgb(255, 255, 255);
  background-color: rgb(214, 86, 0);
  border-radius: 8px 0 0 8px;
  font-weight: 600;
  margin-right: 0.15rem;
  transition: 0.25s background-color ease-in-out 0.1s;
}
.editButton:hover {
  background-color: rgb(235, 95, 2);
}

.deleteButton {
  margin-left: 0.15rem;
  font-size: 1.1rem;
  color: rgb(255, 255, 255);
  background-color: #a70000;
  border-radius: 0 8px 8px 0;
  font-weight: 600;
  transition: 0.25s background-color ease-in-out 0.1s;
}

#minSpace {
  margin-left: 1rem;
}
.deleteButton:hover {
  background-color: #c21f1f;
}

.formField {
  margin-bottom: 0.5rem;
  font-size: 1.6rem;
  color: rgb(97, 97, 97);
  display: grid;
  grid-template-columns: 6% 25%;
}

#secondField {
  display: grid;
  grid-template-columns: 6% 10% 3% !important;
}

#thirdField {
  display: grid;
  grid-template-columns: 16% !important;
}

.formField input {
  margin-left: 2rem;
  background-color: #e2e3e6;
  border-radius: 8px;
  padding-left: 0.5rem;
}

.formField button {
  color: rgb(255, 255, 255);
  background-color: rgb(214, 86, 0);
  border-radius: 8px;
}

#editmodal {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  height: 100vh;
  width: 100vw;
  
  background: rgb(0, 0, 0, 0.4);
  display: none;
}

#editmodal.show {
  display: flex;
  justify-content: center;
  align-items: center;
}

#editmodal form {
  position: relative;
}

#editmodal form #exit {
  position: absolute;
  right: 1rem;
  top: 0.5rem;
  transition: ease 0.4s all;
}

#editmodal form #exit:hover {
  transform: scale(1.5);
}

#editmodal form #save {
  margin-top: 1rem;
  background-color: rgb(59 130 246);
  transition: ease 0.4s all;
}

#editmodal form #save:hover {
  background-color: blue;;
}

</style>