<template>
  <div class="container pt-5">
    <h1>Đổi mật khẩu</h1>
    <form>
      <div class="mb-3">
        <label for="old_password" class="form-label">Mật khẩu cũ</label>
        <input type="password" class="form-control" id="old_password" v-model="oldPassword">
      </div>
      <div class="mb-3">
        <label for="new_password" class="form-label">Mật khẩu mới</label>
        <input type="password" class="form-control" id="new_password" v-model="newPassword">
      </div>
      <button type="button" class="btn btn-primary" @click="updatePassword">Cập nhật</button>
    </form>
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
    
    onMounted(() => {
      if (!email) {
        router.push('/');
      }
      document.title = 'Đổi mật khẩu';
    });

    const updatePassword = async() => {
      const updatePasswordData = {
        old_password: oldPassword.value,
        new_password: newPassword.value
      };
      console.log(updatePasswordData);
      try{
        const response = await axios.patch(`/api/nguoi-dung/${email}/doi-mat-khau?old_password=${oldPassword.value}&new_password=${newPassword.value}`, updatePasswordData);
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Đổi mật khẩu thành công'
        });
        router.push('/');
        localStorage.removeItem('savedEmail');
        localStorage.removeItem('savedMaVaiTro');
        localStorage.removeItem('savedThuocDonVi');
        localStorage.removeItem('savedTenVaiTro');
        localStorage.removeItem('token');
      }
      catch(error){
        Swal.fire({
          icon: 'error',
          title: 'Thất bại',
          text: 'Đổi mật khẩu thất bại'
        });
      
      }
    };
    return {
      oldPassword,
      newPassword,
      updatePassword
    };
  }
};
</script>
<style scoped>

</style>