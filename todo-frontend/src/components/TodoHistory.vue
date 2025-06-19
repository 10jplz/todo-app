<template>
  <div>
    <h3 class="mb-3">History of Added Todos</h3>
    <ul class="list-group">
      <li v-for="todo in todos" :key="todo.id" class="list-group-item">
        <strong>{{ todo.task }}</strong><br />
        <small class="text-muted">Added on {{ formatDate(todo.inserted_at) }}</small>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const todos = ref([])

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleString()
}

async function fetchTodos() {
  const res = await fetch('http://localhost:8000/todos')
  todos.value = await res.json()
}

onMounted(fetchTodos)
</script>