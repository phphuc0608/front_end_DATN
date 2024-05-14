import { defineStore } from "pinia";

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    email: '',
    ma_vai_tro: 0,
    thuoc_don_vi: '',
    ten_vai_tro: ''
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
    },
    setTenVaiTro(newTenVaiTro) {
      this.ten_vai_tro = newTenVaiTro;
    },
    reset() {
      this.email = '';
      this.ma_vai_tro = 0;
      this.thuoc_don_vi = '';
      this.ten_vai_tro = '';
    }
  }
});