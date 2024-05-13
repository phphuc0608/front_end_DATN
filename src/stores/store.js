import { defineStore } from "pinia";

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    email: '',
    ma_vai_tro: 0,
    thuoc_don_vi: ''
  }),
  actions: {
    setEmail(newEmail) {
      this.email = newEmail;
    },
    setMaVaiTro(newMaVaiTro) {
      this.ma_vai_tro = newMaVaiTro;
    },
    setThuocDonVi(newThuocDonVi) {
      this.thuoc_don_vi = newThuocDonVi;
    }
  }
});