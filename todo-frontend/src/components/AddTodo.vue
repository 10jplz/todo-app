<template>
  <div class="input-group mb-3">
    <input
      v-model="newTask"
      @keyup.enter="handleAdd"
      type="text"
      class="form-control"
      placeholder="Add new todo"
    />
    <button type="button" class="btn btn-primary" @click="handleAdd">Add</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['todo-added'])

const newTask = ref('')

async function handleAdd() {
  if (!newTask.value.trim()) return

  const res = await fetch('http://localhost:8000/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task: newTask.value.trim() })
  })

  if (res.ok) {
    const todo = await res.json()
    emit('todo-added', todo)
    newTask.value = ''
  }
}
</script>