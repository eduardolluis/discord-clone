import { create } from "zustand";
import { Server } from "@prisma/client";
export type ModalType =
  | "CREATE_SERVER"
  | "JOIN_SERVER"
  | "EDIT_SERVER"
  | "INVITE_SERVER"
  | "CREATE_CHANNEL"
  | "MEMBERS";

interface ModalData {
  server?: Server;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));
