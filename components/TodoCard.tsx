import { XCircleIcon } from "@heroicons/react/24/solid";
import { type Todo, type TodoStatus } from "@prisma/client";
import {
  type DraggableProvidedDragHandleProps,
  type DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";

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
  return (
    <div
      className="space-y-2 rounded-md bg-white drop-shadow-md"
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
      <div className="flex items-center justify-between p-5">
        <p>{todo.title}</p>
        <button className="text-red-500 transition hover:text-red-600">
          <XCircleIcon className="ml-5 h-8 w-8" />
        </button>
      </div>
    </div>
  );
};

export default TodoCard;
