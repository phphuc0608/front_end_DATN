import { defineStore } from "pinia";
//Define a store named 'user' that contains the user's email, ma_vai_tro, thuoc_don_vi and ten_vai_tro
export const useUserStore = defineStore({
  id: 'user',
  //The initial state of the store
  state: () => ({
    email: '',
    ma_vai_tro: 0,
    thuoc_don_vi: '',
    ten_vai_tro: ''
  }),
  //Functions that change the state of the store
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