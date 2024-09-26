import {create} from 'zustand';

interface UserInfo {
  customId: string;
  name: string;
  isDisabled: boolean;
}

interface UserStore {
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo) => void;
  clearUserInfo: () => void;
}

export const useUserStore = create<UserStore>(set => ({
  userInfo: null,
  setUserInfo: (userInfo: UserInfo) => set({userInfo}),
  clearUserInfo: () => set({userInfo: null}),
}));
