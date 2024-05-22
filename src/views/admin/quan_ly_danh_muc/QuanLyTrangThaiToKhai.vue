<template>
<NavbarAdmin/>
<div id="content" class="container-fluid px-5">
    <h3 class="text-center" style="margin-top: 120px; margin-bottom: 60px;">QUẢN LÝ TRẠNG THÁI TỜ KHAI</h3>
    <div id="search_box" class="box_container col-md-12">
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
            <input type="text" class="form-control mb-xl-0 mb-3" placeholder="Tìm kiếm" v-model="searchString">
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
      <button id="btn_add" type="button" data-bs-toggle="modal" data-bs-target="#add_trang_thai" class="btn btn-primary">
        <i class="bi bi-plus-circle"></i> Thêm trạng thái
      </button>
    </div>
  </div>
  <div class="container-fluid px-5">
    <div class="header_container">
      <span class="title">
        <i class="bi bi-table"></i> Bảng trạng thái tờ khai
      </span>
    </div>
    <div class="table_container p-3">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Mã trạng thái</th>
              <th scope="col">Tên trạng thái</th>
              <th scope="col" class="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(trangThai, index) in paginatedData" :key="index">
              <td>{{ trangThai.ma_trang_thai }}</td>
              <td>{{ trangThai.ten_trang_thai }}</td>
              <td class="text-end">
                <a data-bs-toggle="modal" data-bs-target="#update_trang_thai" class="btn btn-warning me-2 update_btn" @click="getDanhMucTrangThaiById(trangThai.ma_trang_thai)">
                  <i class="bi bi-pencil-fill"></i>
                </a>
                <a class="btn del_button" @click="deleteDanhMucTrangThai(trangThai.ma_trang_thai)" >
                  <i class="bi bi-trash"></i>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Pagination :totalItems="trangThais.length" :itemsPerPage="itemsPerPage" :currentPage="currentPage" @page-changed="changePage" />
    <!-- Them danh muc trang thai -->
    <div style="margin-top: 200px;" class="modal" id="add_trang_thai" tabindex="-1" role="dialog" aria-labelledby="add_trang_thai_label" aria-hidden="true">
      <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="add_champion_label">Thêm trạng thái</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
          <div class="modal-body">
            <form @submit.prevent="addTrangThai" enctype="multipart/form-data">
              <div class="form-group">
                <label for="tenTrangThai">Mã trạng thái</label>
                <input v-model="maTrangThai" type="text" class="form-control" id="maTrangThai" placeholder="Nhập mã trạng thái" required>
              </div>
              <div class="form-group">
                <label for="tenTrangThai">Tên trạng thái</label>
                <input v-model="tenTrangThai" type="text" class="form-control" id="tenTrangThai" placeholder="Nhập tên trạng thái" required>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary py-2 px-3" data-dismiss="modal">Đóng</button>
                <button type="submit" class="btn btn-primary py-2 px-3">Thêm</button>
              </div>
            </form>
          </div>
        </div> 
      </div> 
    </div>
    <!-- Cap nhat danh muc trang thai -->
    <div style="margin-top: 200px;" class="modal" id="update_trang_thai" tabindex="-1" role="dialog" aria-labelledby="update_trang_thai_label" aria-hidden="true">
      <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="add_champion_label">Cập nhật trạng thái</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
          <div class="modal-body">
            <form @submit.prevent="updatetrangThai" enctype="multipart/form-data">
              <div class="form-group">
                <label for="maTrangThai">Mã trạng thái</label>
                <input v-model="maTrangThai" type="text" class="form-control" id="maTrangThai" readonly>
              </div>
              <div class="form-group">
                <label for="tenTrangThai">Tên trạng thái</label>
                <input v-model="tenTrangThai" type="text" class="form-control" id="tenTrangThai">
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
import NavbarAdmin from '../../../components/NavbarAdmin.vue';
import Swal from 'sweetalert2';
import Pagination from '../../../components/Pagination.vue';

