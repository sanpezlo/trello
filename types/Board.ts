import { type TodoStatus, type Todo } from "@prisma/client";

export interface Board {
  columns: Columns;
}

export type Columns = Map<TodoStatus, Column>;

export interface Column {
  id: TodoStatus;
  todos: Todo[];
}
