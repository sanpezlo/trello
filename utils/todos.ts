import { type Columns, type Column } from "@/types/Board";
import { type TodoStatus, type Todo } from "@prisma/client";

export const todosGroupedByColumn = (todos: Todo[]): Columns => {
  const columns = todos.reduce((acc, todo) => {
    if (acc.get(todo.status) === undefined)
      acc.set(todo.status, {
        id: todo.status,
        todos: [],
      });

    acc.get(todo.status)?.todos.push(todo);
    return acc;
  }, new Map<TodoStatus, Column>());

  const columsStatus: TodoStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

  columsStatus.forEach((status: TodoStatus) => {
    if (columns.get(status) === undefined)
      columns.set(status, {
        id: status,
        todos: [],
      });
  });

  const sortedColumns = new Map(
    Array.from(columns.entries()).sort(
      (a, b) => columsStatus.indexOf(a[0]) - columsStatus.indexOf(b[0])
    )
  );

  return sortedColumns;
};
