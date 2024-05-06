<template>
  <NavbarAdmin/>
  <div id="content" class="container">
    <h3 class="my-4 text-left">THÊM DOANH NGHIỆP</h3>
    <form @submit.prevent="addDoanhNghiep">
      <div class="row">
        <div class="col-md-6">
          <label class="col-form-label">Mã đơn vị</label>
          <input v-model="maDonVi" type="text" class="form-control" placeholder="Nhập mã đơn vị">
        </div>
        <div class="col-md-6">
          <label for="" class="col-form-label">Tên đơn vị</label>
          <input v-model="tenDonVi" type="text" class="form-control" placeholder="Nhập tên đơn vị">
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label for="" class="col-form-label">Email</label>
          <input v-model="email" type="text" class="form-control" placeholder="Nhập email">
        </div>
        <div class="col-md-6">
          <label for="" class="col-form-label">Số điện thoại</label>
          <input v-model="soDienThoai" type="text" class="form-control" placeholder="Nhập số điện thoại">
        </div>
      </div>  
      <div class="row">
        <div class="col-md-12">
          <label for="" class="col-form-label">Danh mục đơn vị</label>
          <select v-model="maDanhMucDonVi" class="form-control form-select h-auto wide">
            <option v-for="danhMucDonVi in danhMucDonVis" :key="danhMucDonVi.ma_danh_muc_don_vi" :value="danhMucDonVi.ma_danh_muc_don_vi">
              {{ danhMucDonVi.ten_danh_muc_don_vi }}
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
  <!-- <div class="modal" tabindex="-1" role="dialog" v-if="showModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirmation</h5>
          <button type="button" class="close" @click="showModal = false">
            <span>&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Thêm doanh nghiệp thành công.</p>
          <p>Bạn có muốn quay lại trang quản lý doanh nghiệp không?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="goToQuanLyDoanhNghiep">Đồng ý</button>
          <button type="button" class="btn btn-secondary" @click="showModal = false">Đóng</button>
        </div>
      </div>
    </div>
  </div> -->
</template>
<script>
import { ref, onMounted, computed } from 'vue';
import NavbarAdmin from '../../../components/NavbarAdmin.vue';
import axios from 'axios';
import router from '../../../routers/router';
export default {
  setup(){
    const danhMucDonVis = ref([]);
    const maDonVi = ref('');
    const tenDonVi = ref('');
    const email = ref('');
    const soDienThoai = ref('');
    const maDanhMucDonVi = ref(0);
    // const showModal = ref(false);

    // const goToQuanLyDoanhNghiep = () => {
    //   router.push('/quan_ly_doanh_nghiep');
    // };

    const resetForm = () => {
      maDonVi.value = '';
      tenDonVi.value = '';
      email.value = '';
      soDienThoai.value = '';
      maDanhMucDonVi.value = 0;
    };

    const getDanhMucDonVi = () => {
      axios.get(`/api/danh-muc/don-vi`, {
        headers: {
          'Content-Type': 'application/json'
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
    
    const addDoanhNghiep = async() => {
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
            'Content-Type': 'application/json'
          }
        });
        console.log(response.data);
        alert('Thêm doanh nghiệp thành công');
        router.push('/quan_ly_doanh_nghiep');
        //showModal.value = true;
      } catch (error) {
        console.log(error);
        alert('Thêm doanh nghiệp thất bại');
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
      // showModal,
      // goToQuanLyDoanhNghiep
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
</style>