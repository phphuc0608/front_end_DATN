<template>
  <NavbarCuakhau/>
  <div id="content" class="container-fluid px-5" style="margin-top: 110px;">
    <div id="button_container">
      <button @click="printReport" class="btn btn-primary p-2 my-2 me-2">
        <i class="bi bi-file-pdf-fill"></i> Xuất báo cáo
      </button>
    </div>
    <div id="print_area">
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
        <div class="col-md-4" id="chartPhuongTienTheoTrangThai">
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
        <div class="col-md-4" id="chartToKhaiTheoTrangThai">
          <div class="box_container">
            <div class="header_container">
              <h5>Thống kê tờ khai theo trạng thái</h5>
            </div>
            <div class="content_container">
              <div class="chart_container">
                <v-chart class="chart" :option="chartToKhaiTheoTrangThai" autoresize/>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4" id="chartToKhaiMTD">
          <div class="box_container">
            <div class="header_container">
              <h5>Thống kê tờ khai hàng tháng</h5>
            </div>
            <div class="content_container">
              <div class="chart_container">
                <v-chart class="chart" :option="chartToKhaiMTD" autoresize/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
          <div class="box_container">
            <div class="header_container">
              <h5>Bảng phương tiện theo trạng thái</h5>
            </div>
            <div class="table table-responsive m-0">
              <table class="table table-bordered m-0">
                <thead>
                  <tr>
                    <th>Trạng thái</th>
                    <th>Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(soLuong, trangThai) in phuongTienTheoTrangThais" :key="trangThai"> 
                    <td>{{ trangThai }}</td>
                    <td>{{ soLuong }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="box_container">
            <div class="header_container">
              <h5>Bảng tờ khai theo trạng thái</h5>
            </div>
            <div class="table table-responsive m-0">
              <table class="table table-bordered m-0">
                <thead>
                  <tr>
                    <th>Trạng thái</th>
                    <th>Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(soLuong, trangThai) in toKhaiTheoTrangThais" :key="trangThai">
                    <td>{{ trangThai }}</td>
                    <td>{{ soLuong }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="box_container">
            <div class="header_container">
              <h5>Bảng tờ khai hàng tháng</h5>
            </div>
            <div class="table table-responsive m-0">
              <table class="table table-bordered m-0">
                <thead>
                  <tr>
                    <th>Tháng</th>
                    <th>Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(soLuong, index) in toKhaiMTD" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ soLuong }}</td>
                  </tr>
                </tbody>
              </table>
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

use([BarChart, TitleComponent, TooltipComponent, CanvasRenderer,LegendComponent, GridComponent, PieChart]);

export default {
  setup() {
    const totalVanDons = ref(0);
    const totalToKhais = ref(0);
    const thangHienTai = ref(new Date().getMonth() + 1);
    const ngayHienTai = ref(new Date().getDate());  
    const quyHienTai = ref(Math.floor((new Date().getMonth() + 1) / 3) + 1);
    const toKhaiTheoThang = ref(0);
    const toKhaiTheoQuy = ref(0);
    const toKhaiTheoNgay = ref(0);
    const phuongTienTheoTrangThais = ref([]);
    const toKhaiTheoTrangThais = ref([]);
    const phuongTienHopLe = ref(0);
    const phuongTienKhongHopLe = ref(0);
    const dateFormat = ref(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`);
    const months = Array.from({ length: 12 }, (_, i) => i + 1); //Create an array of 12 months
    const toKhaiMTD = ref([]);

    provide(THEME_KEY, 'light');

    //Computed property sẽ tự động cập nhật khi các reactive dependencies thay đổi.
    const boxData1 = computed(() => [
      {
        title: 'Tổng số tờ khai',
        number: totalToKhais.value,
        color: '#FFB6C1'
      },
      {
        title: `Tờ khai tháng ${thangHienTai.value}`,
        number: toKhaiTheoThang.value,
        color: '#98FB98'
      },
      {
        title: 'Tổng số phương tiện hợp lệ',
        number: phuongTienHopLe.value,
        color: '#FFD700'
      },

    ]);

    const boxData2 = computed(() => [
      {
        title: `Tờ khai quý ${quyHienTai.value}`,
        number: toKhaiTheoQuy.value,
        color: '#87CEEB'
      },  
      {
        title: `Tờ khai ngày ${ngayHienTai.value}/${thangHienTai.value}`,
        number: toKhaiTheoNgay.value,
        color: '#9370DB'
      },
      {
        title: 'Tổng số phương tiện không hợp lệ',
        number: phuongTienKhongHopLe.value,
        color: '#FFA07A'
      },
    ]);

    const getToKhais = async () => {
      try{
        const response = await axios.get(`/api/thong-ke/so-luong-to-khai`);
        totalToKhais.value = response.data;
      } catch (error) {
        console.log(error);
      }
    }

    const getToKhaiTheoThangs = async() => {
      try{
        const response = await axios.get(`/api/thong-ke/so-luong-to-khai-theo-thang/${thangHienTai.value}`);
        toKhaiTheoThang.value = response.data;
      } catch (error) {
        console.log(error);
      }
    }

    const getToKhaiMTD = async () => {
      try {
        const results = await Promise.all(
          months.map(month => axios.get(`/api/thong-ke/so-luong-to-khai-theo-thang/${month}`))
        );

        toKhaiMTD.value = results.map(res => res.data);
      } catch (error) {
        console.error("Error fetching to khai data:", error);
      }
    }; 

    const getToKhaiTheoQuys = async() => {
      try{
        const response = await axios.get(`/api/thong-ke/so-luong-to-khai-theo-quy/${quyHienTai.value}`);
        toKhaiTheoQuy.value = response.data;
      } catch (error) {
        console.log(error);
      }
    }

    const getToKhaiTheoNgays = async() => {
      try{
        const response = await axios.get(`/api/thong-ke/so-luong-to-khai-theo-ngay/${dateFormat.value}`);
        console.log(dateFormat.value)
        toKhaiTheoNgay.value = response.data;
      } catch (error) {
        console.log(error);
      }
    }

    const getPhuongTienTheoTrangThai = async() => {
      try{
        const response = await axios.get(`/api/thong-ke/so-luong-phuong-tien-theo-trang-thai`);
        phuongTienTheoTrangThais.value = response.data;
        console.log(phuongTienTheoTrangThais.value);
        phuongTienHopLe.value = phuongTienTheoTrangThais.value['Hợp lệ'];
        phuongTienKhongHopLe.value = phuongTienTheoTrangThais.value['Không hợp lệ'];
      } catch (error) {
        console.log(error);
      }
    }

    const getToKhaiTheoTrangThais = async() => {
      try{
        const response = await axios.get(`/api/thong-ke/so-luong-to-khai-theo-trang-thai`);
        toKhaiTheoTrangThais.value = response.data;
      } catch (error) {
        console.log(error);
      }
    }

    const chartToKhaiMTD = computed(() => ({
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c}' 
      },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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

    const chartToKhaiTheoTrangThai = computed(()=>{
      const transformedData = Object.entries(toKhaiTheoTrangThais.value).map(([name, value]) => ({ name, value }));
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: ['Chờ thông quan', 'Đăng ký thất bại', 'Bị hủy', 'Đã thông quan'],
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

    const chartPhuongTienTheoTrangThai = computed(() => {
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
            name: 'Phương tiện theo trạng thái',
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

    const printReport = async () => {
      // 1. Get the Report Section
      const reportSection = document.getElementById('print_area');

      // 2. Adjust Page Size and Margin
      const pdfOptions = {
        margin: 10,
        filename: 'thong_ke_cua_khau.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 }, // Adjust as needed
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // 3. Generate the PDF
      try {
        const canvas = await html2canvas(reportSection, pdfOptions.html2canvas);
        const imgData = canvas.toDataURL(pdfOptions.image.type, pdfOptions.image.quality);

        const pdf = new jsPDF(pdfOptions.jsPDF);  
        const imgProps= pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', pdfOptions.margin, pdfOptions.margin, pdfWidth - 2 * pdfOptions.margin, pdfHeight - 2 * pdfOptions.margin);
        pdf.save(pdfOptions.filename); 
      } catch (error) {
        console.error("Lỗi khi tạo PDF:", error); 
      }
    };

    onMounted(() => {
      document.title = "Thống kê";
      getToKhais();
      getToKhaiTheoThangs();
      getToKhaiTheoQuys();
      getToKhaiTheoNgays();
      getPhuongTienTheoTrangThai();
      getToKhaiTheoTrangThais();
      getToKhaiMTD();
    });

    return{
      chartPhuongTienTheoTrangThai,
      chartToKhaiTheoTrangThai,
      chartToKhaiMTD,
      boxData1,
      boxData2,
      totalVanDons,
      totalToKhais,
      toKhaiTheoThang,
      toKhaiTheoQuy,
      toKhaiTheoNgay,
      toKhaiTheoTrangThais,
      phuongTienTheoTrangThais,
      phuongTienHopLe,
      phuongTienKhongHopLe,
      dateFormat,
      toKhaiMTD,
      months,
      printReport,
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