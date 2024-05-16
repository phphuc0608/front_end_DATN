<template>
  <NavbarCongty/>
  <div id="content" class="container-fluid px-5">
    <h3 class="text-center" style="margin-top: 120px; margin-bottom: 60px;">THỐNG KÊ VẬN ĐƠN VÀ TỜ KHAI</h3>
    <div class=" d-flex justify-content-center align-items-center px-3 pb-3 mb-3">
      <div v-for="singleBox in boxData1" class="box col-md-4" :style="{ backgroundColor: singleBox.color }">
        <div class="box_header">
          <h5>{{ singleBox.title }}</h5>
        </div>
        <div class="box_number">
          <h1>{{ singleBox.number }}</h1>
        </div>
      </div>
    </div>
    <div class=" d-flex justify-content-center align-items-center px-3 pb-3 mb-3">
      <div v-for="singleBox in boxData2" class="box col-md-4" :style="{ backgroundColor: singleBox.color }">
        <div class="box_header">
          <h5>{{ singleBox.title }}</h5>
        </div>
        <div class="box_number">
          <h1>{{ singleBox.number }}</h1>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="box_container">
          <div class="header_container">
            <h5>Thống kê vận đơn</h5>
          </div>
          <div class="content_container">
            <div class="chart_container">
              <Bar :data="chartDataVanDon" :option="chartOptions"/> 
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="box_container">
          <div class="header_container">
            <h5>Thống kê tờ khai</h5>
          </div>
          <div class="content_container">
            <div class="chart_container">
              <Bar :data="chartDataToKhai" :option="chartOptions"/> 
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import NavbarCongty from '../../../components/NavbarCongty.vue';
import {Bar} from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import router from '../../../routers/router';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
export default {
  setup() {
    const vanDons = ref([]);
    const maDonVi = ref(localStorage.getItem('savedThuocDonVi'));
    const totalVanDons = ref(0);
    const toKhais = ref([]);
    const totalToKhais = ref(0);
    const vanDonTheoThang = ref(0);
    const thangHienTai = ref(new Date().getMonth() + 1);
    const vanDonTheoQuy = ref(0);
    const quyHienTai = ref(Math.floor((new Date().getMonth() + 1) / 3) + 1);
    const toKhaiTheoThang = ref(0);
    const toKhaiTheoQuy = ref(0);
    //Computed property sẽ tự động cập nhật khi các reactive dependencies thay đổi.
    const boxData1 = computed(() => [
      {
        title: 'Tổng số vận đơn',
        number: totalVanDons.value,
        color: '#FFB6C1'
      },
      {
        title: 'Tổng số tờ khai',
        number: totalToKhais.value,
        color: '#FFD700'
      },
      {
        title: 'Vận đơn theo tháng',
        number: vanDonTheoThang.value,
        color: '#FFA07A'
      },
    ]);
    const boxData2 = computed(() => [
      {
        title: 'Vận đơn theo quý',
        number: vanDonTheoQuy.value,
        color: '#87CEEB'
      },
      {
        title: 'Tờ khai theo tháng',
        number: toKhaiTheoThang.value,
        color: '#98FB98'
      },
      {
        title: 'Tờ khai theo quý',
        number: toKhaiTheoQuy.value,
        color: '#9370DB'
      }
    ]);
    const chartOptions = ref({
      responsive: true,
    });

    const getVanDons = async() => {
      try {
        const response = await axios.get(`/api/van-don/doanh-nghiep/${maDonVi.value}`);
        vanDons.value = response.data;
        totalVanDons.value = vanDons.value.length;
        console.log(totalVanDons.value)
      } catch (error) {
        console.log(error);
      }
    };

    const getToKhais = async () => {
      try{
        const response = await axios.get(`/api/to-khai/doanh-nghiep/${maDonVi.value}`);
        toKhais.value = response.data;
        totalToKhais.value = toKhais.value.length;
      } catch (error) {
        console.log(error);
      }
    }
    
    const getVanDonTheoThangs = async() => {
      try{
        const response = await axios.get(`/api/thong-ke/so-luong-van-don-theo-thang/${maDonVi.value}/${thangHienTai.value}`);
        vanDonTheoThang.value = response.data;
      } catch (error) {
        console.log(error);
      }
    }

    const getVanDonTheoQuys = async() => {
      try{
        const response = await axios.get(`/api/thong-ke/so-luong-van-don-theo-quy/${maDonVi.value}/${quyHienTai.value}`);
        vanDonTheoQuy.value = response.data;
      } catch (error) {
        console.log(error);
      }
    }

    const gettoKhaiTheoThangs = async() => {
      try{
        const response = await axios.get(`/api/thong-ke/so-luong-to-khai-theo-thang/${maDonVi.value}/${thangHienTai.value}`);
        toKhaiTheoThang.value = response.data;
      } catch (error) {
        console.log(error);
      }
    }

    const gettoKhaiTheoQuys = async() => {
      try{
        const response = await axios.get(`/api/thong-ke/so-luong-to-khai-theo-quy/${maDonVi.value}/${quyHienTai.value}`);
        toKhaiTheoQuy.value = response.data;
      } catch (error) {
        console.log(error);
      }
    }

    const chartDataVanDon = computed(()=>({
      labels: ['Vận đơn theo tháng', 'Vận đơn theo quý'],
      datasets: [
        {
          //label: 'Vận đơn', 
          data: [vanDonTheoThang.value, vanDonTheoQuy.value],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
          ],
          borderWidth: 1
        }
      ],
    }));
    const chartDataToKhai = computed(()=>({
      labels: ['Tờ khai theo tháng', 'Tờ khai theo quý'],
      datasets: [
        {
          // label: ['Vận đơn', 'Tờ khai'],
          data: [Number(toKhaiTheoThang.value), Number(toKhaiTheoQuy.value)],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
          ],
          borderWidth: 1
        }
      ],
    }));
    console.log(chartDataToKhai.value);

    onMounted(() => {
      document.title = "Thống kê";
      getVanDons();
      getToKhais();
      getVanDonTheoThangs();
      getVanDonTheoQuys();
      gettoKhaiTheoThangs();
      gettoKhaiTheoQuys();
    });
    return{
      chartDataToKhai,
      chartDataVanDon,
      chartOptions,
      boxData1,
      boxData2,
      totalVanDons,
      totalToKhais,
      vanDonTheoThang,
      vanDonTheoQuy,
      toKhaiTheoThang,
      toKhaiTheoQuy
    }
  },

  components:{
    NavbarCongty,
    Bar,
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
.box{
  background-color: white;
  border-radius: 0.5rem;
  margin-right: 1rem;
  padding: 1rem;
  box-shadow: 0 0 10px rgba(7, 7, 7, 0.1);
}
</style>