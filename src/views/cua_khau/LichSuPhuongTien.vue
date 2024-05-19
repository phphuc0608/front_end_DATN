<template>
<NavbarCuakhau/>
<div id="content" class="container-fluid px-5">
    <h3 class="text-center" style="margin-top: 120px; margin-bottom: 60px;">LỊCH SỬ PHƯƠNG TIỆN</h3>
        <div id="search_box" class="box_container col-md-12">
      <div id="search_box_header" class="header_container d-flex justify-content-between align-items-center">
        <span class="title">
          <i class="bi bi-funnel-fill"></i> Filter
        </span>
        <i id="filterUp" class="bi bi-caret-up-fill" @click="filterClicked"></i>
      </div>
      <div id="search_box_content">
        <div class="row">
          <div class="col-md-6 col-sm-6">
            <label class="form-label">Tìm kiếm</label>
            <input type="text" class="form-control mb-xl-0 mb-3" placeholder="Tìm kiếm" v-model="searchString">
          </div>
          <div class="col-md-3 col-sm-6">
            <label class="form-label">Danh mục trạng thái</label>
            <select class="form-control form-select h-auto wide" v-model="maDanhMucTrangThai">
              <option></option>
              <option v-for="(danhMucTrangThai, index) in danhMucTrangThais" :key="index" :value="danhMucTrangThai.ma_trang_thai">
                {{ danhMucTrangThai.ten_trang_thai }}
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
        <i class="bi bi-table"></i> Bảng lịch sử tài khoản
      </span>
    </div>
    <div class="table_container p-3">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Mã lịch sử</th>
              <th scope="col">Biển số xe</th>
              <th scope="col">Hành động</th>
              <th scope="col">Thời gian</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(lichSu, index) in paginatedData" :key="index">
              <td>{{ lichSu.ma_lich_su }}</td>
              <td>{{ lichSu.bien_so }}</td>
              <td>{{ lichSu.trang_thai_phuong_tien.ten_trang_thai }}</td>
              <td>{{ lichSu.thoi_gian }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="col-md-12 d-flex align-items-center justify-content-end flex-wrap px-3 py-2" style="background-color: white;">
      <nav aria-label="Page navigation example mb-2">
        <ul class="pagination mb-2 mb-sm-0">
          <li class="page-item">
            <a class="page-link" href="#" @click.prevent="previousPage">
              <i class="bi bi-arrow-left-short"></i>
            </a>
          </li>
          <li class="page-item" v-for="page in totalPages" :key="page">
            <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="#" @click.prevent="nextPage">
              <i class="bi bi-arrow-right-short"></i>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import NavbarCuakhau from '../../components/NavbarCuakhau.vue';

export default {
  setup() {
    const lichSus = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(5);
    const searchString = ref('');
    const maDanhMucTrangThai = ref('');
    const danhMucTrangThais = ref([]);

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
      axios.get(`/api/lich-su-phuong-tien?search_string=${searchString.value}&ma_trang_thai=${maDanhMucTrangThai.value}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(function(response){
        lichSus.value = response.data;
        console.log(response.data); 
      })
      .catch(function(error){
        console.log(error);
      });
    };
    
    const removeFilter = () => {
      searchString.value = '';
      maDanhMucTrangThai.value = '';
      getlichSus();
    };

    const getTrangThaiPhuongTien = () => {
      axios.get(`/api/danh-muc/trang-thai-phuong-tien`, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(function(response){
        danhMucTrangThais.value = response.data;
        console.log(response.data); 
      })
      .catch(function(error){
        console.log(error);
      });
    };

    const getlichSus = () => {
      axios.get(`/api/lich-su-phuong-tien`, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(function(response){
        lichSus.value = response.data;
        console.log(response.data); 
      })
      .catch(function(error){
        console.log(error);
      });
    };

    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return lichSus.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(lichSus.value.length / itemsPerPage.value);
    });

    const changePage = (page) => {
      currentPage.value = page;
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    getlichSus();
    getTrangThaiPhuongTien();

    return{
      lichSus,
      paginatedData,
      totalPages,
      currentPage,
      itemsPerPage,
      changePage,
      nextPage,
      previousPage,
      filterClicked,
      searchString,
      maDanhMucTrangThai,
      danhMucTrangThais,
      search,
      removeFilter
    }
  },

  components:{
    NavbarCuakhau
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