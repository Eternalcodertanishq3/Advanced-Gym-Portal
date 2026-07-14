import { create } from "zustand";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Modal Store
// ═══════════════════════════════════════════════════════════════

interface ModalState {
  isOpen: boolean;
  modalType: string | null;
  modalData: unknown;
  openModal: (type: string, data?: unknown) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>()((set) => ({
  isOpen: false,
  modalType: null,
  modalData: null,
  openModal: (modalType, modalData) => set({ isOpen: true, modalType, modalData }),
  closeModal: () => set({ isOpen: false, modalType: null, modalData: null }),
}));
