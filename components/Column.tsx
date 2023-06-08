import { TodoStatus, type Todo } from "@prisma/client";
import { Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "@/components/StrictModeDroppable";
import TodoCard from "@/components/TodoCard";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

interface ColumnProps {
  id: TodoStatus;
  todos: Todo[];
  index: number;
}

const todoStatusToText: Record<TodoStatus, string> = {
  [TodoStatus.TODO]: "Todo",
  [TodoStatus.IN_PROGRESS]: "In Progress",
  [TodoStatus.DONE]: "Done",
};

const Column: React.FC<ColumnProps> = ({ id, todos, index }) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <StrictModeDroppable droppableId={index.toString()} type="card">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`rounded-2xl p-2 shadow-sm ${
                  snapshot.isDraggingOver ? "bg-green-200" : "bg-white/50"
                }`}
              >
                <h2 className="flex justify-between p-2 text-xl font-bold">
                  {todoStatusToText[id]}
                  <span className="rounded-full bg-gray-200 px-2 py-1 text-sm font-normal text-gray-500">
                    {todos.length}
                  </span>
                </h2>

                <div className="space-y-2">
                  {todos.map((todo, index) => (
                    <Draggable
                      key={todo.id}
                      draggableId={todo.id}
                      index={index}
                    >
                      {(provided) => (
                        <TodoCard
                          todo={todo}
                          index={index}
                          id={id}
                          innerRef={provided.innerRef}
                          draggableProps={provided.draggableProps}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}

                  <div className="flex items-end justify-end p-2">
                    <button className="text-green-500 transition hover:text-green-600">
                      <PlusCircleIcon className="h-10 w-10 " />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </StrictModeDroppable>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
