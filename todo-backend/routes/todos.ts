import { RouterContext } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { supabase } from "../supabase.ts";

// ✅ List Todos
export const getTodos = async (ctx: RouterContext) => {
  const { data, error } = await supabase.from("todos").select("*");
  if (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: error.message };
    return;
  }
  ctx.response.body = data;
};

// ✅ Create Todo
export const addTodo = async (ctx: RouterContext) => {
  const { task } = await ctx.request.body({ type: "json" }).value;
  if (!task) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Task is required" };
    return;
  }

  const { data: todoData, error: todoError } = await supabase
    .from("todos")
    .insert([{ task }])
    .select()
    .single();
  if (todoError) {
    ctx.response.status = 500;
    ctx.response.body = { error: todoError.message };
    return;
  }

  // Insert into todo_history
  const historyEntry = {
    todo_id: todoData.id,
    task: todoData.task,
    is_complete: todoData.is_complete,
    inserted_at: todoData.inserted_at,
  };
  const { error: historyError } = await supabase
    .from("todo_history")
    .insert([historyEntry]);
  if (historyError) {
    ctx.response.status = 500;
    ctx.response.body = { error: historyError.message };
    return;
  }

  ctx.response.status = 201;
  ctx.response.body = todoData;
};

// ✅ Toggle Todo
export const toggleTodo = async (ctx: RouterContext<{ id: string }>) => {
  const id = ctx.params.id;
  const { data: todo } = await supabase.from("todos").select("is_complete").eq("id", id).single();
  const { data, error } = await supabase
    .from("todos")
    .update({ is_complete: !todo?.is_complete })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: error.message };
    return;
  }

  ctx.response.body = data;
};

// ✅ Delete Todo
export const deleteTodo = async (ctx: RouterContext<{ id: string }>) => {
  const id = ctx.params.id;
  console.log("DELETE todo id:", id);

  const { data, error } = await supabase.from("todos").delete().eq("id", id).select();
  if (error) {
    console.error("Supabase delete error:", error.message);
    ctx.response.status = 500;
    ctx.response.body = { error: error.message };
    return;
  }
  if (!data || data.length === 0) {
    console.log("No todo found with ID:", id);
    ctx.response.status = 404;
    ctx.response.body = { error: "Todo not found" };
    return;
  }
  console.log("Deleted todo:", data);
  ctx.response.status = 204;
};

// ✅ List Todo History
export const getTodoHistory = async (ctx: RouterContext) => {
  const { data, error } = await supabase
    .from("todo_history")
    .select("*")
    .order('inserted_at', { ascending: false });
  if (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: error.message };
    return;
  }
  ctx.response.body = data;
};