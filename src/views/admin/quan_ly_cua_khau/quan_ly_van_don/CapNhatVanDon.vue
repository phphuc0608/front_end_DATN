<template>
  <NavbarAdmin/>
  <div id="content" class="container">
    <h3 class="my-4 text-left">CẬP NHẬT VẬN ĐƠN</h3>
    <form @submit.prevent="updateVanDon">
      <div class="row">
        <div class="col-md-6">
          <label class="form-label">Số lượng</label>
          <input v-model="soLuong" type="number" class="form-control mb-3" placeholder="Nhập số lượng">
        </div>
        <div class="col-md-6">
          <label class="form-label">Trọng lượng</label>
          <input v-model="trongLuong" type="number" class="form-control mb-3" placeholder="Nhập trọng lượng">
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label class="form-label">Tên hàng hóa</label>
          <input v-model="tenHangHoa" type="text" class="form-control mb-3" placeholder="Nhập tên hàng hóa">
        </div>
        <div class="col-md-6">
          <label class="form-label">Danh mục hàng hóa</label>
          <select v-model="maDanhMucHangHoa" class="form-control form-select h-auto wide">
            <option v-for="danhMucHangHoa in danhMucHangHoas" :key="danhMucHangHoa.ma_danh_muc_hang_hoa" :value="danhMucHangHoa.ma_danh_muc_hang_hoa">
              {{ danhMucHangHoa.ten_danh_muc_hang_hoa }}
            </option>
          </select>
        </div>
      </div>   
      <div class="row">
        <div class="col-md-6">
          <label class="form-label">Đơn vị nhập khẩu</label>
          <select v-model="donViNhapKhau" class="form-control form-select h-auto wide">
            <option v-for="donVi in donVis" :key="donVi.ma_don_vi" :value="donVi.ma_don_vi">
              {{ donVi.ten_don_vi }}
            </option>
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label">Đơn vị xuất khẩu</label>
          <select v-model="donViXuatKhau" class="form-control form-select h-auto wide">
            <option v-for="donVi in donVis" :key="donVi.ma_don_vi" :value="donVi.ma_don_vi">
              {{ donVi.ten_don_vi }}
            </option>
          </select>
        </div>
      </div> 
      <div class="row">
        <div class="col-md-6">
          <label class="form-label">Biển số xe</label>
          <input v-model="bienSo" type="text" class="form-control mb-3" placeholder="Nhập biển số xe">
        </div>
      </div> 
      <div class="row">
        <div class="col-md-12">
          <label class="form-label">Mô tả</label>
          <textarea v-model="moTa" class="form-control mb-3"></textarea>
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
import NavbarAdmin from '../../../../components/NavbarAdmin.vue';
import axios from 'axios';
import router from '../../../../routers/router';
export default {
  setup(){
    // const router = useRouter();
    const soLuong = ref(0);
    const trongLuong = ref(0);
    const tenHangHoa = ref('');
    const moTa = ref('');
    const maDanhMucHangHoa = ref('');
    const donViXuatKhau = ref('');
    const donViNhapKhau = ref('');
    const bienSo = ref('');
    const danhMucHangHoas = ref([]); 
    const donVis = ref([]);

    const resetForm = () => {
      soLuong.value = 0;
      trongLuong.value = 0;
      tenHangHoa.value = '';
      moTa.value = '';
      maDanhMucHangHoa.value = '';
      donViXuatKhau.value = '';
      donViNhapKhau.value = '';
      bienSo.value = '';
    };

    const getDanhMucHangHoa = () => {
      axios.get(`/api/danh-muc-hang-hoa`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function(response){
        danhMucHangHoas.value = response.data;
        console.log(response.data); 
      })
      .catch(function(error){
        console.log(error);
      });
    };
    
    const getDonVis = () => {
      axios.get(`/api/don-vi`, {
        headers: {
          'Content-Type': 'application/json',
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

    const getVanDonById = async () => {
      const maVanDonParam = route.params.ma_van_don;
      try {
        const response = await axios.get(`/api/van-don/${maVanDonParam}`,{
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const vanDon = response.data;
        soLuong.value = vanDon.so_luong;
        trongLuong.value = vanDon.trong_luong;
        tenHangHoa.value = vanDon.ten_hang_hoa;
        moTa.value = vanDon.mo_ta;
        maDanhMucHangHoa.value = vanDon.ma_danh_muc_hang_hoa;
        donViXuatKhau.value = vanDon.ma_don_vi_xuat_khau;
        donViNhapKhau.value = vanDon.ma_don_vi_nhap_khau;
        bienSo.value = vanDon.bien_so;
      } catch (error) {
        console.log(error);
      }
    };

    const updateVanDon = async()=>{
      const vanDon = {
        so_luong: soLuong.value,
        trong_luong: trongLuong.value,
        ten_hang_hoa: tenHangHoa.value,
        mo_ta: moTa.value,
        ma_danh_muc_hang_hoa: maDanhMucHangHoa.value,
        ma_don_vi_xuat_khau: donViXuatKhau.value,
        ma_don_vi_nhap_khau: donViNhapKhau.value,
        bien_so: bienSo.value
      };
      try {
        await axios.put(`/api/van-don/${route.params.ma_van_don}`, vanDon);
        alert('Cập nhật vận đơn thành công');
        router.push('/quan-ly-van-don');
      } catch (error) {
        console.log(error);
        alert('Cập nhật vận đơn thất bại');
      }
    }

    onMounted(async() => {
      document.title = "Cập nhật vận đơn";
      await getVanDonById();
      await getDanhMucHangHoa();
      await getDonVis();
    });

    return {
      danhMucHangHoas,
      donVis,
      resetForm,
      soLuong,
      trongLuong,
      tenHangHoa,
      moTa,
      maDanhMucHangHoa,
      donViXuatKhau,
      donViNhapKhau,
      bienSo,
      updateVanDon
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
.option_danhMucHangHoa{
  padding: 10px;
}
</style>