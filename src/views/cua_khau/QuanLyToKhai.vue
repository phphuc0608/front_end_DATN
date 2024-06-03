<template>
<NavbarCuakhau/>
<div id="content" class="container-fluid px-5">
    <h3 class="text-center" style="margin-top: 110px; margin-bottom: 30px;">QUẢN LÝ TỜ KHAI</h3>
    <Calendar/> 
    <div class="col-md-12 d-flex my-3 align-items-center justify-content-between">
      <button id="btn_add" type="button" data-bs-toggle="modal" data-bs-target="#update_so_luong" class="btn btn-primary">
        <i class="bi bi-pencil-fill"></i> Cập nhật giới hạn số lượng tờ khai
      </button>
      <div class="gioi_han_to_khai mx-2">
        <h5 class="p-0 m-0">Giới hạn {{ gioiHanToKhai }} tờ khai</h5>
      </div>
    </div>
    <div id="search_box" class="box_container col-md-12 mt-3">
      <div id="search_box_header" class="header_container d-flex justify-content-between align-items-center">
        <span class="title">
          <i class="bi bi-funnel-fill"></i> Filter
        </span>
        <i id="filterUp" class="bi bi-caret-up-fill" @click="filterClicked"></i>
      </div>
      <div id="search_box_content">
        <div class="row">
          <div class="col-md-9 col-sm-6">
            <label class="form-label">Tìm kiếm</label>
            <input type="date" class="form-control mb-xl-0 mb-3" placeholder="Tìm kiếm" v-model="dateString">
          </div>
          <div class="col-xl-3 col-sm-6 align-self-end">
            <div>
              <button class="btn btn-primary me-2" title="Nhấn vào đây để tìm kiếm" type="button" @click="search">
                <i class="bi bi-funnel-fill"></i> Filter
              </button>
              <button class="btn light rev_button" title="Nhấn vào đây để xóa filter" type="button" @click="removeFilter">
                Remove filter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container-fluid px-5">
    <div class="header_container d-flex justify-content-between align-items-center">
      <span class="title">
        <i class="bi bi-table"></i> Bảng tờ khai
      </span>
    </div>
    <div class="table_container p-3">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Mã tờ khai</th>
              <th scope="col">Biển số xe</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Ngày đăng ký</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(toKhai, index) in paginatedData" :key="index">
              <td>{{ toKhai.ma_to_khai }}</td>
              <td>{{ toKhai.van_don.bien_so }}</td>
              <td :class="getClassByTrangThai(toKhai.trang_thai_to_khai.ten_trang_thai)">
                {{ toKhai.trang_thai_to_khai.ten_trang_thai }}
              </td>
              <td>{{ toKhai.ngay_dang_ky }}</td> 
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Pagination :totalItems="toKhais.length" :itemsPerPage="itemsPerPage" :currentPage="currentPage" @page-changed="changePage" />
    <!-- Update so luong -->
    <div style="margin-top: 200px;" class="modal" id="update_so_luong" tabindex="-1" role="dialog" aria-labelledby="update_so_luong_label" aria-hidden="true">
      <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="add_champion_label">Cập nhật giới hạn số lượng tờ khai</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
          <div class="modal-body">
            <form @submit.prevent="addGioiHanToKhai" enctype="multipart/form-data">
              <div class="form-group">
                <label for="gioiHanToKhai">Số lượng:</label>
                <input v-model="gioiHanToKhai" type="number" class="form-control" id="gioiHanToKhai" placeholder="Nhập số lượng tờ khai" required>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary py-2 px-3" data-dismiss="modal">Đóng</button>
                <button type="submit" class="btn btn-primary py-2 px-3">Cập nhật</button>
              </div>
            </form>
          </div>
        </div> 
      </div> 
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import NavbarCuakhau from '../../components/NavbarCuakhau.vue';
import Pagination from '../../components/Pagination.vue';
import Calendar from '../../components/Calendar.vue';

