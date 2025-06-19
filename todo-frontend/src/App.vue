<template>
  <div class="container py-4">
    <h1 class="mb-4">Todo App</h1>

    <!-- Tabs -->
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: currentTab === 'list' }"
          @click="currentTab = 'list'"
        >
          Todo List
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: currentTab === 'add' }"
          @click="currentTab = 'add'"
        >
          Add Todo
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: currentTab === 'history' }"
          @click="currentTab = 'history'"
        >
          History
        </button>
      </li>
    </ul>

    <!-- Content -->
    <div v-if="currentTab === 'list'">
      <TodoList :refreshKey="refreshKey" />
    </div>
    <div v-else-if="currentTab === 'add'">
      <AddTodo @todo-added="handleTodoAdded" />
    </div>
    <div v-else-if="currentTab === 'history'">
      <TodoHistory />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AddTodo from './components/AddTodo.vue'
import TodoList from './components/TodoList.vue'
import TodoHistory from './components/TodoHistory.vue'

const currentTab = ref('list')
const refreshKey = ref(0)

function handleTodoAdded() {
  refreshKey.value++
  currentTab.value = 'list' // switch to list after adding
}
</script>