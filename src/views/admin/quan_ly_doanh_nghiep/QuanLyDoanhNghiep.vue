<template>
<NavbarAdmin/>
<div id="content" class="container-fluid px-5">
    <h3 class="text-center" style="margin-top: 110px; margin-bottom: 30px;">QUẢN LÝ DOANH NGHIỆP CỦA HỆ THỐNG</h3>
    <div id="search_box" class="box_container col-md-12">
      <div id="search_box_header" class="header_container d-flex justify-content-between align-items-center">
        <span class="title">
          <i class="bi bi-funnel-fill"></i> Filter
        </span>
        <i id="filterUp" class="bi bi-caret-up-fill" @click="filterClicked"></i>
      </div>
      <div id="search_box_content">
        <div class="row">
          <div class="col-xl-6 col-sm-9">
            <label class="form-label">Tìm kiếm</label>
            <input type="text" class="form-control mb-xl-0 mb-3" placeholder="Tìm kiếm" v-model="searchString">
          </div>
          <div class="col-xl-3 col-sm-6 mb-3 mb-xl-0">
            <label class="form-label" for="">Danh mục đơn vị</label>
            <select v-model="maDanhMucDonVi" class="form-control form-select h-auto wide">
              <option selected></option>
              <option class="option_item"v-for="danhMucDonVi in danhMucDonVis" :key="danhMucDonVi.ma_danh_muc_don_vi" :value="danhMucDonVi.ma_danh_muc_don_vi">
                {{ danhMucDonVi.ma_danh_muc_don_vi }}
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
    <div class="col-md-12 d-flex mb-4 pb-3">
      <router-link to="/them_doanh_nghiep" class="btn btn-primary me-3">
        <i class="bi bi-plus-circle"></i> Thêm doanh nghiệp
      </router-link>
    </div>
  </div>
  <div class="container-fluid px-5">
    <div class="header_container">
      <span class="title">
        <i class="bi bi-table"></i> Bảng doanh nghiệp
      </span>
    </div>
    <div class="table_container p-3">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Mã đơn vị</th>
              <th scope="col">Tên đơn vị</th>
              <th scope="col">Email</th>
              <th scope="col">Số điện thoại</th>
              <th scope="col">Danh mục đơn vị</th>
              <th scope="col" class="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(donVi, index) in paginatedData" :key="index">
              <td>{{ donVi.ma_don_vi }}</td>
              <td>{{ donVi.ten_don_vi }}</td>
              <td>{{ donVi.email }}</td>
              <td>{{ donVi.so_dien_thoai }}</td>
              <td>{{ donVi.ma_danh_muc_don_vi }}</td>
              <td class="text-end">
                <router-link :to="{ name: 'CapNhatDoanhNghiep', params: { ma_don_vi: donVi.ma_don_vi } }" class="btn btn-warning me-2 update_btn">
                  <i class="bi bi-pencil-fill"></i>
                </router-link>
                <a class="btn del_button" @click="deleteDoanhNghiep(donVi.ma_don_vi)">
                  <i class="bi bi-trash"></i>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Pagination :totalItems="donVis.length" :itemsPerPage="itemsPerPage" :currentPage="currentPage" @page-changed="changePage" />
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import NavbarAdmin from '../../../components/NavbarAdmin.vue';
import Swal from 'sweetalert2';
import Pagination from '../../../components/Pagination.vue';

export default {
  setup() {
    const donVis = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(5);
    const searchString = ref('');
    const maDanhMucDonVi = ref('');
    const danhMucDonVis = ref([]);

    onMounted(() => {
      document.title = "Quản lý doanh nghiệp";
    });
    
    const removeFilter = () => {
      searchString.value = '';
      maDanhMucDonVi.value = '';
      getdonVis();
    };

    const getdonVis = () => {
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

    const deleteDoanhNghiep = async(maDonVi) => {
      try {
        await axios.delete(`/api/don-vi/${maDonVi}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        Swal.fire({
          icon: 'success',
          title: 'Xóa danh mục đơn vị thành công',
          showConfirmButton: false,
          timer: 1000
        });
        setTimeout(getdonVis, 1000); 
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Xóa danh mục đơn vị thất bại',
          showConfirmButton: false,
          timer: 1000
        });
      }
    };

    const search = async() =>{
      try {
        const response = await axios.get(`/api/don-vi?search_string=${searchString.value}&ma_danh_muc_don_vi=${maDanhMucDonVi.value}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        console.log(searchString.value, maDanhMucDonVi.value)
        donVis.value = response.data;
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    }

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

    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return donVis.value.slice(start, end);
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

    getdonVis();
    getDanhMucDonVi();
    return{
      donVis,
      paginatedData,
      currentPage,
      itemsPerPage,
      filterClicked,
      deleteDoanhNghiep,
      changePage,
      search,
      searchString,
      maDanhMucDonVi,
      danhMucDonVis,
      removeFilter
    }
  },

  components:{
    NavbarAdmin,
    Pagination
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
</style>