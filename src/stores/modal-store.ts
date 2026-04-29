import { create } from 'zustand';

type ModalType = 'ADD_MEMBER' | 'QUICK_CHECKIN' | 'PAYMENT' | 'NONE';

interface ModalState {
  activeModal: ModalType;
  modalProps: any;
  openModal: (type: ModalType, props?: any) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  activeModal: 'NONE',
  modalProps: null,
  openModal: (type, props) => set({ activeModal: type, modalProps: props }),
  closeModal: () => set({ activeModal: 'NONE', modalProps: null }),
}));
