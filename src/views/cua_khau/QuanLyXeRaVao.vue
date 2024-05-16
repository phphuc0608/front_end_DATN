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
        <i class="bi bi-table"></i> Bảng dữ liệu phương tiện mới nhất
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
              <td>{{ vanDon.trang_thai_phuong_tien.ten_trang_thai}}</td>
              <td>{{ vanDon.ma_lich_su }}</td>
              <td>{{ vanDon.thoi_gian }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div id="btn_container" class="py-3">
      <button class="btn btn-success me-3" @click="confirmVanDon">
        <i class="bi bi-check-circle-fill"></i> Xác nhận
      </button>
      <button class="btn btn-danger">
        <i class="bi bi-x-circle-fill"></i> Từ chối
      </button>
    </div>
    <div id="img_container" class="mt-3 text-center">
      <img :src="imageUrl" alt="">
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed, watch, onUnmounted} from 'vue';
import NavbarCuakhau from '../../components/NavbarCuakhau.vue';

export default {
  setup() {
    const firstVanDon = ref([]);
    const imageUrl = ref('http://1.53.213.122:8000/api/lich-su-phuong-tien/lastest/image');
    const currentBienSo = ref('');
    let intervalId;

    const getLastestImage = () => {
      imageUrl.value = `http://1.53.213.122:8000/api/lich-su-phuong-tien/lastest/image?time=${new Date().getTime()}`;
    }

    onMounted(() => {
      document.title = "Quản lý xe ra vào";
      intervalId = setInterval(getLastestImage, 1000);
    });

    onUnmounted(() => {
      clearInterval(intervalId);
    });

    const getFirstVanDon = async() => {
      try{
        const response = await axios.get(`/api/lich-su-phuong-tien/lastest`)
        firstVanDon.value = [response.data];
        currentBienSo.value = response.data.bien_so;
      } catch (error) {
        console.log(error);
      }
    }

    const confirmVanDon = () => {
      if(firstVanDon.value.length === 0){
        return;
      }else{
        axios.post(`/api/lich-su-phuong-tien`, {
          bien_so: bien_so,
          ma_trang_thai: 3,
          anh: ""
        })
        .then(function(response){
          console.log(response.data);
          getfirstVanDon(); // Refresh the data
        })
        .catch(function(error){
          console.log(error);
        });
        }
    }

    getFirstVanDon();
    getLastestImage();
    confirmVanDon();

    setInterval(() => {
      getFirstVanDon();
    }, 1000);

    return{
      firstVanDon,
      imageUrl,
      currentBienSo,
      intervalId,
      confirmVanDon,
      getFirstVanDon,
      getLastestImage
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
#img_container img {
  width: 50%;
  height: auto;
}
</style>