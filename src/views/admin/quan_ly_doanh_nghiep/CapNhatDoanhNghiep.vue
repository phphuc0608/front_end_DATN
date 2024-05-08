<template>
  <NavbarAdmin/>
  <div id="content" class="container">
    <h3 class="my-4 text-left">CẬP NHẬT DOANH NGHIỆP</h3>
    <form @submit.prevent="updateDoanhNghiep">
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
        <div class="col-md-12">
          <label for="" class="col-form-label">Danh mục đơn vị</label>
          <select v-model="maDanhMucDonVi" class="form-control form-select h-auto wide" required>
            <option v-for="danhMucDonVi in danhMucDonVis" :key="danhMucDonVi.ma_danh_muc_don_vi" :value="danhMucDonVi.ma_danh_muc_don_vi">
              {{ danhMucDonVi.ten_danh_muc_don_vi }}
            </option>
          </select>
        </div>
      </div>  
      <div class="d-flex justify-content-start mt-4">
        <button type="submit" class="btn btn-warning me-3" style="color: white;"><i class="bi bi-pencil-fill"></i> Cập nhật</button>
      </div> 
    </form>
  </div>
</template>
<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import NavbarAdmin from '../../../components/NavbarAdmin.vue';
import { useRoute } from 'vue-router';
import router from '../../../routers/router';

export default {
  setup() {
    const route = useRoute();
    const maDonVi = ref('');
    const tenDonVi = ref('');
    const email = ref('');
    const soDienThoai = ref('');
    const maDanhMucDonVi = ref(0);
    const emailError = ref(false);
    const soDienThoaiError = ref(false);
    const danhMucDonVis = ref([]); // Đảm bảo biến này được khởi tạo và có dữ liệu

    const getDonViById = async () => {
      const maDonViParam = route.params.ma_don_vi;
      try {
        const response = await axios.get(`/api/don-vi/${maDonViParam}`,{
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const donVi = response.data;
        maDonVi.value = donVi.ma_don_vi;
        tenDonVi.value = donVi.ten_don_vi;
        email.value = donVi.email;
        soDienThoai.value = donVi.so_dien_thoai;
        maDanhMucDonVi.value = donVi.ma_danh_muc_don_vi;
      } catch (error) {
        console.log(error);
      }
    };

    const getDanhMucDonVi = async () => {
      try {
        const response = await axios.get(`/api/danh-muc-don-vi`,{
        headers: {
            'Content-Type': 'application/json',
          }
        });
        danhMucDonVis.value = response.data;
      } catch (error) {
        console.log(error);
      }
    };
    
    const validateEmail = () => {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      emailError.value = !re.test(email.value);
    };

    const validateSoDienThoai = () => {
      const re = /^\d{10}$/;
      soDienThoaiError.value = !re.test(soDienThoai.value);
    };


    const updateDoanhNghiep = async() => {
      validateEmail();
      validateSoDienThoai();
      if(emailError.value || soDienThoaiError.value){
        return;
      }
      const donVi = {
        ma_don_vi: maDonVi.value,
        ten_don_vi: tenDonVi.value,
        email: email.value,
        so_dien_thoai: soDienThoai.value,
        ma_danh_muc_don_vi: maDanhMucDonVi.value
      };
      try {
        await axios.put(`/api/don-vi/${maDonVi.value}`, donVi);
        alert('Cập nhật doanh nghiệp thành công');
        setTimeout(() => {
          router.push('/quan_ly_doanh_nghiep');
        }, 10);
      } catch (error) {
        console.log(error);
        alert('Cập nhật doanh nghiệp thất bại');
      }
    };

    onMounted(async () => {
      document.title = "Cập nhật doanh nghiệp";
      await getDonViById();
      await getDanhMucDonVi();
    });

    return {
      maDonVi,
      tenDonVi,
      email,
      soDienThoai,
      maDanhMucDonVi,
      updateDoanhNghiep,
      danhMucDonVis, // Trả về danh sách danh mục đơn vị để sử dụng trong template
    };
  },
  components: {
    NavbarAdmin
  }
};

</script>
<style>
#content{
  margin-top: 120px;
}
</style>