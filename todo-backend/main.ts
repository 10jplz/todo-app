import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { getTodos, addTodo, toggleTodo, deleteTodo, getTodoHistory } from "./routes/todos.ts"; // Import new handler

const app = new Application();

app.use(oakCors());

app.use(async (ctx, next) => {
  console.log(`${ctx.request.method} ${ctx.request.url}`);
  await next();
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error("Error:", err);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

const router = new Router();

router
  .get("/todos", getTodos)
  .post("/todos", addTodo)
  .patch("/todos/:id", toggleTodo)
  .delete("/todos/:id", deleteTodo)
  .get("/todo_history", getTodoHistory); // Add this line for history

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });