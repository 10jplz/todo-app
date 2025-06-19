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
export const createTodo = async (ctx: RouterContext) => {
  const { task } = await ctx.request.body({ type: "json" }).value;
  const { data, error } = await supabase.from("todos").insert([{ task }]).select();
  if (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: error.message };
    return;
  }
  ctx.response.status = 201;
  ctx.response.body = data[0];
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
  const { error } = await supabase.from("todos").delete().eq("id", id);
  if (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: error.message };
    return;
  }
  ctx.response.status = 204;
};