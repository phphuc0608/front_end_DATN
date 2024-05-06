<template>
<NavbarAdmin/>
<div id="content" class="container-fluid px-5">
    <h3 class="text-center" style="margin-top: 120px; margin-bottom: 60px;">QUẢN LÝ DANH MỤC ĐƠN VỊ</h3>
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
            <input type="text" class="form-control mb-xl-0 mb-3" placeholder="Tìm kiếm">
          </div>
          
          <div class="col-xl-3 col-sm-6 align-self-end">
            <div>
              <button class="btn btn-primary me-2" title="Nhấn vào đây để tìm kiếm" type="button">
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
      <button id="btn_add" type="button" data-bs-toggle="modal" data-bs-target="#add_danh_muc_don_vi" class="btn btn-primary">
        <i class="bi bi-plus-circle"></i> Thêm danh mục đơn vị
      </button>
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
              <th scope="col">Mã danh mục đơn vị</th>
              <th scope="col">Tên danh mục đơn vị</th>
              <th scope="col" class="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(donVi, index) in paginatedData" :key="index">
              <td>{{ donVi.ma_danh_muc_don_vi }}</td>
              <td>{{ donVi.ten_danh_muc_don_vi }}</td>
              <td class="text-end">
                <a data-bs-toggle="modal" data-bs-target="#update_danh_muc_don_vi" class="btn btn-warning me-2 update_btn" @click="getDanhMucDonViById(donVi.ma_danh_muc_don_vi)">
                  <i class="bi bi-pencil-fill"></i>
                </a>
                <a class="btn del_button" @click="deleteDanhMucDonVi(donVi.ma_danh_muc_don_vi)" >
                  <i class="bi bi-trash"></i>
                </a>
              </td>
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
    <!-- Them danh muc don vi -->
    <div style="margin-top: 200px;" class="modal" id="add_danh_muc_don_vi" tabindex="-1" role="dialog" aria-labelledby="add_danh_muc_don_vi_label" aria-hidden="true">
      <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="add_champion_label">Thêm danh mục đơn vị</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
          <div class="modal-body">
            <form @submit.prevent="addDanhMucDonVi" enctype="multipart/form-data">
              <div class="form-group">
                <label for="maDanhMucDonVi">Mã danh mục đơn vị</label>
                <input v-model="maDanhMucDonVi" type="text" class="form-control" id="maDanhMucDonVi" placeholder="Nhập mã danh mục đơn vị" required>
              </div>
              <div class="form-group">
                <label for="tenDanhMucDonVi">Tên danh mục đơn vị</label>
                <input v-model="tenDanhMucDonVi" type="text" class="form-control" id="tenDanhMucDonVi" placeholder="Nhập tên danh mục đơn vị" required>
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
    <!-- Cap nhat danh muc don vi -->
    <div style="margin-top: 200px;" class="modal" id="update_danh_muc_don_vi" tabindex="-1" role="dialog" aria-labelledby="update_danh_muc_don_vi_label" aria-hidden="true">
      <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="add_champion_label">Cập nhật danh mục đơn vị</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
          <div class="modal-body">
            <form @submit.prevent="updateDanhMucDonVi" enctype="multipart/form-data">
              <div class="form-group">
                <label for="maDanhMucDonVi">Mã danh mục đơn vị</label>
                <input v-model="maDanhMucDonVi" type="text" class="form-control" id="maDanhMucDonVi">
              </div>
              <div class="form-group">
                <label for="tenDanhMucDonVi">Tên danh mục đơn vị</label>
                <input v-model="tenDanhMucDonVi" type="text" class="form-control" id="tenDanhMucDonVi">
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

export default {
  setup() {
    const modalAdd = ref(null);
    const modalUpdate = ref(null);
    const danhMucDonVis = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(5);
    const maDanhMucDonVi = ref(0);
    const tenDanhMucDonVi = ref('');
    

    onMounted(() => {
      document.title = "Quản lý người dùng";
      modalAdd.value = new bootstrap.Modal(document.getElementById('add_danh_muc_don_vi'), {
        keyboard: false
      });
      modalUpdate.value = new bootstrap.Modal(document.getElementById('update_danh_muc_don_vi'), {
        keyboard: false
      });
    });
    
    const getDanhMucDonVi = () => {
      axios.get(`/api/danh-muc/don-vi`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function(response){
        danhMucDonVis.value = response.data;
        console.log(response.data); 
      })
      .catch(function(error){
        console.log(error);
      });
    };

    const addDanhMucDonVi = async() => {
      const danhMucDonViData = {
        ma_danh_muc_don_vi: parseInt(maDanhMucDonVi.value),
        ten_danh_muc_don_vi: tenDanhMucDonVi.value,
      };
      console.log(danhMucDonViData);
      try {
        const response = await axios.post(`/api/danh-muc/don-vi`, danhMucDonViData);
        console.log(response.data);
        alert('Thêm danh mục đơn vị thành công');
        modalAdd.value.hide();
        getDanhMucDonVi(); // Refresh danhMucDonVis
      } catch (error) {
        console.error(error);
        alert('Thêm danh mục đơn vị thất bại');
      }
    };

    const deleteDanhMucDonVi = (maDanhMucDonVi) => {
      axios.delete(`/api/danh-muc/don-vi/${maDanhMucDonVi}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function(response){
        console.log(response.data);
        alert('Xóa danh mục đơn vị thành công');
        getDanhMucDonVi(); // Refresh danhMucDonVis
      })
      .catch(function(error){
        console.log(error);
        alert('Xóa danh mục đơn vị thất bại');
      });
    }

  const getDanhMucDonViById = (maDanhMucDonViId) => {
    axios.get(`/api/danh-muc/don-vi/${maDanhMucDonViId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function(response){
      if (response.data && response.data.ma_danh_muc_don_vi) {
        const data = response.data;
        maDanhMucDonVi.value = data.ma_danh_muc_don_vi;
        tenDanhMucDonVi.value = data.ten_danh_muc_don_vi;
      } else {
        console.error('Unexpected response data', response.data);
      }
    })
    .catch(function(error){
      console.log(error);
    });
  };



  const updateDanhMucDonVi = async() => {
    const danhMucDonViData = {
      ma_danh_muc_don_vi: parseInt(maDanhMucDonVi.value),
      ten_danh_muc_don_vi: tenDanhMucDonVi.value,
    };
    console.log(danhMucDonViData);
    try {
      const response = await axios.put(`/api/danh-muc/don-vi/${maDanhMucDonVi.value}`, danhMucDonViData);
      console.log(response.data);
      alert('Cập nhật danh mục đơn vị thành công');
      modalUpdate.value.hide();
      getDanhMucDonVi(); // Refresh danhMucDonVis
    } catch (error) {
      console.error(error);
      alert('Cập nhật danh mục đơn vị thất bại');
    }
  };

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return danhMucDonVis.value.slice(start, end);
  });

  const totalPages = computed(() => {
    return Math.ceil(danhMucDonVis.value.length / itemsPerPage.value);
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

  getDanhMucDonVi();
  return{
    danhMucDonVis,
    maDanhMucDonVi,
    tenDanhMucDonVi,
    addDanhMucDonVi,
    deleteDanhMucDonVi,
    getDanhMucDonViById,
    updateDanhMucDonVi,
    paginatedData,
    totalPages,
    currentPage,
    itemsPerPage,
    changePage,
    nextPage,
    previousPage,
    filterClicked
  }
},

  components:{
    NavbarAdmin
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