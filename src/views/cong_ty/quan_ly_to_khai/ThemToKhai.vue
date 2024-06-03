<template>
  <NavbarCongty/>
  <div id="content" class="container">
    <h3 class="my-4 text-left">THÊM TỜ KHAI</h3>
    <Calendar/>
    <div class="gioi_han_to_khai my-2">
      <h5 class="p-0 m-0">Giới hạn {{ gioiHanToKhai }} tờ khai</h5>
    </div>
    <form @submit.prevent="addToKhai">
      <div class="row">
        <div class="col-md-6">
          <label class="col-form-label">Email</label>
          <input v-model="email" type="text" :class="{'is-invalid': emailError}" class="form-control" placeholder="Nhập email" :title="emailError ? 'Email không đúng định dạng' : ''" required readonly>
        </div>
        <div class="col-md-6">
          <label for="" class="col-form-label">Đơn vị đăng ký</label>
          <input type="text" v-model="maDonVi" class="form-control h-auto wide" required readonly>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label for="" class="col-form-label">Vận đơn</label>
          <select v-model="maToKhai" class="form-control form-select h-auto wide" required>
            <option v-for="ToKhai in vanDons" :key="ToKhai.ma_van_don" :value="ToKhai.ma_van_don">
              {{ ToKhai.ma_van_don }} - {{ ToKhai.ten_hang_hoa }}
            </option>
          </select>
        </div>
        <div class="col-md-6">
          <label for="" class="col-form-label">Ngày đăng ký</label>
          <input type="date" class="form-control h-auto wide" v-model="ngayDangKy" required>
        </div>
      </div> 
      <div class="d-flex justify-content-start my-4">
        <button type="submit" class="btn btn-success me-3"><i class="bi bi-plus-circle"></i> Thêm tờ khai</button>
        <button type="button" class="btn btn-danger" @click="resetForm"><i class="bi bi-x-circle"></i> Reset</button>
      </div> 
    </form>
  </div>
</template>
<script>
import { ref, onMounted, watch } from 'vue';
import NavbarCongty from '../../../components/NavbarCongty.vue';
import Calendar from '../../../components/Calendar.vue';
import axios from 'axios';
import router from '../../../routers/router';

import Swal from 'sweetalert2';

export default {
  setup(){
    const donVis = ref([]); 
    const vanDons = ref([]);
    const email = ref(localStorage.getItem('savedEmail'));
    const maDonVi = ref(localStorage.getItem('savedThuocDonVi'));
    const maToKhai = ref('');
    const emailError = ref(false);
    const ngayDangKy = ref('');
    const toKhaiTheoNgay = ref(0);
    const ngayDangKyFormat = ref('');
    const gioiHanToKhai = ref(0);

    // Watcher để theo dõi sự thay đổi của ngayDangKy
    watch(ngayDangKy, (newDate) => {
      if (newDate) { // Kiểm tra xem newDate có giá trị hợp lệ
        getToKhaiTheoNgays(); 
      }
    });

    const resetForm = () => {
      maToKhai.value = '';
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }; 

    const getGioiHanToKhai = () => {
      axios.get('/api/gioi-han-to-khai', {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(function(response){
        gioiHanToKhai.value = response.data;
        console.log(response.data); 
      })
      .catch(function(error){
        console.log(error);
      });
    };

    const getDonVis = () => {
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
    
    const getVanDons = async() => {
      try {
        const response = await axios.get(`/api/van-don/doanh-nghiep/${maDonVi.value}`);
        vanDons.value = response.data;
      } catch (error) {
        console.log(error);
      }
    };

    const getToKhaiTheoNgays = async () => {
      ngayDangKyFormat.value = formatDate(ngayDangKy.value); // Format trước khi gọi API
      try {
        const response = await axios.get(`/api/to-khai/ngay-dang-ky/${ngayDangKyFormat.value}/tong-so`);
        toKhaiTheoNgay.value = response.data;
        // console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const validateEmail = () => {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      emailError.value = !re.test(email.value);
    };

    const addToKhai = async() => {
      validateEmail();
      if (emailError.value) {
        return;
      }
      console.log(toKhaiTheoNgay.value);
      // Kiểm tra số lượng tờ khai của ngày đó trước khi thêm
      if (toKhaiTheoNgay.value >= gioiHanToKhai.value) {
        Swal.fire({
          icon: 'warning',
          title: 'Số lượng tờ khai đã đủ',
        });
        return; 
      }
      const toKhaiData = {
        email: email.value,
        don_vi_dang_ky: maDonVi.value,
        ma_van_don: maToKhai.value,
        ngay_dang_ky: ngayDangKy.value,
      };
      console.log(toKhaiData);
      try {
        const response = await axios.post(`/api/to-khai`, toKhaiData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data);
        Swal.fire({
          icon: 'success',
          title: 'Thêm tờ khai thành công',
        });
        router.back('/quan_ly_to_khai');
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Thêm tờ khai thất bại',
        });
      }
    };


    onMounted(() => {
      document.title = "Thêm tờ khai";
    });

    getDonVis();
    getVanDons();
    getToKhaiTheoNgays();
    getGioiHanToKhai();
    return {
      donVis,
      resetForm,
      email,
      ngayDangKy,
      maDonVi,
      maToKhai,
      vanDons,
      emailError,
      validateEmail,
      addToKhai,
      toKhaiTheoNgay,
      formatDate,
      ngayDangKyFormat,
      gioiHanToKhai
    }
  },
  components: {
    NavbarCongty,
    Calendar
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