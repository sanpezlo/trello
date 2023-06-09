import { XCircleIcon } from "@heroicons/react/24/solid";
import { type Todo } from "@prisma/client";
import {
  type DraggableProvidedDragHandleProps,
  type DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";
import { api } from "@/utils/api";
import { useBoardStore } from "@/store/BoardStore";
import Image from "next/image";

interface TodoCardProps {
  todo: Todo;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}

const TodoCard: React.FC<TodoCardProps> = ({
  todo,
  innerRef,
  draggableProps,
  dragHandleProps,
}) => {
  const { board, setBoard } = useBoardStore();

  const todoDeleteMutation = api.todo.deleteSave.useMutation();

  const handleClick = () => {
    void todoDeleteMutation.mutateAsync({ id: todo.id });

    setBoard({
      columns: new Map(
        Array.from(board.columns, ([key, value]) => {
          if (key === todo.status) {
            return [
              key,
              {
                ...value,
                todos: value.todos.filter((t) => t.id !== todo.id),
              },
            ];
          }

          return [key, value];
        })
      ),
    });
  };

  return (
    <div
      className="space-y-2 rounded-md bg-white drop-shadow-md"
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
      <div className="flex items-center justify-between p-5">
        <p>{todo.title}</p>
        <button
          className="text-red-500 transition hover:text-red-600"
          onClick={handleClick}
        >
          <XCircleIcon className="ml-5 h-8 w-8" />
        </button>
      </div>

      {todo.image && (
        <div className="relative h-full w-full rounded-b-md">
          <Image
            src={todo.image}
            alt="Task image"
            width={400}
            height={200}
            className="w-full rounded-b-md object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default TodoCard;
