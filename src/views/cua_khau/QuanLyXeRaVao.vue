<template>
  <NavbarCuakhau />
  <div id="content" class="container-fluid px-5">
    <h3 class="text-center" style="margin-top: 110px; margin-bottom: 30px;">QUẢN LÝ XE RA VÀO</h3>
    <div id="search_box" class="box_container col-md-12">
    </div>
  </div>
  <div class="container-fluid d-flex justify-content-center align-items-center">
    <div id="table_container" class="col-md-7 me-5">
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
      <div class="header_container mt-3">
        <span class="title">
          <i class="bi bi-table"></i> Bảng vận đơn của phương tiện
        </span>
      </div>
      <div class="table_container p-3">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Mã vận đơn</th>
                <th scope="col">Tên hàng hóa</th>
                <th scope="col">Biển số xe</th>
                <th scope="col">Ngày tạo vận đơn</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="vanDon in vanDons" :key="vanDon.bien_so">
                <td>{{ vanDon.ma_van_don }}</td>
                <td>{{ vanDon.ten_hang_hoa }}</td>
                <td>{{ vanDon.bien_so }}</td>
                <td>{{ vanDon.ngay_tao_van_don }}</td>      
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div id="img_container" class="mt-3 text-center">
      <img :src="imageUrl" class="p-3" alt="" id="imageUrl"><br>
      <img :src="imageCrop" alt="" id="imageCrop">
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
    const imageUrl = ref('http://183.81.27.133:8000/api/lich-su-phuong-tien/lastest/image');
    const imageCrop = ref('http://183.81.27.133:8000/api/lich-su-phuong-tien/lastest/image_crop');
    const currentBienSo = ref('');
    const vanDons = ref([]);
    const toKhais = ref([]);
    const maVanDon = ref(0);
    const ngayDangKy = ref(new Date().toISOString().substr(0, 10));
    let intervalId;

    const getLastestImage = () => {
      imageUrl.value = `http://183.81.27.133:8000/api/lich-su-phuong-tien/lastest/image?time=${new Date().getTime()}`;
    }

    const getImageCrop = () => {
      imageCrop.value = `http://183.81.27.133:8000/api/lich-su-phuong-tien/lastest/image_crop?time=${new Date().getTime()}`
    }

    onMounted(() => {
      document.title = "Quản lý xe ra vào";
      intervalId = setInterval(getLastestImage, 1000);
      intervalId = setInterval(getImageCrop, 1000);
    });

    onUnmounted(() => {
      clearInterval(intervalId);
    });

    const getFirstVanDon = async() => {
      try{
        const response = await axios.get(`/api/lich-su-phuong-tien/lastest`)
        firstVanDon.value = [response.data];
        currentBienSo.value = response.data.bien_so;
        getToKhais(); // Call getToKhais after currentBienSo.value is updated
      } catch (error) {
        console.log(error);
      }
    }

    const getToKhais = async() => {
      axios.get(`/api/to-khai/ngay-dang-ky/${ngayDangKy.value}/bien-so/${currentBienSo.value}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(function(response){
        toKhais.value = response.data;
        maVanDon.value = response.data.ma_van_don;
        console.log(response.data);
        getVanDons(); // Call getVanDons after maVanDon.value is updated
      })
      .catch(function(error){
        console.log(error);
      });
    }

    const getVanDons = () => {
      axios.get(`/api/van-don/${maVanDon.value}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(function(response){
        vanDons.value = [response.data];
        console.log(response.data); 
      })
      .catch(function(error){
        console.log(error);
      });
    };

    getFirstVanDon();
    getLastestImage();
    getVanDons();
    getToKhais();
    getImageCrop();

    setInterval(() => {
      getFirstVanDon();
      getVanDons();
    }, 1000);

    return{
      firstVanDon,
      imageUrl,
      currentBienSo,
      intervalId,
      getFirstVanDon,
      getLastestImage,
      vanDons,
      toKhais,
      maVanDon,
      ngayDangKy,
      getToKhais,
      getVanDons,
      imageCrop
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
#img_container #imageCrop {
  width: 200px;
  height: 100px; ;
}
#img_container #imageUrl {
  width: 400px;
  height: 250px;
}
</style>