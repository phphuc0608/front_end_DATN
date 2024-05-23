<template>
  <NavbarCongty/>
  <div id="content" class="container">
    <h3 class="my-4 text-left">CHI TIẾT VẬN ĐƠN CÓ MÃ {{ maVanDon }}</h3>
    <form>
      <div class="row">
        <div class="col-md-6">
          <label class="form-label">Tên hàng hóa</label>
          <input v-model="tenHangHoa" type="text" class="form-control mb-3" placeholder="Nhập tên hàng hóa" readonly> 
        </div>
        <div class="col-md-6">
          <label class="form-label">Danh mục hàng hóa</label>
          <select v-model="maDanhMucHangHoa" class="form-select mb-3" disabled>
            <option v-for="danhMucHangHoa in danhMucHangHoas" :value="danhMucHangHoa.ma_danh_muc_hang_hoa">{{ danhMucHangHoa.ten_danh_muc_hang_hoa }}</option>
          </select>
        </div>
      </div>   
      <div class="row">
        <div class="col-md-6">
          <label class="form-label">Đơn vị nhập khẩu</label>
          <select v-model="donViNhapKhau" class="form-control form-select h-auto wide" disabled>
            <option v-for="donVi in donVis" :key="donVi.ma_don_vi" :value="donVi.ma_don_vi">
              {{ donVi.ten_don_vi }}
            </option>
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label">Đơn vị xuất khẩu</label>
          <select v-model="donViXuatKhau" class="form-control form-select h-auto wide" disabled>
            <option v-for="donVi in donVis" :key="donVi.ma_don_vi" :value="donVi.ma_don_vi">
              {{ donVi.ten_don_vi }}
            </option>
          </select>
        </div>
      </div> 
      <div class="row">
        <div class="col-md-6">
          <label class="form-label">Biển số xe</label>
          <input v-model="bienSo" type="text" class="form-control mb-3" placeholder="Nhập biển số xe" readonly>
        </div>
        <div class="col-md-6">
          <label class="form-label">Người tạo</label>
          <input v-model="nguoiTao" type="text" class="form-control mb-3" readonly>
        </div>
      </div> 
      <div class="row">
        <div class="col-md-6">
          <label class="form-label">Số lượng</label>
          <input v-model="soLuong" type="number" class="form-control mb-3" placeholder="Nhập số lượng" readonly>
        </div>
        <div class="col-md-6">
          <label class="form-label">Trọng lượng</label>
          <input v-model="trongLuong" type="number" class="form-control mb-3" placeholder="Nhập trọng lượng" readonly>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <label class="form-label">Mô tả</label>
          <textarea v-model="moTa" class="form-control mb-3" readonly></textarea>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import { ref, onMounted } from 'vue';
import NavbarCongty from '../../../components/NavbarCongty.vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

export default {
  setup(){
    const route = useRoute();
    const maVanDon = ref(0);
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
    const nguoiTao = ref('');

    const getDanhMucHangHoa = () => {
      axios.get(`/api/danh-muc-hang-hoa`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function(response){
        danhMucHangHoas.value = response.data; 
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
        maVanDon.value = vanDon.ma_van_don;
        soLuong.value = vanDon.so_luong;
        trongLuong.value = vanDon.trong_luong;
        tenHangHoa.value = vanDon.ten_hang_hoa;
        moTa.value = vanDon.mo_ta;
        maDanhMucHangHoa.value = vanDon.ma_danh_muc_hang_hoa;
        donViXuatKhau.value = vanDon.don_vi_xuat_khau;
        donViNhapKhau.value = vanDon.don_vi_nhap_khau;
        bienSo.value = vanDon.bien_so;
        nguoiTao.value = vanDon.nguoi_dung.email;
        console.log(vanDon);
      } catch (error) {
        console.log(error);
      }
    };

    onMounted(async() => {
      document.title = "Chi tiết vận đơn";
      await getVanDonById();
      await getDanhMucHangHoa();
      await getDonVis();
    });

    return {
      danhMucHangHoas,
      donVis,
      maVanDon,
      soLuong,
      trongLuong,
      tenHangHoa,
      moTa,
      maDanhMucHangHoa,
      donViXuatKhau,
      donViNhapKhau,
      bienSo,
      nguoiTao
    }
  },
  components: {
    NavbarCongty
  },
}
</script>
<style scoped>
#content{
  margin-top: 120px;
}
.option_danhMucHangHoa{
  padding: 10px;
}
</style>