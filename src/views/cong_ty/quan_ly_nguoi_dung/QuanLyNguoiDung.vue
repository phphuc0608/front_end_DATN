<template>
  <NavbarCongty />
  <div id="content" class="container-fluid px-5">
    <h3 class="text-center" style="margin-top: 110px; margin-bottom: 30px;">QUẢN LÝ NGƯỜI DÙNG CỦA CÔNG TY</h3>
    <div id="search_box" class="box_container col-md-12">
      <div id="search_box_header" class="header_container d-flex justify-content-between align-items-center">
        <span class="title">
          <i class="bi bi-funnel-fill"></i> Filter
        </span>
        <i id="filterUp" class="bi bi-caret-up-fill" @click="filterClicked"></i>
      </div>
      <div id="search_box_content">
        <div class="row">
          <div class="col-xl-3 col-sm-6">
            <label class="form-label">Tìm kiếm</label>
            <input type="text" class="form-control mb-xl-0 mb-3" placeholder="Tìm kiếm" v-model="searchString">
          </div>
          <div class="col-xl-3 col-sm-6 mb-3 mb-xl-0">
            <label class="form-label" for="">Trạng thái</label>
            <select class="form-control form-select h-auto wide" v-model="searchDangHoatDong">
              <option selected></option>
              <option value="false">Đang hoạt động</option>
              <option value="true">Khóa hoạt động</option>
            </select>
          </div>
          <div class="col-xl-3 col-sm-6">
            <label class="form-label" for="">Vai trò</label>
            <select class="form-control form-select h-auto wide" v-model="searchVaiTro">
              <option></option>
              <option v-for="vaiTro in vaiTros.filter(vaiTro => [3, 5].includes(vaiTro.ma_vai_tro))" :key="vaiTro.ma_vai_tro" :value="vaiTro.ma_vai_tro">
                {{ vaiTro.ten_vai_tro }}
              </option>
            </select>
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
    <div class="header_container">
      <span class="title">
        <i class="bi bi-table"></i> Bảng tài khoản
      </span>
    </div>
    <div class="table_container p-3">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Email</th>
              <th scope="col">Họ và tên</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Đơn vị</th>
              <th scope="col">Vai trò</th>
              <th scope="col" class="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(nguoiDung, index) in paginatedData" :key="index">
              <td>{{ nguoiDung.email }}</td>
              <td>{{ nguoiDung.ho_va_ten }}</td>
              <td :class="{'active': nguoiDung.dang_hoat_dong, 'inactive': !nguoiDung.dang_hoat_dong}">
                {{ nguoiDung.dang_hoat_dong ? 'Đang hoạt động' : 'Khóa hoạt động' }}
              </td>
              <td>{{ nguoiDung.thuoc_don_vi }}</td>
              <td>{{ nguoiDung.vai_tro.ten_vai_tro }}</td>
              <td class="text-end">
                <router-link class="btn btn-warning me-2 update_btn" :to="{ name: 'CapNhatNguoiDungCongTy', params: { email: nguoiDung.email } }">
                  <i class="bi bi-pencil-fill"></i>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Pagination :totalItems="nguoiDungs.length" :itemsPerPage="itemsPerPage" :currentPage="currentPage" @page-changed="changePage" />
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed, watch} from 'vue';
import NavbarCongty from '../../../components/NavbarCongty.vue';
import Pagination from '../../../components/Pagination.vue';

export default {
  setup() {
    const nguoiDungs = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(5);
    const searchString = ref('');
    const searchVaiTro = ref('');
    const searchDangHoatDong = ref('');
    const vaiTros = ref([]);
    const savedThuocDonVi = ref(localStorage.getItem('savedThuocDonVi'));

    onMounted(() => {
      document.title = "Quản lý người dùng công ty";
    });
    
    const removeFilter = () => {
      searchString.value = '';
      searchVaiTro.value = '';
      searchDangHoatDong.value = '';
      getNguoiDungs();
    };

    const getNguoiDungs = () => {
      axios.get(`/api/nguoi-dung/don-vi/${savedThuocDonVi.value}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function(response){
        nguoiDungs.value = response.data;
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

    const search = async () => {
      try {
        let apiUrl = `/api/nguoi-dung/don-vi/${savedThuocDonVi.value}?search_string=${searchString.value}&ma_vai_tro=${searchVaiTro.value}`;
        if (searchDangHoatDong.value !== null && searchDangHoatDong.value !== '') { 
            apiUrl += `&dang_hoat_dong=${searchDangHoatDong.value === 'true'}`; // Chuyển đổi thành boolean
        }
        const response = await axios.get(apiUrl, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        nguoiDungs.value = response.data;
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };


    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return nguoiDungs.value.slice(start, end);
    });

    const changePage = (page) => {
      currentPage.value = page;
    };

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

    getNguoiDungs();
    getDanhMucVaiTro();
    return{
      nguoiDungs,
      paginatedData,
      currentPage,
      itemsPerPage,
      changePage,
      filterClicked,
      searchString,
      search,
      searchVaiTro,
      vaiTros,
      savedThuocDonVi,
      searchDangHoatDong,
      removeFilter
    }
  },
  components:{
    NavbarCongty,
    Pagination
  },
} 
</script>

<style scoped>
*{
  font-family: 'Space Grotesk', sans-serif;
}

.active {
  color: rgb(59, 224, 59);
}

.inactive {
  color: red;
}

#content{
  margin-top: 80px;
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
</style>