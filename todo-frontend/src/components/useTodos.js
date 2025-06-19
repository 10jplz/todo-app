import { ref } from "vue";

const API_URL = "http://localhost:8000";

export function useTodos() {
  const todos = ref([]);
  const error = ref(null);

  async function fetchTodos() {
    try {
      const res = await fetch(`${API_URL}/todos`);
      if (!res.ok) throw new Error("Failed to fetch todos");
      todos.value = await res.json();
    } catch (err) {
      error.value = err.message;
    }
  }

  async function addTodo(task) {
    try {
      const res = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task }),
      });
      if (!res.ok) throw new Error("Failed to add todo");
      const newTodo = await res.json();
      todos.value.push(newTodo);
    } catch (err) {
      error.value = err.message;
    }
  }

  async function toggleTodo(id) {
    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to toggle todo");
      const updatedTodo = await res.json();
      const index = todos.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        todos.value[index] = updatedTodo;
      }
    } catch (err) {
      error.value = err.message;
    }
  }
  async function deleteTodo(id) {
    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete todo");
      todos.value = todos.value.filter((t) => t.id !== id);
    } catch (err) {
      error.value = err.message;
    }
  }

  return {
    todos,
    error,
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
  };
}