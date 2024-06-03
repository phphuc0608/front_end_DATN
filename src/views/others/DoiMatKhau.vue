<template>
  <div class="d-flex align-items-center justify-content-center" style="height: 100vh;">
    <div id="changePasswordBox" class="container mt-5 p-4">
      <div id="header">
        <button class="btn btn-primary mb-3" @click="buttonBack">
          <i class="bi bi-arrow-left"></i>
        </button>
        <h1>Đổi mật khẩu</h1>
      </div>
      <form @submit.prevent.once="updatePassword">
        <div class="mb-3">
          <label for="old_password" class="form-label">Mật khẩu cũ</label>
          <input type="password" class="form-control" id="old_password" v-model="oldPassword">
        </div>
        <div class="mb-3">
          <label for="new_password" class="form-label">Mật khẩu mới</label>
          <input type="password" class="form-control" id="new_password" v-model="newPassword">
        </div>
        <button type="submit" class="btn btn-primary" :disabled="isUpdatingPassword.value">Cập nhật</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import router from '../../routers/router';

export default {
  setup() {
    const oldPassword = ref('');
    const newPassword = ref('');
    const email = localStorage.getItem('savedEmail');
    const isUpdatingPassword = ref(false);

    onMounted(() => {
      if (!email) {
        router.push('/');
      }
      document.title = 'Đổi mật khẩu';
    });

    const buttonBack = () => {
      router.back();
    };

    const addLichSuTaiKhoan = async() => {
      const lichSuData = {
        email: email,
        ma_hanh_dong: 3,
      }
      try {
        await axios.post('/api/lich-su-tai-khoan', lichSuData, { 
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch(error) {
        console.log(error);
      }
    }

    const updatePassword = async() => {
      //Check if updating password is in progress
      if (isUpdatingPassword.value) return;
      //This variable is true to signal that a password change is in progress.
      isUpdatingPassword.value = true;

      const updatePasswordData = {
        old_password: oldPassword.value,
        new_password: newPassword.value
      };
      try {
        const response = await axios.patch(`/api/nguoi-dung/${email}/doi-mat-khau?old_password=${oldPassword.value}&new_password=${newPassword.value}`, updatePasswordData);
        await addLichSuTaiKhoan();
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Đổi mật khẩu thành công',
          showConfirmButton: false,
          timer: 1500
        });
        //Redirect to login page and remove savedEmail, savedMaVaiTro, savedThuocDonVi, savedTenVaiTro, token
        router.push('/');
        localStorage.removeItem('savedEmail');
        localStorage.removeItem('savedMaVaiTro');
        localStorage.removeItem('savedThuocDonVi');
        localStorage.removeItem('savedTenVaiTro');
        localStorage.removeItem('token');
      } catch(error) {
        Swal.fire({
          icon: 'error',
          title: 'Thất bại',
          text: 'Đổi mật khẩu thất bại'
        });
      } finally {
        //This variable is false to signal that the password change is complete.
        isUpdatingPassword.value = false;
      }
    };

    return {
      oldPassword,
      newPassword,
      updatePassword,
      buttonBack,
      isUpdatingPassword,
    };
  }
};
</script>
<style scoped>
  #changePasswordBox {
    border: 1px solid black;
    border-radius: 10px;
    width: 50%;
    margin: auto;
  }
</style>
