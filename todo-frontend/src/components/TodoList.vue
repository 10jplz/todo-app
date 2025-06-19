<template>
  <ul class="list-group">
    <li
      v-for="todo in todos"
      :key="todo.id"
      class="list-group-item d-flex justify-content-between align-items-center"
    >
      <div>
        <input
          type="checkbox"
          class="form-check-input me-2"
          :checked="todo.is_complete"
          @change="toggleTodo(todo.id)"
          :id="'todo-' + todo.id"
        />
        <label
          :for="'todo-' + todo.id"
          :class="{ 'text-decoration-line-through': todo.is_complete }"
        >
          {{ todo.task }}
        </label>
      </div>
      <button class="btn btn-sm btn-danger" @click="deleteTodo(todo.id)">
        <i class="bi bi-trash"></i>
      </button>
    </li>
  </ul>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps(['refreshKey'])
const todos = ref([])

async function fetchTodos() {
  const res = await fetch('http://localhost:8000/todos')
  todos.value = await res.json()
}

async function toggleTodo(id) {
  const res = await fetch(`http://localhost:8000/todos/${id}`, {
    method: 'PATCH'
  })
  const updated = await res.json()
  const index = todos.value.findIndex(t => t.id === id)
  if (index !== -1) todos.value[index] = updated
}

async function deleteTodo(id) {
  await fetch(`http://localhost:8000/todos/${id}`, { method: 'DELETE' })
  todos.value = todos.value.filter(t => t.id !== id)
}

onMounted(fetchTodos)
watch(() => props.refreshKey, fetchTodos)
</script>