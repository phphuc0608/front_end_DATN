<template>
  <NavbarCuakhau/>
  <div id="content" class="container">
    <h3 class="my-4 text-left">CẬP NHẬT NGƯỜI DÙNG</h3>
    <form @submit.prevent="updateNguoiDung">
      <div class="row">
        <div class="col-md-6">
          <label class="col-form-label">Email</label>
          <input v-model="email" type="text" :class="{'is-invalid': emailError}" class="form-control" placeholder="Nhập email" :title="emailError ? 'Email không đúng định dạng' : ''" required readonly>
        </div>
        <div class="col-md-6">
          <label for="" class="col-form-label">Họ và tên</label>
          <input v-model="hoVaTen" type="text" class="form-control" placeholder="Nhập họ và tên">
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label for="" class="col-form-label">Số điện thoại</label>
          <input v-model="soDienThoai" type="text" class="form-control" :class="{'is-invalid': soDienThoaiError}" placeholder="Nhập số điện thoại" :title="soDienThoaiError ? 'Số điện thoại phải đủ 10 ký tự' : ''" required>
        </div>
        <div class="col-md-6">
          <label for="" class="col-form-label">Thuộc đơn vị</label>
          <input v-model="maDonVi" class="form-control h-auto wide" required/>
        </div>
      </div>  
      <div class="row">
        <div class="col-md-6">
          <label for="" class="col-form-label">Vai trò</label>
          <select v-model="maVaiTro" class="form-control form-select h-auto wide" required>
            <option value=2>Admin cửa khẩu</option>
            <option value=4>Cán bộ cửa khẩu</option>
          </select>
        </div>
        <form class="col-md-6 d-flex align-items-center" style="margin-top: 36px;">
          <button class="btn btn-success me-3" @click.prevent="moTaiKhoan">Mở tài khoản</button>
          <button class="btn btn-danger me-3" @click.prevent="khoaTaiKhoan">Khóa tài khoản</button>
          <button class="btn btn-primary" @click.prevent="khoiPhucMatKhau">Khôi phục mật khẩu</button>
        </form>
      </div>  
      <div class="d-flex justify-content-start mt-4">
        <button type="submit" class="btn btn-warning me-3" style="color: white;"><i class="bi bi-pencil-fill"></i> Cập nhật</button>
      </div> 
    </form>
  </div>
</template>
<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import NavbarCuakhau from '../../../components/NavbarCuakhau.vue';
import axios from 'axios';
import router from '../../../routers/router';
import Swal from 'sweetalert2';

export default {
  setup(){ 
    const route = useRoute();
    const email = ref('');
    const hoVaTen = ref('');
    const soDienThoai = ref('');
    const maDonVi = ref(localStorage.getItem('savedThuocDonVi'));
    const maVaiTro = ref(0);
    const dangHoatDong = ref(true);
    const emailError = ref(false);
    const soDienThoaiError = ref(false);

    const getNguoiDungByEmail = async() => {
      const emailParam = route.params.email;
      console.log(emailParam);  
      try {
        const response = await axios.get(`/api/nguoi-dung/${emailParam}`);
        const nguoiDung = response.data;
        email.value = nguoiDung.email;
        hoVaTen.value = nguoiDung.ho_va_ten;
        soDienThoai.value = nguoiDung.so_dien_thoai;
        maDonVi.value = nguoiDung.thuoc_don_vi;
        maVaiTro.value = nguoiDung.ma_vai_tro; 
        dangHoatDong.value = nguoiDung.dang_hoat_dong;
      } catch (error) {
        console.log(error);
      }
    }

    const updateNguoiDung = async() => {
      validateEmail();
      validateSoDienThoai();
      // Check if any validation failed
      if(emailError.value || soDienThoaiError.value) {
        return; // Stop execution if validation failed
      }
      const nguoiDungData = {
        email: email.value,
        ho_va_ten: hoVaTen.value,
        so_dien_thoai: soDienThoai.value,
        thuoc_don_vi: maDonVi.value,
        ma_vai_tro: maVaiTro.value,
      };
      console.log(nguoiDungData.value);
      try {
        await axios.put(`/api/nguoi-dung/${email.value}`, nguoiDungData);
        Swal.fire({
          icon: 'success',
          title: 'Cập nhật người dùng thành công',
        });
        setTimeout(() => {
          router.back('/quan_ly_nguoi_dung_cua_khau');
        }, 10);
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Cập nhật người dùng thất bại',
        });
      }
    }
    
    const updateDangHoatDong = async(status) => {
      try {
        await axios.patch(`/api/nguoi-dung/${email.value}?status=${status}`);
        console.log(status);
        Swal.fire({
          icon: 'success',
          title: 'Cập nhật trạng thái hoạt động thành công',

        });
        router.back('/quan_ly_nguoi_dung_cua_khau');
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Cập nhật trạng thái hoạt động thất bại',
        });
      }
    }

    const khoiPhucMatKhau = async() => {
      try{
        await axios.patch(`/api/nguoi-dung/${email.value}/khoi-phuc-mat-khau`);
        Swal.fire({
          icon: 'success',
          title: 'Khôi phục mật khẩu thành công',
        });
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Khôi phục mật khẩu thất bại',
        });
      }
    }

    const moTaiKhoan = async() => {
      try {
        await axios.patch(`/api/nguoi-dung/${email.value}/mo-khoa-tai-khoan`);
        Swal.fire({
          icon: 'success',
          title: 'Mở tài khoản thành công',
        });
        router.push('/quan_ly_nguoi_dung_cua_khau');
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Mở tài khoản thất bại',
        });
      }
    }

    const khoaTaiKhoan = async() => {
      try {
        await axios.patch(`/api/nguoi-dung/${email.value}/khoa-tai-khoan`);
        Swal.fire({
          icon: 'success',
          title: 'Khóa tài khoản thành công',
        });
        router.push('/quan_ly_nguoi_dung_cua_khau');
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Khóa tài khoản thất bại',
        });
      }
    }

    const validateEmail = () => {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      emailError.value = !re.test(email.value);
    };

    const validateSoDienThoai = () => {
      const re = /^\d{10}$/;
      soDienThoaiError.value = !re.test(soDienThoai.value);
    };

    onMounted(async() => {
      document.title = "Cập nhật người dùng";
      await getNguoiDungByEmail();
    });

    return {
      email,
      hoVaTen,
      email,
      soDienThoai,
      getNguoiDungByEmail,
      maDonVi,
      maVaiTro,
      dangHoatDong,
      emailError,
      soDienThoaiError,
      validateEmail,
      validateSoDienThoai,
      updateNguoiDung,
      updateDangHoatDong,
      khoiPhucMatKhau,
      moTaiKhoan,
      khoaTaiKhoan
    }
  },
  components: {
    NavbarCuakhau
  },
}
</script>
<style>
#content{
  margin-top: 120px;
}
</style>