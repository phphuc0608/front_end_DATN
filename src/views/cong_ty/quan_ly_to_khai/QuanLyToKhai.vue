<template>
<NavbarAdmin/>
<div id="content" class="container-fluid px-5">
    <h3 class="text-center" style="margin-top: 120px; margin-bottom: 60px;">QUẢN LÝ TỜ KHAI</h3>
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
      <router-link to="/them_to_khai" class="btn btn-primary me-3">
        <i class="bi bi-plus-circle"></i> Thêm tờ khai
      </router-link>
    </div>
  </div>
  <div class="container-fluid px-5">
    <div class="header_container">
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
              <th scope="col">Đơn vị đăng ký</th>
              <th scope="col">Vận đơn</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Ngày đăng ký</th>
              <th scope="col" class="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(toKhai, index) in paginatedData" :key="index">
              <td>{{ toKhai.ma_to_khai }}</td>
              <td>{{ toKhai.don_vi_dang_ky }}</td>
              <td>{{ toKhai.van_don.ten_hang_hoa }}</td>
              <td>{{ toKhai.trang_thai_to_khai.ten_trang_thai }}</td>
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
import NavbarAdmin from '../../../components/NavbarCongty.vue';
import router from '../../../routers/router';

export default {
  setup() {
    const toKhais = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(5);
    const maDonVi = ref(localStorage.getItem('savedThuocDonVi'));
    
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


  const deleteToKhai = async(maToKhai) => {
    try {
      await axios.delete(`/api/to-khai/${maToKhai}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      alert('Xóa vận đơn thành công');
      setTimeout(getToKhais, 1000); 
    } catch (error) {
      console.log(error);
      alert('Xóa vận đơn thất bại');
    }
  };

    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return toKhais.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(toKhais.value.length / itemsPerPage.value);
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

    getToKhais();
    return{
      toKhais,
      paginatedData,
      totalPages,
      currentPage,
      itemsPerPage,
      changePage,
      nextPage,
      previousPage,
      filterClicked,
      deleteToKhai,
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