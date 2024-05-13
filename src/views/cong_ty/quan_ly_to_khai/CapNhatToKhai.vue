<template>
  <NavbarAdmin/>
  <div id="content" class="container">
    <h3 class="my-4 text-left">CẬP NHẬT TỜ KHAI</h3>
    <form @submit.prevent="updateToKhai">
      <div class="row">
        <!-- <div class="col-md-6">
          <label class="col-form-label">Mã tờ khai</label>
          <input v-model="ma_to_khai" type="number" class="form-control" required readonly>
        </div> -->
        <div class="col-md-6">
          <label class="col-form-label">Email người đăng ký</label>
          <input v-model="email" type="text" :class="{'is-invalid': emailError}" class="form-control" placeholder="Nhập email" :title="emailError ? 'Email không đúng định dạng' : ''" required readonly>
        </div>
        <div class="col-md-6">
          <label for="" class="col-form-label">Đơn vị đăng ký</label>
          <select v-model="maDonVi" class="form-control form-select h-auto wide" required>
            <option v-for="donVi in donVis" :key="donVi.ma_don_vi" :value="donVi.ma_don_vi">
              {{ donVi.ten_don_vi }}
            </option>
          </select>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label for="" class="col-form-label">Vận đơn</label>
          <select v-model="maVanDon" class="form-control form-select h-auto wide" required>
            <option v-for="vanDon in vanDons" :key="vanDon.ma_van_don" :value="vanDon.ma_van_don">
              {{ vanDon.ma_van_don }} - {{ vanDon.ten_hang_hoa }}
            </option>
          </select>
        </div>
        <div class="col-md-6">
          <label for="" class="col-form-label">Trạng thái</label>
          <select v-model="maTrangThai" class="form-control form-select h-auto wide" required>
            <option v-for="trangThai in trangThais" :key="trangThai.ma_trang_thai" :value="trangThai.ma_trang_thai">
              {{ trangThai.ten_trang_thai }}
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
import { ref, onMounted, computed } from 'vue';
import NavbarAdmin from '../../../../components/NavbarAdmin.vue';
import axios from 'axios';
import router from '../../../../routers/router';
import { useRoute } from 'vue-router';
export default {
  setup(){
    const route = useRoute(); 
    const donVis = ref([]);
    const trangThais = ref([]);
    const vanDons = ref([]);
    const maDonVi = ref('');
    const maVanDon = ref('');
    const maTrangThai = ref('');
    const email = ref(localStorage.getItem('savedEmail'));
    const emailError = ref(false);
    
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

    const getDanhMucTrangThai = () => {
      axios.get(`/api/trang-thai-to-khai`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function(response){
        trangThais.value = response.data;
        console.log(response.data); 
      })
      .catch(function(error){
        console.log(error);
      });
    };

    const getToKhaiById = async () => {
      const maToKhaiParam = route.params.ma_to_khai;
      try {
        const response = await axios.get(`/api/to-khai/${maToKhaiParam}`,{
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const toKhai = response.data;
        maDonVi.value = toKhai.don_vi_dang_ky;
        maVanDon.value = toKhai.ma_van_don;
        maTrangThai.value = toKhai.ma_trang_thai;
        email.value = toKhai.email_nguoi_dang_ky;
        console.log(toKhai);
      } catch (error) {
        console.log(error);
      }
    };

    const getVanDons = () => {
      axios.get(`/api/van-don`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function(response){
        vanDons.value = response.data;
        console.log(response.data); 
      })
      .catch(function(error){
        console.log(error);
      });
    };

    const updateToKhai = async()=>{
      const toKhai = {
        email_nguoi_dang_ky: email.value,
        don_vi_dang_ky: maDonVi.value,
        ma_trang_thai: maTrangThai.value,
        ma_van_don: maVanDon.value,
      };
      try {
        await axios.put(`/api/to-khai/${route.params.ma_to_khai}`, toKhai);
        alert('Cập nhật tờ khai thành công');
        router.push('/quan_ly_to_khai');
      } catch (error) {
        console.log(error);
        alert('Cập nhật tờ khai thất bại');
      }
    }

    onMounted(async() => {
      document.title = "Cập nhật tờ khai";
      await getToKhaiById();
      await getDanhMucTrangThai();
      await getDonVis();
      await getVanDons();
    });

    return {
      donVis,
      trangThais,
      vanDons,
      maDonVi,
      maVanDon,
      maTrangThai,
      email,
      emailError,
      updateToKhai
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