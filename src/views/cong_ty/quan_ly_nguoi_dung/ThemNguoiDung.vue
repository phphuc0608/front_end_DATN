<template>
  <NavbarCongty/>
  <div id="content" class="container">
    <h3 class="my-4 text-left">THÊM NGƯỜI DÙNG</h3>
    <form @submit.prevent="addNguoiDung">
      <div class="row">
        <div class="col-md-6">
          <label class="col-form-label">Email</label>
          <input v-model="email" type="text" :class="{'is-invalid': emailError}" class="form-control" placeholder="Nhập email" :title="emailError ? 'Email không đúng định dạng' : ''" required>
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
          <label for="" class="col-form-label">Mật khẩu</label>
          <input v-model="matKhau" type="password" class="form-control" placeholder="Nhập mật khẩu" required>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label for="" class="col-form-label">Nhập lại mật khẩu</label>
          <input v-model="matKhauNhapLai" type="password" :class="{'is-invalid': matKhauError}" class="form-control" placeholder="Nhập lại mật khẩu" :title="matKhauError ? 'Mật khẩu không trùng khớp' : ''" required>
        </div>
        <div class="col-md-6">
          <label for="" class="col-form-label">Thuộc đơn vị</label>
          <input v-model="maDonVi" class="form-control h-auto wide" required>
        </div>
      </div>  
      <div class="row">
        <div class="col-md-6">
          <label for="" class="col-form-label">Vai trò</label>
          <select v-model="maVaiTro" class="form-control form-select h-auto wide" required>
            <!-- <option v-for="vaiTro in vaiTros" :key="vaiTro.ma_vai_tro" :value="vaiTro.ma_vai_tro">
              {{ vaiTro.ten_vai_tro }}
            </option> -->
            <option value=3>Admin công ty</option>
            <option value=5>Nhân viên doanh nghiệp</option>
          </select>
        </div>
      </div>  
      <div class="d-flex justify-content-start mt-4">
        <button type="submit" class="btn btn-success me-3"><i class="bi bi-plus-circle"></i> Thêm người dùng</button>
        <button type="button" class="btn btn-danger" @click="resetForm"><i class="bi bi-x-circle"></i> Reset</button>
      </div> 
    </form>
  </div>
</template>
<script>
import { ref, onMounted, computed } from 'vue';
import NavbarCongty from '../../../components/NavbarCongty.vue';
import axios from 'axios';
import router from '../../../routers/router';
import Swal from 'sweetalert2';

export default {
  setup(){
    const donVis = ref([]);
    const vaiTros = ref([]);  
    const email = ref('');
    const hoVaTen = ref('');
    const soDienThoai = ref('');
    const maDonVi = ref(localStorage.getItem('savedThuocDonVi'));
    const maVaiTro = ref(0);
    const matKhau = ref('');
    const matKhauNhapLai = ref('');
    const emailError = ref(false);
    const matKhauError = ref(false);
    const soDienThoaiError = ref(false);

    const resetForm = () => {
      email.value = '';
      hoVaTen.value = '';
      email.value = '';
      soDienThoai.value = '';
      maVaiTro.value = 0;
      matKhau.value = '';
    };

    const getdonVis = () => {
      axios.get(`/api/don-vi`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function(response){
        donVis.value = response.data;
        console.log(response.data); 
      })
      .catch(function(error){
        console.log(error);
      });
    };
    
    const getDanhMucVaiTro = () => {
      axios.get(`/api/danh-muc-vai-tro`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function(response){
        vaiTros.value = response.data;
        console.log(response.data); 
      })
      .catch(function(error){
        console.log(error);
      });
    };

    const validateEmail = () => {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      emailError.value = !re.test(email.value);
    };

    const validatePasswords = () => {
      matKhauError.value = matKhau.value !== matKhauNhapLai.value;
    };
    
    const validateSoDienThoai = () => {
      const re = /^\d{10}$/;
      soDienThoaiError.value = !re.test(soDienThoai.value);
    };

    const addNguoiDung = async() => {
      validateEmail();
      validatePasswords();
      validateSoDienThoai();
      if (emailError.value || matKhauError.value) {
        return;
      }
      const nguoiDungData = {
        email: email.value,
        ho_va_ten: hoVaTen.value,
        so_dien_thoai: soDienThoai.value,
        thuoc_don_vi: maDonVi.value,
        ma_vai_tro: maVaiTro.value,
        mat_khau: matKhau.value
      };
      console.log(nguoiDungData);
      try {
        const response = await axios.post(`/api/nguoi-dung`, nguoiDungData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log(response.data);
        Swal.fire({
          icon: 'success',
          title: 'Thêm người dùng thành công',
        });
        router.back('/quan_ly_nguoi_dung_cong_ty');
      } catch (error) {
        console.log(error);
        alert();
        Swal.fire({
          icon: 'error',
          title: 'Thêm người dùng thất bại',
        });
      }
    };


    onMounted(() => {
      document.title = "Thêm người dùng";
    });

    getdonVis();
    getDanhMucVaiTro();
    return {
      donVis,
      resetForm,
      email,
      hoVaTen,
      email,
      soDienThoai,
      addNguoiDung,
      maDonVi,
      vaiTros,
      maVaiTro,
      matKhau,
      matKhauNhapLai,
      emailError,
      matKhauError,
      soDienThoaiError,
      validateEmail,
      validatePasswords,
      validateSoDienThoai
    }
  },
  components: {
    NavbarCongty
  },
}
</script>
<style>
#content{
  margin-top: 120px;
}
input.is-invalid:hover {
  border-color: #dc3545; /* Red border for error */
}

/* Optional: Show tooltip on hover */
input.is-invalid:hover::after {
  content: attr(title);
  display: block;
  position: absolute;
  background-color: #dc3545;
  color: #fff;
  padding: 5px;
  border-radius: 5px;
  margin-top: 5px;
}
</style>