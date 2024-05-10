import { defineStore } from "pinia";

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    email: ''
  }),
  actions: {
    setEmail(newEmail) {
      this.email = newEmail;
    }
  }
});