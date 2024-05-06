<template>
  <NavbarAdmin/>
  <div id="content" class="container">
    <h3 class="my-4 text-left">THÊM NGƯỜI DÙNG</h3>
    <form @submit.prevent="addNguoiDung">
      <div class="row">
        <div class="col-md-6">
          <label class="col-form-label">Email</label>
          <input v-model="email" type="text" :class="{'is-invalid': emailError}" class="form-control" placeholder="Nhập email" :title="emailError ? 'Email không đúng định dạng' : ''">
        </div>
        <div class="col-md-6">
          <label for="" class="col-form-label">Họ và tên</label>
          <input v-model="hoVaTen" type="text" class="form-control" placeholder="Nhập họ và tên">
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label for="" class="col-form-label">Số điện thoại</label>
          <input v-model="soDienThoai" type="text" class="form-control" placeholder="Nhập số điện thoại">
        </div>
        <div class="col-md-6">
          <label for="" class="col-form-label">Mật khẩu</label>
          <input v-model="matKhau" type="password" class="form-control" placeholder="Nhập mật khẩu">
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label for="" class="col-form-label">Nhập lại mật khẩu</label>
          <input v-model="matKhauNhapLai" type="password" :class="{'is-invalid': matKhauError}" class="form-control" placeholder="Nhập lại mật khẩu" :title="matKhauError ? 'Mật khẩu không trùng khớp' : ''">
        </div>
        <div class="col-md-6">
          <label for="" class="col-form-label">Thuộc đơn vị</label>
          <select v-model="maDonVi" class="form-control form-select h-auto wide">
            <option v-for="donVi in donVis" :key="donVi.ma_don_vi" :value="donVi.ma_don_vi">
              {{ donVi.ten_don_vi }}
            </option>
          </select>
        </div>
      </div>  
      <div class="row">
        <div class="col-md-6">
          <label for="" class="col-form-label">Vai trò</label>
          <select v-model="maVaiTro" class="form-control form-select h-auto wide">
            <option v-for="vaiTro in vaiTros" :key="vaiTro.ma_vai_tro" :value="vaiTro.ma_vai_tro">
              {{ vaiTro.ten_vai_tro }}
            </option>
          </select>
        </div>
      </div>  
      <div class="d-flex justify-content-start mt-4">
        <button type="submit" class="btn btn-success me-3"><i class="bi bi-plus-circle"></i> Thêm vận đơn</button>
        <button type="button" class="btn btn-danger" @click="resetForm"><i class="bi bi-x-circle"></i> Reset</button>
      </div> 
    </form>
  </div>
</template>
<script>
import { ref, onMounted, computed } from 'vue';
import NavbarAdmin from '../../../components/NavbarAdmin.vue';
import axios from 'axios';
import router from '../../../routers/router';
export default {
  setup(){
    const donVis = ref([]);
    const vaiTros = ref([]);  
    const email = ref('');
    const hoVaTen = ref('');
    const soDienThoai = ref('');
    const maDonVi = ref('');
    const maVaiTro = ref(0);
    const matKhau = ref('');
    const matKhauNhapLai = ref('');
    const emailError = ref(false);
    const matKhauError = ref(false);

    const resetForm = () => {
      email.value = '';
      hoVaTen.value = '';
      email.value = '';
      soDienThoai.value = '';
      maDonVi.value = '';
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
      axios.get(`/api/danh-muc/vai-tro`, {
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
    
    const addNguoiDung = async() => {
      validateEmail();
      validatePasswords();
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
        alert('Thêm doanh nghiệp thành công');
        router.push('/quan_ly_nguoi_dung');
        //showModal.value = true;
      } catch (error) {
        console.log(error);
        alert('Thêm doanh nghiệp thất bại');
      }
    };


    onMounted(() => {
      document.title = "Thêm doanh nghiệp";
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
      validateEmail,
      validatePasswords
    }
  },
  components: {
    NavbarAdmin
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