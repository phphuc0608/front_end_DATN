<template>
  <NavbarAdmin/>
  <div id="content" class="container">
    <h3 class="my-4 text-left">THÊM DOANH NGHIỆP</h3>
    <form @submit.prevent="addDoanhNghiep">
      <div class="row">
        <div class="col-md-6">
          <label class="col-form-label">Mã đơn vị</label>
          <input v-model="maDonVi" type="text" class="form-control" placeholder="Nhập mã đơn vị" required>
        </div>
        <div class="col-md-6">
          <label for="" class="col-form-label">Tên đơn vị</label>
          <input v-model="tenDonVi" type="text" class="form-control" placeholder="Nhập tên đơn vị" required>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label for="" class="col-form-label">Email</label>
          <input v-model="email" type="text" class="form-control" placeholder="Nhập email" :class="{'is-invalid': emailError}" :title="emailError ? 'Email không đúng định dạng' : ''" required>
        </div>
        <div class="col-md-6">
          <label for="" class="col-form-label">Số điện thoại</label>
          <input v-model="soDienThoai" type="text" class="form-control" placeholder="Nhập số điện thoại" :class="{'is-invalid': soDienThoaiError}" :title="soDienThoaiError ? 'Số điện thoại phải đủ 10 ký tự' : ''" required>
        </div>
      </div>  
      <div class="row">
        <div class="col-md-6">
          <label for="" class="col-form-label">Danh mục đơn vị</label>
          <select v-model="maDanhMucDonVi" class="form-control form-select h-auto wide" required>
            <option class="option_item"v-for="danhMucDonVi in danhMucDonVis" :key="danhMucDonVi.ma_danh_muc_don_vi" :value="danhMucDonVi.ma_danh_muc_don_vi">
              {{ danhMucDonVi.ten_danh_muc_don_vi }}
            </option>
          </select>
        </div>
      </div>  
      <div class="d-flex justify-content-start mt-4">
        <button type="submit" class="btn btn-success me-3"><i class="bi bi-plus-circle"></i> Thêm doanh nghiệp</button>
        <button type="button" class="btn btn-danger" @click="resetForm"><i class="bi bi-x-circle"></i> Reset</button>
      </div> 
    </form>
  </div>
</template>
<script>
import { ref, onMounted } from 'vue';
import NavbarAdmin from '../../../components/NavbarAdmin.vue';
import axios from 'axios';
import router from '../../../routers/router';
import Swal from 'sweetalert2';
export default {
  setup(){
    const danhMucDonVis = ref([]);
    const maDonVi = ref('');
    const tenDonVi = ref('');
    const email = ref('');
    const soDienThoai = ref('');
    const maDanhMucDonVi = ref('');
    const emailError = ref(false);
    const soDienThoaiError = ref(false);

    const resetForm = () => {
      maDonVi.value = '';
      tenDonVi.value = '';
      email.value = '';
      soDienThoai.value = '';
      maDanhMucDonVi.value = '';
    };

    const getDanhMucDonVi = () => {
      axios.get(`/api/danh-muc-don-vi`, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(function(response){
        console.log("Danh Muc Don Vis:", response.data);
        danhMucDonVis.value = response.data;
      })
      .catch(function(error){
        console.log(error);
      });
    };
    
    const validateEmail = () => {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      emailError.value = !re.test(email.value);
    };

    const validateSoDienThoai = () => {
      const re = /^\d{10}$/;
      soDienThoaiError.value = !re.test(soDienThoai.value);
    };

    const addDoanhNghiep = async() => {
      validateEmail();
      validateSoDienThoai();
      if(emailError.value || soDienThoaiError.value){
        return;
      }
      const doanhNghiepData = {
        ma_don_vi: maDonVi.value,
        ten_don_vi: tenDonVi.value,
        email: email.value,
        so_dien_thoai: soDienThoai.value,
        ma_danh_muc_don_vi: maDanhMucDonVi.value
      };
      console.log(doanhNghiepData);
      try {
        const response = await axios.post(`/api/don-vi`, doanhNghiepData, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        console.log(response.data);
        Swal.fire({
          icon: 'success',
          title: 'Thêm doanh nghiệp thành công',
        });
        router.back('/quan_ly_doanh_nghiep');
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Thêm doanh nghiệp thất bại',
        });
      }
    };


    onMounted(() => {
      document.title = "Thêm doanh nghiệp";
    });

    getDanhMucDonVi();
    return {
      danhMucDonVis,
      resetForm,
      maDonVi,
      tenDonVi,
      email,
      soDienThoai,
      maDanhMucDonVi,
      addDoanhNghiep,
      emailError,
      soDienThoaiError
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
.option_item{
  padding: 10px;
}
</style>