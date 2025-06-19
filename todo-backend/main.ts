import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { getTodos, createTodo, toggleTodo, deleteTodo } from "./routes/todos.ts";

const app = new Application();

app.use(oakCors()); // <-- Enable CORS for all routes

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
  .post("/todos", createTodo)
  .patch("/todos/:id", toggleTodo)  // PATCH method here
  .delete("/todos/:id", deleteTodo);

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });