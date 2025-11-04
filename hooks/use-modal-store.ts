import { ChannelType, Server, Channel } from "@prisma/client";
import { Stringifiable } from "query-string";
import { create } from "zustand";

export type ModalType =
  | "CREATE_SERVER"
  | "INVITE_SERVER"
  | "EDIT_SERVER"
  | "MEMBERS"
  | "CREATE_CHANNEL"
  | "LEAVE_SERVER"
  | "DELETE_SERVER"
  | "DELETE_CHANNEL"
  | "EDIT_CHANNEL"
  | "MESSAGE_FILE"
  | "DELETE_MESSAGE";

interface ModalData {
  server?: Server;
  channel?: Channel;
  channelType?: ChannelType;
  apiUrl?: string;
  query?: Stringifiable;
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
