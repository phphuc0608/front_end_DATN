<template>
  <NavbarCuakhau />
  <div id="content" class="container-fluid px-5">
    <h3 class="text-center" style="margin-top: 120px; margin-bottom: 60px;">QUẢN LÝ XE RA VÀO</h3>
    <div id="search_box" class="box_container col-md-12">
    </div>
  </div>
  <div class="container-fluid px-5">
    <div class="header_container">
      <span class="title">
        <i class="bi bi-table"></i> Dữ liệu tờ khai
      </span>
    </div>
    <div class="table_container p-3">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Biển số</th>
              <th>Mã trạng thái</th>
              <th>Mã lịch sử</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="vanDon in firstVanDon" :key="vanDon.bien_so">
              <td>{{ vanDon.bien_so }}</td>
              <td>{{ vanDon.trang_thai_phuong_tien.ten_trang_thai }}</td>
              <td>{{ vanDon.ma_lich_su }}</td>
              <td>{{ vanDon.thoi_gian }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div id="btn_container">
        <button class="btn btn-success me-3" @click="confirmVanDon">
          <i class="fa-solid fa-circle-check"></i> Xác nhận
        </button>
        <button class="btn btn-danger">
          <i class="fa-solid fa-circle-xmark"></i> Từ chối
        </button>
      </div>
      <div id="img_container" class="mt-3 text-center">
        <img :src="imageUrl" alt="">
      </div>
    </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed, watch} from 'vue';
import NavbarCuakhau from '../../components/NavbarCuakhau.vue';

export default {
  setup() {
    const nguoiDungs = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(5);
    const searchString = ref('');
    const searchVaiTro = ref('');
    const vaiTros = ref([]);
    const savedThuocDonVi = ref(localStorage.getItem('savedThuocDonVi'));

    onMounted(() => {
      document.title = "Quản lý người dùng công ty";
    });
 
    const getNguoiDungs = () => {
      axios.get(`/api/nguoi-dung?search_string=${savedThuocDonVi.value}`, {
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

    const deleteNguoiDung = async (email) => {
      try {
        const response = await axios.delete(`/api/nguoi-dung/${email}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });  
        alert('Xóa người dùng thành công');
        setTimeout(getNguoiDungs, 1000);
      } catch (error) { 
        alert('Xóa người dùng thất bại');
      }
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

    const search = async() => {
      try {
        const respone = await axios.get(`/api/nguoi-dung?search_string=${searchString.value}`, {
          headers: {
            'Content-Type': 'application/json'
          }
      });
      nguoiDungs.value = respone.data;
      console.log(respone.data);
      } catch (error) {
        console.error(error);
      }
    };

    const filteredNguoiDungs = computed(() => {
      if (searchVaiTro.value) {
        return nguoiDungs.value.filter(nguoiDung => nguoiDung.vai_tro.ma_vai_tro === searchVaiTro.value);
      } else {
        return nguoiDungs.value;
      }
    });

    watch(searchVaiTro, () => {
      filteredNguoiDungs.value = nguoiDungs.value.filter(nguoiDung => nguoiDung.vai_tro.ma_vai_tro === searchVaiTro.value);
    });

    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredNguoiDungs.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredNguoiDungs.value.length / itemsPerPage.value);
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
      totalPages,
      currentPage,
      itemsPerPage,
      changePage,
      nextPage,
      previousPage,
      filterClicked,
      deleteNguoiDung,
      searchString,
      search,
      searchVaiTro,
      vaiTros,
      filteredNguoiDungs,
      savedThuocDonVi
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