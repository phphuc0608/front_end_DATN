<template>
<NavbarCuakhau/>
<div id="content" class="container-fluid px-5">
    <h3 class="text-center" style="margin-top: 110px; margin-bottom: 30px;">LỊCH SỬ PHƯƠNG TIỆN</h3>
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
    <div class="header_container d-flex justify-content-between align-items-center">
      <span class="title">
        <i class="bi bi-table"></i> Bảng lịch sử phương tiện
      </span>
      <button @click="getLichSuPhuongTienData" class="btn btn-success"><i class="bi bi-download"></i> Tải lịch sử phương tiện</button>
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
    <Pagination :totalItems="lichSus.length" :itemsPerPage="itemsPerPage" :currentPage="currentPage" @page-changed="changePage" />
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import NavbarCuakhau from '../../components/NavbarCuakhau.vue';
import Pagination from '../../components/Pagination.vue';
import fileDownload from 'js-file-download';
import Swal from 'sweetalert2';

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
      let url = `/api/lich-su-phuong-tien?search_string=${searchString.value}`;
      if (maDanhMucTrangThai.value) {
        url += `&ma_trang_thai=${maDanhMucTrangThai.value}`;
      }
      axios.get(url, {
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

    const changePage = (page) => {
      currentPage.value = page;
    };

    const getLichSuPhuongTienData = () => {
      axios({
        url: `/api/thong-ke/download-lich-su-phuong-tien`,
        method: 'GET',
        responseType: 'arraybuffer',
      }).then((response) => {
        const data = new Uint8Array(response.data);
        const bom = new Uint8Array([0xEF, 0xBB, 0xBF]); // BOM in UTF-8
        const withBom = new Uint8Array(bom.length + data.length);
        withBom.set(bom);
        withBom.set(data, bom.length);
        const blob = new Blob([withBom], { type: 'text/csv;charset=utf-8;' });
        fileDownload(blob, 'lich_su_phuong_tien.csv');
        Swal.fire({
          icon: 'success',
          title: 'Tải file thành công',
          showConfirmButton: false,
          timer: 1000
        });
      })
      .catch(function(error){
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Tải file thất bại',
          showConfirmButton: false,
          timer: 1000
        });
      });

    }

    getlichSus();
    getTrangThaiPhuongTien();

    return {
      lichSus,
      paginatedData,
      currentPage,
      itemsPerPage,
      changePage,
      filterClicked,
      searchString,
      maDanhMucTrangThai,
      danhMucTrangThais,
      search,
      removeFilter,
      getLichSuPhuongTienData
    }
  },

  components:{
    NavbarCuakhau,
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