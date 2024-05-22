<template>
<NavbarAdmin/>
<div id="content" class="container-fluid px-5">
    <h3 class="text-center" style="margin-top: 120px; margin-bottom: 60px;">LỊCH SỬ TỜ KHAI</h3>
  </div>
  <div class="container-fluid px-5">
    <div class="header_container d-flex justify-content-between align-items-center">
      <span class="title">
        <i class="bi bi-table"></i> Bảng lịch sử tờ khai
      </span>
      <button @click="getLichSuToKhaiData" class="btn btn-success"><i class="bi bi-download"></i> Tải lịch sử tài khoản</button>
    </div>
    <div class="table_container p-3">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Mã lịch sử</th>
              <th scope="col">Mã tờ khai</th>
              <th scope="col">Người tạo</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Thời gian</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(lichSuToKhai, index) in paginatedData" :key="index">
              <td>{{ lichSuToKhai.ma_lich_su }}</td>
              <td>{{ lichSuToKhai.ma_to_khai }}</td>
              <td>{{ lichSuToKhai.nguoi_dung }}</td>
              <td>{{ lichSuToKhai.trang_thai.ten_trang_thai }}</td>
              <td>{{ lichSuToKhai.thoi_gian }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>  
    <Pagination :totalItems="lichSuToKhais.length" :itemsPerPage="itemsPerPage" :currentPage="currentPage" @page-changed="changePage" />
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import NavbarAdmin from '../../../components/NavbarAdmin.vue';
import Pagination from '../../../components/Pagination.vue';
import fileDownload from 'js-file-download';
import Swal from 'sweetalert2';

export default {
  setup() {
    const lichSuToKhais = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(5);

    onMounted(() => {
      document.title = "Lịch sử tờ khai - Admin";
    });

    const getlichSuToKhais = () => {
      axios.get(`/api/lich-su-to-khai?skip=0&limit=300`, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(function(response){
        lichSuToKhais.value = response.data;
        console.log(response.data); 
      })
      .catch(function(error){
        console.log(error);
      });
    };

    const getLichSuToKhaiData = () => {
      axios({
        url: `/api/thong-ke/download-lich-su-to-khai`,
        method: 'GET',
        responseType: 'arraybuffer',
      }).then((response) => {
        const data = new Uint8Array(response.data);
        const bom = new Uint8Array([0xEF, 0xBB, 0xBF]); // BOM in UTF-8
        const withBom = new Uint8Array(bom.length + data.length);
        withBom.set(bom);
        withBom.set(data, bom.length);
        const blob = new Blob([withBom], { type: 'text/csv;charset=utf-8;' });
        fileDownload(blob, 'lich_su_tai_khoan.csv');
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

    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return lichSuToKhais.value.slice(start, end);
    });

    const changePage = (page) => {
      currentPage.value = page;
    };

    getlichSuToKhais();
    return{
      lichSuToKhais,
      paginatedData,
      currentPage,
      itemsPerPage,
      changePage,
      getLichSuToKhaiData
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