export default {
  setup() {
    const modalAdd = ref(null);
    const modalUpdate = ref(null);
    const trangThais = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(5);
    const maTrangThai = ref(0);
    const tenTrangThai = ref('');
    const searchString = ref(''); 

    onMounted(() => {
      document.title = "Quản lý trạng thái";
      modalAdd.value = new bootstrap.Modal(document.getElementById('add_trang_thai'), {
        keyboard: false
      });
      modalUpdate.value = new bootstrap.Modal(document.getElementById('update_trang_thai'), {
        keyboard: false
      });
    });
    
    const removeFilter = () => {
      searchString.value = '';
      getDanhMucTrangThai();
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

    const search = async() =>{
      try{
        const response = await axios.get(`/api/trang-thai-to-khai?search_string=${searchString.value}`);
        trangThais.value = response.data;
      }catch(error){
        console.log(error);
      }
    }
  
    const addTrangThai = async() => {
      const danhMucTrangThaiData = {
        ma_trang_thai: parseInt(maTrangThai.value),
        ten_trang_thai: tenTrangThai.value,
      };
      console.log(danhMucTrangThaiData);
      try {
        const response = await axios.post(`/api/trang-thai-to-khai`, danhMucTrangThaiData);
        console.log(response.data);
        Swal.fire({
          icon: 'success',
          title: 'Thêm trạng thái thành công',
          showConfirmButton: false,
          timer: 1000
        });
        modalAdd.value.hide();
        getDanhMucTrangThai(); // Refresh trangThais
        tenTrangThai.value = '';
        maTrangThai.value = '';
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Thêm trạng thái thất bại',
          showConfirmButton: false,
          timer: 1000
        });
      }
    };

    const deleteDanhMucTrangThai = (maTrangThai) => {
      axios.delete(`/api/trang-thai-to-khai/${maTrangThai}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function(response){
        console.log(response.data);
        Swal.fire({
          icon: 'success',
          title: 'Xóa trạng thái thành công',
          showConfirmButton: false,
          timer: 1000
        });
        getDanhMucTrangThai(); // Refresh trangThais
      })
      .catch(function(error){
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Xóa trạng thái thất bại',
          showConfirmButton: false,
          timer: 1000
        });
      });
    }

  const getDanhMucTrangThaiById = (maTrangThaiId) => {
    axios.get(`/api/trang-thai-to-khai/${maTrangThaiId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function(response){
      if (response.data && response.data.ma_trang_thai) {
        const data = response.data;
        maTrangThai.value = data.ma_trang_thai;
        tenTrangThai.value = data.ten_trangma_trang_thai;
      } else {
        console.error('Unexpected response data', response.data);
      }
    })
    .catch(function(error){
      console.log(error);
    });
  };
  const updatetrangThai = async() => {
    const danhMucTrangThaiData = {
      ma_trang_thai: parseInt(maTrangThai.value),
      ten_trang_trang_thai: tenTrangThai.value,
    };
    console.log(danhMucTrangThaiData);
    try {
      const response = await axios.put(`/api/trang-thai-to-khai/${maTrangThai.value}`, danhMucTrangThaiData);
      console.log(response.data);
      Swal.fire({
        icon: 'success',
        title: 'Cập nhật trạng thái thành công',
        showConfirmButton: false,
        timer: 1000
      });
      modalUpdate.value.hide();
      getDanhMucTrangThai(); // Refresh trangThais
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Cập nhật trạng thái thất bại',
        showConfirmButton: false,
        timer: 1000
      });
    }
  };

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return trangThais.value.slice(start, end);
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

  getDanhMucTrangThai();
  return{
    trangThais,
    maTrangThai,
    tenTrangThai,
    addTrangThai,
    deleteDanhMucTrangThai,
    getDanhMucTrangThaiById,
    updatetrangThai,
    paginatedData,
    currentPage,
    itemsPerPage,
    changePage,
    filterClicked,
    searchString,
    search,
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