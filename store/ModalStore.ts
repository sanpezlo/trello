import { type TodoStatus } from "@prisma/client";
import { create } from "zustand";

interface State {
  isOpen: boolean;
  taskTitle: string;
  taskType: TodoStatus;
  taskImage: File | null;
}

interface Actions {
  openModal: () => void;
  closeModal: () => void;
  setTaskTitle: (taskTitle: string) => void;
  setTaskType: (taskType: TodoStatus) => void;
  setTaskImage: (taskImage: File | null) => void;
  clearTask: () => void;
}

export const useModalStore = create<State & Actions>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
  taskTitle: "",
  setTaskTitle: (taskTitle) => set({ taskTitle }),
  taskType: "TODO",
  setTaskType: (taskType) => set({ taskType }),
  taskImage: null,
  setTaskImage: (taskImage) => set({ taskImage }),
  clearTask: () => set({ taskTitle: "", taskType: "TODO", taskImage: null }),
}));