export default {
  setup() {
    const toKhais = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(5);
    const dateString = ref('');
    const maDanhMucTrangThai = ref('');
    const danhMucTrangThais = ref([]);
    const ngayDangKy = ref(new Date().toISOString().substr(0, 10));
    const gioiHanToKhai = ref(0);

    onMounted(() => {
      document.title = "Quản lý tờ khai";
    });

    const filterClicked = () => {
      let search_box_container = document.getElementById('search_box_content');
      let icon = document.getElementById('filterUp');
      if(search_box_container.style.display === 'none'){
        search_box_container.style.display = 'block';
        icon.className = 'bi bi-caret-up-fill';
      }else{
        search_box_container.style.display = 'none';
        icon.className = 'bi bi-caret-down-fill';
      }
    };

    const search = () => {
      // Convert dateString to 'yyyy-mm-dd' format
      let date = new Date(dateString.value);
      let formattedDate = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');

      let url = `/api/to-khai/ngay-dang-ky/${formattedDate}`;
      if (maDanhMucTrangThai.value) {
        url += `&ma_trang_thai=${maDanhMucTrangThai.value}`;
      }
      axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(function(response){
        toKhais.value = response.data;
        console.log(response.data); 
      })
      .catch(function(error){
        console.log(error);
      });
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

    const getClassByTrangThai = (trangThai) => {
      if(trangThai === 'Đã thông quan'){
        return 'trang-thai-da-thong-quan';
      }else if(trangThai === 'Chờ thông quan'){
        return 'trang-thai-cho-thong-quan';
      }else if(trangThai === 'Bị hủy'){
        return 'trang-thai-bi-huy';
      }
    };

    const addGioiHanToKhai = () => {
      axios.post('/api/gioi-han-to-khai', {
        so_luong_gioi_han: gioiHanToKhai.value
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(function(response){
        console.log(response.data); 
      })
      .catch(function(error){
        console.log(error);
      });
    };

    const removeFilter = () => {
      dateString.value = '';
      maDanhMucTrangThai.value = '';
      getToKhaiTheoNgayDangKys();
    };

    const getToKhaiTheoNgayDangKys = () => {
      axios.get(`/api/to-khai/ngay-dang-ky/${ngayDangKy.value}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(function(response){
        toKhais.value = response.data;
        console.log(response.data); 
      })
      .catch(function(error){
        console.log(error);
      });
    };

    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return toKhais.value.slice(start, end);
    });

    const changePage = (page) => {
      currentPage.value = page;
    };


    getToKhaiTheoNgayDangKys();
    getGioiHanToKhai();

    return {
      toKhais,
      paginatedData,
      currentPage,
      itemsPerPage,
      changePage,
      filterClicked,
      dateString,
      maDanhMucTrangThai,
      danhMucTrangThais,
      search,
      removeFilter,
      ngayDangKy,
      getClassByTrangThai,
      gioiHanToKhai,
      addGioiHanToKhai
    }
  },

  components:{
    NavbarCuakhau,
    Pagination,
    Calendar
  },
} 
</script>

<style scoped>
*{
  font-family: 'Space Grotesk', sans-serif;
}
#app{
  min-height: 100%;
}
.box_container{
  background-color: white;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}
.header_container{
  color: white;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  border-top-left-radius: 0.425rem;
  border-top-right-radius: 0.425rem;
  border-bottom: 1px solid #dad8d4;
  background-color: #452B90;
}
#search_box_content{
  background-color: white;
  padding: 1rem 1.5rem; 
  border-bottom-left-radius: 0.425rem;
  border-bottom-right-radius: 0.425rem;
  border: 1px solid #dad8d4;
}
.btn-primary{
  background-color: #452B90;
  border-color: #452B90;
  padding: 10.066px 19.250px;
}
.btn-warning{
  /* padding: 10.066px 19.250px; */
  color: white;
}
.btn-warning:hover{
  background-color: #ffad26;
  border-color: #ffad26;
  color: white;
}
.btn-primary:hover{
  background-color: #321f69;
  border-color: #321f69;
}
.rev_button{
  background-color: #ffdede;
  border-color: #ffdede;
  color: #FF5E5E;
  /* padding: 10.066px 19.250px */
}
.rev_button:hover{
  background-color: #d37272;
  border-color: #d37272;
  color: white;
}
.table_container{
  background-color: white; 
  border: 1px solid #dad8d4;
}
.del_button{
  background-color: #FF5E5E !important;
  border-color: #FF5E5E !important;
  color: white;
}
.del_button:hover{
  background-color: #ff6e6e !important;
  border-color: #ff6e6e !important;
  color: white;
}
.rev_button{
  background-color: #ffdede;
  border-color: #ffdede;
  color: #FF5E5E;
  padding: 10.066px 19.250px;
}
.rev_button:hover{
  background-color: #d37272;
  border-color: #d37272;
  color: white;
}
.pagination .page-item .page-link {
  text-decoration: none;
  color: #6e6e6e;
}
.pagination .page-item .page-link:hover{
  background-color: #452B90;
  color: white;
  border-color: #452B90; 
}
.trang-thai-da-thong-quan {
  color: rgb(59, 224, 59); 
}
.trang-thai-cho-thong-quan {
  color: orange; 
}
.trang-thai-bi-huy {
  color: red; 
}
</style>