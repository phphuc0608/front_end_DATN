<template>
<NavbarAdmin/>
<div id="content" class="container-fluid px-5">
    <h3 class="text-center" style="margin-top: 110px; margin-bottom: 30px;">QUẢN LÝ TỜ KHAI</h3>
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
            <label class="form-label">Trạng thái tờ khai</label>
            <select class="form-control form-select h-auto wide" v-model="maTrangThai">
              <option></option>
              <option v-for="(trangThaiToKhai, index) in trangThaiToKhais" :key="index" :value="trangThaiToKhai.ma_trang_thai">
                {{ trangThaiToKhai.ten_trang_thai }}
              </option>
            </select>
          </div>
          <div class="col-xl-3 col-sm-6 align-self-end">
            <div>
              <button class="btn btn-primary me-2" title="Nhấn vào đây để tìm kiếm" type="button" @click="search">
                <i class="bi bi-funnel-fill"></i> Filter
              </button>
              <button class="btn light rev_button" title="Nhấn vào đây để xóa filter" type="button">
                Remove filter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-12 d-flex mb-4 pb-3">
      <router-link to="/them_to_khai" class="btn btn-primary me-3">
        <i class="bi bi-plus-circle"></i> Thêm tờ khai
      </router-link>
    </div>
  </div>
  <div class="container-fluid px-5">
    <div class="header_container d-flex justify-content-between align-items-center">
      <span class="title">
        <i class="bi bi-table"></i> Bảng tờ khai
      </span>
      <button @click="getToKhaiData" class="btn btn-success"><i class="bi bi-download"></i> Tải lịch sử tờ khai</button>
    </div>
    <div class="table_container p-3">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Mã tờ khai</th>
              <th scope="col">Đơn vị đăng ký</th>
              <th scope="col">Mã vận đơn</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Ngày đăng ký</th>
              <th scope="col" class="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(toKhai, index) in paginatedData" :key="index">
              <td>{{ toKhai.ma_to_khai }}</td>
              <td>{{ toKhai.don_vi_dang_ky }}</td>
              <td>
                <router-link :to="{ name: 'ChiTietVanDon', params: { ma_van_don: toKhai.ma_van_don } }">{{ toKhai.ma_van_don }}</router-link>
              </td>
              <td :class="getClassByTrangThai(toKhai.trang_thai_to_khai.ten_trang_thai)">
                {{ toKhai.trang_thai_to_khai.ten_trang_thai }}
              </td>
              <td>{{ toKhai.ngay_dang_ky }}</td>
              <td class="text-end">
                <router-link class="btn btn-warning me-2 update_btn" :to="{ name: 'CapNhatToKhai', params: { ma_to_khai: toKhai.ma_to_khai } }">
                  <i class="bi bi-pencil-fill"></i>
                </router-link>
                <a class="btn del_button" @click="deleteToKhai(toKhai.ma_to_khai)">
                  <i class="bi bi-trash"></i>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  <Pagination :totalItems="toKhais.length" :itemsPerPage="itemsPerPage" :currentPage="currentPage" @page-changed="changePage" />
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import NavbarAdmin from '../../../components/NavbarCongty.vue';
import Swal from 'sweetalert2';
import fileDownload from 'js-file-download';
import Pagination from '../../../components/Pagination.vue';

export default {
  setup() {
    const toKhais = ref([]);
    const trangThaiToKhais = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(5);
    const maDonVi = ref(localStorage.getItem('savedThuocDonVi'));
    const maTrangThai = ref('');
    const searchString = ref('');
    
    onMounted(() => {
      document.title = "Quản lý tờ khai";
    });

    const getToKhais = () => {
      axios.get(`/api/to-khai/doanh-nghiep/${maDonVi.value}`, {
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

    const getTrangThaiToKhais = () => {
      axios.get('/api/trang-thai-to-khai', {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(function(response){
        trangThaiToKhais.value = response.data;
      })
      .catch(function(error){
        console.log(error);
      });
    };

    const getToKhaiData = () => {
      axios({
        url: `/api/thong-ke/download-lich-su-to-khai/${maDonVi.value}`,
        method: 'GET',
        responseType: 'arraybuffer',
      }).then((response) => {
        const data = new Uint8Array(response.data);
        const bom = new Uint8Array([0xEF, 0xBB, 0xBF]); // BOM in UTF-8
        const withBom = new Uint8Array(bom.length + data.length);
        withBom.set(bom);
        withBom.set(data, bom.length);
        const blob = new Blob([withBom], { type: 'text/csv;charset=utf-8;' });
        fileDownload(blob, 'lich_su_to_khai.csv');
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

    const deleteToKhai = async(maToKhai) => {
      try {
        await axios.delete(`/api/to-khai/${maToKhai}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        Swal.fire({
          icon: 'success',
          title: 'Xóa vận đơn thành công',
        });
        setTimeout(getToKhais, 1000); 
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Xóa vận đơn thất bại',
        });
      }
    };

        
    const search = async() =>{
      try {
        const response = await axios.get(`/api/to-khai/doanh-nghiep/${maDonVi.value}?search_string=${searchString.value}&ma_trang_thai=${maTrangThai.value}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        toKhais.value = response.data;
      } catch (error) {
        console.log(error);
      }
    }

    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return toKhais.value.slice(start, end);
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

    getToKhais();
    getTrangThaiToKhais();
    // getClassByTrangThai();
    return{
      toKhais,
      trangThaiToKhais,
      paginatedData,
      currentPage,
      itemsPerPage,
      changePage,
      filterClicked,
      deleteToKhai,
      getToKhaiData,
      maTrangThai,
      search,
      searchString,
      getClassByTrangThai
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