import { api } from "@/utils/api";
import { useEffect } from "react";
import { DragDropContext, type DropResult } from "react-beautiful-dnd";

import { useBoardStore } from "@/store/BoardStore";
import { todosGroupedByColumn } from "@/utils/todos";
import ColumnComponent from "@/components/Column";
import { StrictModeDroppable } from "@/components/StrictModeDroppable";
import { type Column } from "@/types/Board";
import { type Todo, type TodoStatus } from "@prisma/client";

const Board: React.FC = () => {
  const { board, setBoard } = useBoardStore();
  const { data: todos, isLoading, isError, error } = api.todo.getAll.useQuery();
  const userUpdateColumnPreferencesMutation =
    api.user.updateColumnPreferences.useMutation();
  const todoUpdateIndexMutation = api.todo.updateIndex.useMutation();
  const todoUpdateStatusMutation = api.todo.updateStatus.useMutation();

  useEffect(() => {
    if (todos) {
      setBoard({
        columns: todosGroupedByColumn(
          todos,
          todos[0]?.user.first ?? 0,
          todos[0]?.user.second ?? 1,
          todos[0]?.user.third ?? 2
        ),
      });
    }
  }, [setBoard, todos]);

  if (isLoading) return <BoardSkeleton />;
  if (isError) return <div>{JSON.stringify(error)}</div>;

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;

    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed as [TodoStatus, Column]);
      const rearrangedColumns = new Map(entries);
      setBoard({ columns: rearrangedColumns });

      userUpdateColumnPreferencesMutation.mutate({
        id: (removed as [TodoStatus, Column])[0],
        index: destination.index,
      });

      return;
    }

    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];

    const finishColIndex = columns[Number(destination.droppableId)];

    const startCol: Column = {
      id: startColIndex?.[0] as TodoStatus,
      todos: startColIndex?.[1].todos as Todo[],
    };
    const finishCol: Column = {
      id: finishColIndex?.[0] as TodoStatus,
      todos: finishColIndex?.[1].todos as Todo[],
    };

    if (!startCol || !finishCol) return;

    if (source.index === destination.index && startCol === finishCol) return;

    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);

    if (startCol.id === finishCol.id) {
      newTodos.splice(destination.index, 0, todoMoved as Todo);
      const newCol: Column = {
        id: startCol.id,
        todos: newTodos,
      };

      const newColumns = new Map(board.columns);
      newColumns.set(newCol.id, newCol);

      setBoard({ columns: newColumns });

      todoUpdateIndexMutation.mutate({
        id: todoMoved?.id as string,
        index: destination.index,
      });

      return;
    } else {
      const finishTodos = Array.from(finishCol.todos);
      finishTodos.splice(destination.index, 0, todoMoved as Todo);

      const newColumns = new Map(board.columns);
      const newCol: Column = {
        id: startCol.id,
        todos: newTodos,
      };

      newColumns.set(newCol.id, newCol);
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos,
      });

      setBoard({ columns: newColumns });

      todoUpdateStatusMutation.mutate({
        id: todoMoved?.id as string,
        status: finishCol.id,
        index: destination.index,
      });

      return;
    }
  };

  return (
    <main className="mt-5 h-full max-h-full overflow-auto">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <StrictModeDroppable
          droppableId="board"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <div
              className="mx-5 grid max-w-7xl grid-cols-1 gap-5 md:mx-auto md:grid-cols-3"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {Array.from(board.columns.entries()).map(
                ([id, column], index) => (
                  <ColumnComponent
                    key={id}
                    id={id}
                    todos={column.todos}
                    index={index}
                  />
                )
              )}

              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
    </main>
  );
};

const BoardSkeleton: React.FC = () => {
  return (
    <main className="mt-5 h-full max-h-full overflow-auto">
      <div className="mx-5 grid max-w-7xl animate-pulse grid-cols-1 gap-5 md:mx-auto md:grid-cols-3">
        <div>
          <div className="rounded-2xl bg-white/50 p-2 shadow-sm">
            <h2 className="flex justify-between p-2 text-xl font-bold">
              &nbsp;
              <span className="h-7 w-8 rounded-full bg-gray-200 px-2 py-1 text-sm font-normal text-gray-500"></span>
            </h2>
            <div className="space-y-2">
              <div className="space-y-2 rounded-md bg-white drop-shadow-md">
                <div className="flex items-center justify-between p-5">
                  <p>&nbsp;</p>
                </div>
              </div>

              <div className="p-7"></div>
            </div>
          </div>
        </div>
        <div>
          <div className="rounded-2xl bg-white/50 p-2 shadow-sm">
            <h2 className="flex justify-between p-2 text-xl font-bold">
              &nbsp;
              <span className="h-7 w-8 rounded-full bg-gray-200 px-2 py-1 text-sm font-normal text-gray-500"></span>
            </h2>
            <div className="space-y-2">
              <div className="space-y-2 rounded-md bg-white drop-shadow-md">
                <div className="flex items-center justify-between p-5">
                  <p>&nbsp;</p>
                </div>
              </div>
              <div className="space-y-2 rounded-md bg-white drop-shadow-md">
                <div className="flex items-center justify-between p-5">
                  <p>&nbsp;</p>
                </div>
              </div>
              <div className="space-y-2 rounded-md bg-white drop-shadow-md">
                <div className="flex items-center justify-between p-5">
                  <p>&nbsp;</p>
                </div>
              </div>
              <div className="p-7"></div>
            </div>
          </div>
        </div>
        <div>
          <div className="rounded-2xl bg-white/50 p-2 shadow-sm">
            <h2 className="flex justify-between p-2 text-xl font-bold">
              &nbsp;
              <span className="h-7 w-8 rounded-full bg-gray-200 px-2 py-1 text-sm font-normal text-gray-500"></span>
            </h2>
            <div className="space-y-2">
              <div className="space-y-2 rounded-md bg-white drop-shadow-md">
                <div className="flex items-center justify-between p-5">
                  <p>&nbsp;</p>
                </div>
              </div>
              <div className="space-y-2 rounded-md bg-white drop-shadow-md">
                <div className="flex items-center justify-between p-5">
                  <p>&nbsp;</p>
                </div>
              </div>
              <div className="p-7"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Board;
