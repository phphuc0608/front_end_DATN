<template>
  <div class="d-flex justify-content-center align-items-center">
    <div class="calendar">
      <div class="calendar-header d-flex justify-content-center align-items-center">
        <div class="month_container d-flex justify-content-center align-items-center">
          <select class="form-control form-select text-center" v-model="currentMonth" @change="updateMonth" style="width: 90%;">
            <option v-for="month in 12" :key="month" :value="month - 1" :selected="month - 1 === currentMonth">
              {{ new Date(0, month - 1).toLocaleString('default', { month: 'long' }) }}
            </option>
          </select>
        </div>
        <div class="year_container d-flex justify-content-center align-items-center">
          <select class="form-control form-select text-center" v-model="currentYear" @change="updateYear" style="width: 100%;">
            <option v-for="year in yearRange" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
        </div>
      <div class="calendar-body">
        <div v-for="day in days" :key="day" :class="['calendar-day', { 'current-day': day === today }]" > 
          {{ day }}
          <div v-if="toKhaiCounts[day]" :class="['to-khai-count', { 'current-day': day === today }]">
            {{ toKhaiCounts[day] }} tờ khai
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { computed, onMounted, ref, watch } from 'vue';

export default {
  setup() {
    const now = new Date();
    const currentMonth = ref(now.getMonth()); // Lấy tháng hiện tại
    const currentYear = ref(now.getFullYear());
    const toKhaiCounts = ref({});

    const yearRange = computed(() => {
      const startYear = now.getFullYear() - 10; // Năm bắt đầu của range
      const endYear = now.getFullYear() + 10; // Năm kết thúc của range
      const years = [];
      for (let year = startYear; year <= endYear; year++) {
        years.push(year);
      }
      return years;
    });

    const today = computed(() => {
      const now = new Date();
      return now.getMonth() === currentMonth.value && now.getFullYear() === currentYear.value
        ? now.getDate() 
        : null; // Nếu không phải tháng hiện tại, không highlight ngày nào
    });

  
    const fetchToKhaiCounts = async () => {
      try {
        const startDate = new Date(currentYear.value, currentMonth.value, 1);
        const endDate = new Date(currentYear.value, currentMonth.value + 1, 0);
        // Clear existing counts before updating
        toKhaiCounts.value = {}; 
        for (let day = startDate.getDate(); day <= endDate.getDate(); day++) {
            const currentDate = new Date(currentYear.value, currentMonth.value, day);
            // Format the date string with the 'en-CA' locale for yyyy-mm-dd and UTC timezone
            const formattedDate = currentDate.toLocaleDateString('en-CA', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              timeZone: 'UTC' 
            });
            const response = await axios.get(`/api/to-khai/ngay-dang-ky/${formattedDate}/tong-so`);
            toKhaiCounts.value[day] = response.data; 
        }
      } catch (error) {
          console.error(error);
      }
  };

    const daysInMonth = computed(() => {
      return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
    });

    const currentMonthName = computed(() => {
      return now.toLocaleString('default', { month: 'long' });
    });

    const days = computed(() => {
      const result = [];
      for (let i = 1; i <= daysInMonth.value; i++) {
        result.push(i);
      }
      return result;
    });

    const updateMonth = async () => {
      now.setMonth(currentMonth.value);
      await fetchToKhaiCounts(); // Đợi fetchToKhaiCounts hoàn thành trước khi cập nhật giao diện
    };

    const updateYear = async () => {
      await fetchToKhaiCounts(); 
    };

    onMounted(() => {
      fetchToKhaiCounts();
    });

    watch([currentMonth, currentYear], () => {
      const now = new Date();
      today.value = now.getMonth() === currentMonth.value && now.getFullYear() === currentYear.value
        ? now.getDate() 
        : null;
    });

    return {
      currentMonthName,
      days,
      toKhaiCounts,
      updateMonth,
      currentMonth,
      today,
      updateYear,
      currentYear,
      yearRange
    };
  },
};
</script>

<style scoped>
.calendar {
  width: 100%; 
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: sans-serif;
}
.calendar-header {
  background-color: #3a496c ;
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #ccc;
  border-radius: 8px 8px 0 0;
}
.calendar-header h4 {
  color: white;
}
.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* 7 cột cho 7 ngày trong tuần */
}
.calendar-day {
  text-align: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  border-right: 1px solid #eee;
}
.calendar-day:nth-child(7n) { /* Loại bỏ viền phải của ngày cuối tuần */
  border-right: none;
}
.to-khai-count {
  font-size: 12px;
  color: #666;
}
.current-day {
  background-color: #3a496c;
  color: white;
}
.calendar-day.current-day, 
.calendar-day.current-day .to-khai-count {
  color: white;
}
</style>