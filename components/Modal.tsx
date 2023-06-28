import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "@/store/ModalStore";
import TaskTypeRadioGroup from "@/components/TaskTypeRadioGroup";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { api } from "@/utils/api";
import { useBoardStore } from "@/store/BoardStore";

const Modal: React.FC = () => {
  const imagePickerRef = useRef<HTMLInputElement>(null);

  const { board, setBoard } = useBoardStore();

  const {
    isOpen,
    closeModal,
    taskTitle,
    taskType,
    setTaskTitle,
    taskImage,
    setTaskImage,
    clearTask,
  } = useModalStore();

  const todoMutation = api.todo.create.useMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!taskTitle) return;

    void (async () => {
      let secure_url = undefined;

      if (taskImage) {
        const formData = new FormData();

        formData.append("file", taskImage as Blob);

        formData.append("upload_preset", "my-uploads");

        const request = await fetch(
          "https://api.cloudinary.com/v1_1/dto7he7xr/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (request.status !== 200) return;

        const data = (await request.json()) as { secure_url: string };
        secure_url = data.secure_url;
      }

      const todo = await todoMutation.mutateAsync({
        title: taskTitle,
        status: taskType,
        image: secure_url,
      });

      setBoard({
        columns: new Map(
          Array.from(board.columns, ([key, value]) => {
            if (key === taskType) {
              return [
                key,
                {
                  ...value,
                  todos: [...value.todos, todo],
                },
              ];
            }

            return [key, value];
          })
        ),
      });

      clearTask();
      closeModal();
    })();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="form" onClose={closeModal} onSubmit={handleSubmit}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="pb-2 text-lg font-medium leading-6 text-gray-900"
                >
                  Add a Task
                </Dialog.Title>

                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Enter a task here..."
                    className="w-full rounded-md border border-gray-300 p-5 outline-none focus:border-gray-300 focus:ring-0"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                  />
                </div>

                <TaskTypeRadioGroup />

                <div className="mt-2">
                  <button
                    type="button"
                    className="w-full rounded-md border border-gray-300 p-5 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => {
                      imagePickerRef.current?.click();
                    }}
                  >
                    <PhotoIcon className="mr-2 inline-block h-6 w-6" />
                    Upload Image
                  </button>
                  {taskImage && (
                    <Image
                      alt="Uploaded Image"
                      src={URL.createObjectURL(taskImage)}
                      width={200}
                      height={200}
                      className="mt-2 h-44 w-full cursor-not-allowed object-cover filter transition-all duration-150 hover:grayscale"
                      onClick={() => setTaskImage(null)}
                    />
                  )}
                  <input
                    type="file"
                    name="file"
                    ref={imagePickerRef}
                    hidden
                    onChange={(e) => {
                      if (
                        !e.target.files ||
                        !e.target.files[0] ||
                        !e.target.files[0].type.startsWith("image/")
                      )
                        return;
                      setTaskImage(e.target.files[0]);
                    }}
                  />
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={!taskTitle}
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300"
                  >
                    Add Task
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
