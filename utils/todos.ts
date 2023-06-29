import { type Columns, type Column } from "@/types/Board";
import { type TodoStatus, type Todo } from "@prisma/client";

export const columnsStatus: TodoStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

export const todosGroupedByColumn = (
  todos: Todo[],
  first: number,
  secod: number,
  third: number
): Columns => {
  const columns = todos.reduce((acc, todo) => {
    if (acc.get(todo.status) === undefined)
      acc.set(todo.status, {
        id: todo.status,
        todos: [],
      });

    acc.get(todo.status)?.todos.push(todo);
    return acc;
  }, new Map<TodoStatus, Column>());

  const columnsStatusSorted = [
    columnsStatus[first],
    columnsStatus[secod],
    columnsStatus[third],
  ] as TodoStatus[];

  columnsStatusSorted.forEach((status: TodoStatus) => {
    if (columns.get(status) === undefined)
      columns.set(status, {
        id: status,
        todos: [],
      });
  });

  const sortedColumns = new Map(
    Array.from(columns.entries()).sort(
      (a, b) =>
        columnsStatusSorted.indexOf(a[0]) - columnsStatusSorted.indexOf(b[0])
    )
  );

  const sortedTodos = new Map(
    Array.from(sortedColumns.entries()).map(([key, value]) => [
      key,
      {
        ...value,
        todos: value.todos.sort((a, b) => a.index - b.index),
      },
    ])
  );

  return sortedTodos;
};
