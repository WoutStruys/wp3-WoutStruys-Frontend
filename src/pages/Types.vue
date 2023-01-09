<script setup lang="ts">
import { useHead } from "@vueuse/head";
import { AxiosError } from "axios";
import { onMounted, ref } from "vue";
import type IType from "../models/IType";
import TypeService from "../services/TypeService";
import Swal from "sweetalert2";
import { BanknotesIcon } from "@heroicons/vue/24/outline";
import { number } from "@intlify/core-base";

useHead({
  title: "Types",
  meta: [
    {
      name: "types",
      content: "Types",
    },
  ],
});
let types = ref<IType[]>([]);
let Name = ref<string>("");
let Duration = ref<string>("");
let editableId = ref<number>(0);
let editableName = ref<string>("");
let editableDuration = ref<string>("");

let putName = ref<string>("");
let putDuration = ref<string>("");

let showmodal = ref<boolean>(false);

onMounted(async () => {
  await reloadTypes();
});

const ToggleEdit = (val: IType) => {
  //close possible current edit row
  types.value.forEach((element) => {
    if (element.isEdit && element.id != val.id) {
      element.isEdit = !element.isEdit;
    }
  });
 
  //open new edit row
  types.value.forEach((element) => {
    if (element.id === val.id) {
      showmodal.value = true;
      element.isEdit = !element.isEdit;
      editableId.value = element.id;
      editableName.value = val.name;
      editableDuration.value = val.duration.toString();
    }
  });
};

const SaveEdit = () => {
  if(editableId.value == 0){
    return;
  }

   //save possible changes
   types.value.forEach((element) => {
    if (element.id == editableId.value) {
      putName.value = editableName.value;
      putDuration.value = editableDuration.value;
      //run checks first
      let valid = true;
      let errorMessage = "";
      if(putName.value === "" || putDuration.value === ""){
        valid = false;
        errorMessage = "-nothing is changed.<br>";
      }
      else if (isNaN(parseInt(editableDuration.value))) {
        valid = false;
        errorMessage = "-duration should only contain numbers.<br>";
      }
      else{
        valid = true
      }
      if (valid) {


      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, change it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await TypeService.UpdateType(
            editableId.value,
            putName.value,
            parseInt(putDuration.value)
          );
          await reloadTypes();
        }
      });
    }
    else {
    Swal.fire({
      title: "Oeps!",
      html: errorMessage.substring(0, errorMessage.length - 4),
      icon: "error",
    });
  }
    }
  });
}

const DeleteType = async (id: number) => {
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
      const response2 = await TypeService.DeleteType(id);
      await reloadTypes();
    }
  });
};

const onMakeType = async () => {
  let valid = true;
  let errorMessage = "";
  if (Name.value.length === 0) {
    valid = false;
    errorMessage = "-Name is required.<br>";
  } else if (Duration.value.length === 0) {
    valid = false;
    errorMessage = "-duration is required.<br>";
  } else if (isNaN(parseInt(Duration.value))) {
    valid = false;
    errorMessage = "-duration should only contain numbers.<br>";
  }

  if (valid) {
    await TypeService.CreateType(Name.value, parseInt(Duration.value));
    let timerInterval;
    Swal.fire({
      title: "New Type Is Added!",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading(null);
      },
      willClose: () => {
        clearInterval(2.5);
      },
    }).then(async (result) => {
      await reloadTypes();
    });
  } else {
    Swal.fire({
      title: "Oeps!",
      html: errorMessage.substring(0, errorMessage.length - 4),
      icon: "error",
    });
  }
};

const reloadTypes = async () => {
  editableId.value = 0;
  editableDuration.value = "";
  editableName.value = "";
  showmodal.value = false;
  const response = await TypeService.GetAllTypes();
      if (!(response instanceof AxiosError))
        if (response.status === 200) types.value = response.data;
}

</script>

<template>
  <Layout>
    <main class="flex" />
    <section id="typeList">
      <section class="typeRow" id="firstLine">
        <div />
        <P class="headerT">NAME</P>
        <P class="headerT">DURATION</P>
        <div />
      </section>
      <section v-for="(line, index) in types" :key="line.id">
        <div class="typeRow">
          <div />
          <p class="name">
            {{ line.name }}
          </p>
          <p class="duration">{{ line.duration }} min</p>
          <div />
          <button
            :id="`${index}-editButton`"
            class="editButton"
            @click="() => ToggleEdit(line)"
          >
            EDIT
          </button>

          <button
            class="deleteButton"
            :id="`${index}-DeleteButton`"
            @click="() => DeleteType(line.id)"
          >
            DELETE
          </button>
        </div>
      </section>
    </section>
    <section id="createNew">
      <section class="typeRow" id="firstLine">
        <div />
        <P class="headerT">CREATE NEW TYPE</P>
        <div />
      </section>
      <form @submit.prevent="onMakeType">
        <div class="formField">
          <label for="name">Name:</label>
          <input id="createName" class="name" v-model="Name" />
        </div>
        <div class="formField" id="secondField">
          <label for="duration">Duration:</label>
          <input id="createDuration" class="name" v-model="Duration" />
          <p id="minSpace">min</p>
        </div>
        <div class="formField" id="thirdField">
          <button id="submit" type="submit">Submit</button>
        </div>
      </form>
    </section>
    <aside id="editmodal" :class="{show: showmodal}">
      <form @submit.prevent="SaveEdit" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <button id="exit" @click.prevent="() => {showmodal = false}">x</button>
        <h1 class="text-2xl mb-2">Edit {{editableName}}</h1>
        <label class="block text-gray-700 text-sm font-bold mb-2" for="name">NAME</label>
        <input v-model="editableName" class="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" id="name" name="name" placeholder="name" required>
        <label class="block text-gray-700 text-sm font-bold mb-2" for="duration">DURATION (min)</label>
        <input v-model="editableDuration" class="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" id="duration" name="duration" placeholder="duration" required>
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
  margin-right: 0.15rem;
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
