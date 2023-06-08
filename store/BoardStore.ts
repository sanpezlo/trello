import { create } from "zustand";
import { type TodoStatus } from "@prisma/client";
import { type Board, type Column } from "@/types/Board";

interface State {
  board: Board;
}

interface Actions {
  setBoard: (board: Board) => void;
}

export const useBoardStore = create<State & Actions>((set) => ({
  board: {
    columns: new Map<TodoStatus, Column>(),
  },
  setBoard: (board) => set({ board }),
}));
