<script setup lang="ts">
import { useHead } from "@vueuse/head";
import { AxiosError } from "axios";
import { onMounted, ref } from "vue";
import type ITask from "../models/ITask";
import type IUser from "../models/IUser";
import TasksService from "../services/TasksService";

import UsersService from "../services/UsersService";
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
let users = ref<IUser[]>([]);
let Todo = ref<string>("");
let Status = ref<string>("");
let editableId = ref<number>(0);
let editableName = ref<string>("");
let editableDuration = ref<string>("");

let selectedUser = ref<number>();

let putName = ref<string>("");
let putDuration = ref<string>("");

let showmodal = ref<boolean>(false);

onMounted(async () => {
  await reloadTasks();
});

const ToggleEdit = (val: ITask) => {

  loadUsers();
  //close possible current edit row
  tasks.value.forEach((element) => {
    if (element.isEdit && element._id != val._id) {
      element.isEdit = !element.isEdit;
    }
  });
  //open new edit row
  tasks.value.forEach((element) => {
    if (element._id === val._id) {
      showmodal.value = true;
      element.isEdit = !element.isEdit;
      editableName.value = element.todo;
      editableId.value = element._id;
    }
  });
};

const SaveEdit = () => {
  if(selectedUser.value == null){
    return;
  }
  
  const response = TasksService.AssignTaskToUser(
        editableId.value,
        selectedUser.value
      );
  Swal.fire({
      title: "Success!",
      text: "Assigned task to user",
      timer: 1000,
      icon: "success",
      timerProgressBar: true,
      showConfirmButton: false,
    },
    );
    showmodal.value = false;
};


const DeleteTask = async (id: number) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const response2 = await TasksService.DeleteTask(id);
      await reloadTasks();
    }
  });
};

const reloadTasks = async () => {
  editableId.value = 0;
  editableDuration.value = "";
  editableName.value = "";
  showmodal.value = false;
  const response = await TasksService.GetAllUnassignedTasks();
      if (!(response instanceof AxiosError))
        if (response.status === 200) tasks.value = response.data;
}

const loadUsers = async () => {
  editableId.value = 0;
  editableDuration.value = "";
  editableName.value = "";
  showmodal.value = false;
  const response = await UsersService.GetAllUsers();
      if (!(response instanceof AxiosError))
        if (response.status === 200) users.value = response.data;
}

</script>

<template>
  <Layout>
    <main class="flex" />
    <section id="typeList">
      <section class="typeRow" id="firstLine">
        <div />
        <P class="headerT">Todo</P>
        <P class="headerT">Status</P>
        <div />
      </section>
      <section v-for="(line, index) in tasks" :key="line.id">
        <div class="typeRow">
          <div />
          <p class="name">
            {{ line.todo }}
          </p>
          <p class="duration">{{ line.completed }}</p>
          <div />
          <button
            :id="`${index}-editButton`"
            class="editButton"
            @click="() => ToggleEdit(line)"
          >
            Asign
          </button>
          
        </div>
      </section>
    </section>
    
    <aside id="editmodal" :class="{show: showmodal}">
      <form @submit.prevent="SaveEdit()" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <button id="exit" @click.prevent="() => {showmodal = false}">x</button>
        <h1 class="text-2xl mb-2">Assign {{editableName}}</h1>
        <label class="block text-gray-700 text-sm font-bold mb-2" for="duration">User</label>
        <select v-model="selectedUser" class="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="user" name="user" placeholder="user" required>
          <option :key="user.username" v-for="user in users" :value="user._id">{{user.username}}</option>
        </select>
        <button id="save" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Save</button>
      </form>
    </aside>
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
  margin-right: 0rem;
  transition: 0.25s background-color ease-in-out 0.1s;
}
.editButton:hover {
  background-color: rgb(235, 95, 2);
}

.deleteButton {
  margin-left: 0.15rem;
  font-size: 1.2rem;
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
