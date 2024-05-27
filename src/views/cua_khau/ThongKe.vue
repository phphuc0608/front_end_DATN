<template>
  <NavbarCuakhau/>
  <div id="content" class="container-fluid px-5" style="margin-top: 110px;">
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
          <h1>
            {{ singleBox.number }}
            <span
              v-if="singleBox.percentChange"
              :class="{'text-success': singleBox.percentChange > 0, 'text-danger': singleBox.percentChange < 0}"
              style="font-size: 25px;"
            >
              {{ singleBox.percentChange > 0 ? '+' : '' }}{{ singleBox.percentChange }}%
            </span>
          </h1>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="box_container">
          <div class="header_container">
            <h5>Thống kê phương tiện theo trạng thái</h5>
          </div>
          <div class="content_container">
            <div class="chart_container">
              <v-chart class="chart" :option="chartPhuongTienTheoTrangThai" autoresize/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed, provide } from 'vue';
import NavbarCuakhau from '../../components/NavbarCuakhau.vue';
import { use } from 'echarts/core';
import { BarChart, PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import VChart, { THEME_KEY } from 'vue-echarts';

use([BarChart, TitleComponent, TooltipComponent, CanvasRenderer,LegendComponent, GridComponent, PieChart]);

export default {
  setup() {
    const vanDons = ref([]);
    const maDonVi = ref(localStorage.getItem('savedThuocDonVi'));
    const totalVanDons = ref(0);
    const toKhais = ref([]);
    const totalToKhais = ref(0);
    const vanDonTheoThang = ref(0);
    const vanDonThangTruoc = ref(0);
    const thangHienTai = ref(new Date().getMonth() + 1);
    const thangTruoc = ref(thangHienTai.value - 1);
    const ngayHienTai = ref(new Date().getDate());  
    const vanDonTheoQuy = ref(0);
    const quyHienTai = ref(Math.floor((new Date().getMonth() + 1) / 3) + 1);
    const toKhaiTheoThang = ref(0);
    const toKhaiThangTruoc = ref(0);
    const toKhaiTheoQuy = ref(0);
    const toKhaiTheoNgay = ref(0);
    const vanDonTheoNgay = ref(0);
    const vanDonMTD = ref([]);
    const toKhaiMTD = ref([]);
    const phuongTienTheoTrangThais = ref([]);

    provide(THEME_KEY, 'light');

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
        title: `Vận đơn ngày ${ngayHienTai.value}/${thangHienTai.value}`,
        number: vanDonTheoNgay.value,
        color: '#87CEEB'
      },
    ]);

    const boxData2 = computed(() => [
      {
        title: `Vận đơn tháng ${thangHienTai.value}`,
        number: vanDonTheoThang.value,
        color: '#FFA07A',
        percentChange: vanDonThangTruoc.value === 0 ? 100 : ((vanDonTheoThang.value - vanDonThangTruoc.value) / vanDonThangTruoc.value * 100).toFixed(2)
      },
      {
        title: `Tờ khai ngày ${ngayHienTai.value}/${thangHienTai.value}`,
        number: toKhaiTheoNgay.value,
        color: '#9370DB'
      },
      {
        title: `Tờ khai tháng ${thangHienTai.value}`,
        number: toKhaiTheoThang.value,
        color: '#98FB98',
        percentChange: toKhaiThangTruoc.value === 0 ? 100 : ((toKhaiTheoThang.value - toKhaiThangTruoc.value) / toKhaiThangTruoc.value * 100).toFixed(2)
      },
    ]);
    
    const getVanDonMTD = async() => {
      try{
        const response = await axios.get(`/api/thong-ke/so-luong-van-don-mtd/${maDonVi.value}`);
        vanDonMTD.value = response.data;
        console.log(vanDonMTD.value); 
      } catch (error) {
        console.log(error);
      }
    };

    const getToKhaiMTD = async() => {
      try{
        const response = await axios.get(`/api/thong-ke/so-luong-to-khai-mtd/${maDonVi.value}`);
        toKhaiMTD.value = response.data;
      } catch (error) {
        console.log(error);
      }
    };

    const chartVanDonMTD = computed(() => ({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}'
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: vanDonMTD.value,
          type: 'bar'
        }
      ]
    }));

    const chartToKhaiMTD = computed(() => ({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}'
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: toKhaiMTD.value,
          type: 'bar'
        }
      ]
    }));

    const getVanDons = async() => {
      try {
        const response = await axios.get(`/api/van-don`);
        vanDons.value = response.data;
        totalVanDons.value = vanDons.value.length;
        console.log(totalVanDons.value)
      } catch (error) {
        console.log(error);
      }
    };

    const getToKhais = async () => {
      try{
        const response = await axios.get(`/api/to-khai`);
        toKhais.value = response.data;
        totalToKhais.value = toKhais.value.length;
      } catch (error) {
        console.log(error);
      }
    }
    
    const getVanDonTheoThangs = async() => {
      try{
        const response = await axios.get(`/api/thong-ke/so-luong-van-don-theo-thang/${thangHienTai.value}`);
        vanDonTheoThang.value = response.data;
      } catch (error) {
        console.log(error);
      }
    }

    const getVanDonThangTruocs = async() => {
      try{
        const response = await axios.get(`/api/thong-ke/so-luong-van-don-theo-thang/${thangTruoc.value}`);
        vanDonThangTruoc.value = response.data;
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

    const getToKhaiTheoThangs = async() => {
      try{
        const response = await axios.get(`/api/thong-ke/so-luong-to-khai-theo-thang/${maDonVi.value}/${thangHienTai.value}`);
        toKhaiTheoThang.value = response.data;
      } catch (error) {
        console.log(error);
      }
    }

    const getToKhaiThangTruocs = async() => {
      try{
        const response = await axios.get(`/api/thong-ke/so-luong-to-khai-theo-thang/${maDonVi.value}/${thangTruoc.value}`);
        toKhaiThangTruoc.value = response.data;
      } catch (error) {
        console.log(error);
      }
    }

    const getToKhaiTheoQuys = async() => {
      try{
        const response = await axios.get(`/api/thong-ke/so-luong-to-khai-theo-quy/${maDonVi.value}/${quyHienTai.value}`);
        toKhaiTheoQuy.value = response.data;
      } catch (error) {
        console.log(error);
      }
    }

    const getToKhaiTheoNgays = async() => {
      try{
        const response = await axios.get(`/api/thong-ke/so-luong-to-khai-theo-ngay/${maDonVi.value}`);
        toKhaiTheoNgay.value = response.data;
      } catch (error) {
        console.log(error);
      }
    }

    const getVanDonTheoNgays = async() => {
      try{
        const response = await axios.get(`/api/thong-ke/so-luong-van-don-theo-ngay/${maDonVi.value}`);
        vanDonTheoNgay.value = response.data;
      } catch (error) {
        console.log(error);
      }
    }

    const getPhuongTienTheoTrangThai = async() => {
      try{
        const response = await axios.get(`/api/thong-ke/so-luong-phuong-tien-theo-trang-thai`);
        phuongTienTheoTrangThais.value = response.data;
        console.log(phuongTienTheoTrangThais.value);  
      } catch (error) {
        console.log(error);
      }
    }

    const chartPhuongTienTheoTrangThai = computed(() => {
      // Transform the data into the expected format
      const transformedData = Object.entries(phuongTienTheoTrangThais.value).map(([name, value]) => ({ name, value }));

      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: ['Hợp lệ', 'Không hợp lệ'],
        },
        series: [
          {
            name: 'Tờ khai theo trạng thái',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: transformedData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          }
        ]
      };
    });

    onMounted(() => {
      document.title = "Thống kê";
      getVanDons();
      getToKhais();
      getVanDonTheoThangs();
      getVanDonTheoQuys();
      getToKhaiTheoThangs();
      getToKhaiTheoQuys();
      getToKhaiTheoNgays();
      getVanDonTheoNgays();
      getVanDonMTD();
      getToKhaiMTD();
      getPhuongTienTheoTrangThai();
      getVanDonThangTruocs();
      getToKhaiThangTruocs();
    });

    return{
      chartPhuongTienTheoTrangThai,
      boxData1,
      boxData2,
      totalVanDons,
      totalToKhais,
      vanDonTheoThang,
      vanDonThangTruoc,
      vanDonTheoQuy,
      toKhaiTheoThang,
      toKhaiThangTruoc,
      toKhaiTheoQuy,
      toKhaiTheoNgay,
      vanDonTheoNgay,
      chartVanDonMTD,
      vanDonMTD,
      chartToKhaiMTD,
      toKhaiMTD,
      phuongTienTheoTrangThais,
    }
  },

  components:{
    NavbarCuakhau,
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
  border: 1px solid #dad8d4;
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
.chart{
  min-height: 458px;
}
</style>