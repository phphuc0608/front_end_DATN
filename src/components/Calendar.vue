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
        <div v-for="day in days" :key="day" 
        :class="[
            'calendar-day p-4',
            { 'min-to-khai': dayIsMinToKhai(day) }, 
            { 'max-to-khai': dayIsMaxToKhai(day) }, 
            { 'no-to-khai': hasNoToKhai(day) } 
        ]"
        :style="{ backgroundColor: calculateColor(day) }">
          <div class="day-label">{{ day }}</div> 
          <div class="to-khai-count-container" v-if="toKhaiCounts[day]">
            {{ toKhaiCounts[day] }} tờ khai
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import { computed, onMounted, ref, watch } from 'vue';
import moment from 'moment';

export default {
  setup() {
    const now = new Date();
    const currentMonth = ref(now.getMonth()); 
    const currentYear = ref(now.getFullYear());
    const toKhaiCounts = ref({});

    const yearRange = computed(() => {
      const startYear = now.getFullYear() - 10; 
      const endYear = now.getFullYear() + 10; 
      const years = [];
      for (let year = startYear; year <= endYear; year++) {
        years.push(year);
      }
      return years;
    });
  
    const fetchToKhaiCounts = async () => {
      try {
        const startDate = new Date(currentYear.value, currentMonth.value, 1);
        const endDate = new Date(currentYear.value, currentMonth.value + 1, 0);
        toKhaiCounts.value = {}; 
        for (let day = startDate.getDate(); day <= endDate.getDate(); day++) {
          const currentDate = moment(startDate).date(day); // Tạo moment object
          const formattedDate = currentDate.format('YYYY-MM-DD');
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

    const dayIsMinToKhai = (day) => {
      return toKhaiCounts.value[day] === minToKhaiCount.value && toKhaiCounts.value[day] !== 0;
    };

    const dayIsMaxToKhai = (day) => {
      return toKhaiCounts.value[day] === maxToKhaiCount.value;
    };

    const updateMonth = async () => {
      now.setMonth(currentMonth.value);
      await fetchToKhaiCounts(); // Đợi fetchToKhaiCounts hoàn thành trước khi cập nhật giao diện
    };

    const updateYear = async () => {
      await fetchToKhaiCounts(); 
    };

    const minToKhaiCount = computed(() => {
      const values = Object.values(toKhaiCounts.value).filter(count => count > 0); // Lọc bỏ các ngày có 0 tờ khai
      return Math.min(...values);
    });

    const maxToKhaiCount = computed(() => {
      const values = Object.values(toKhaiCounts.value);
      return Math.max(...values);
    });

    const hasNoToKhai = (day) => {
      return !toKhaiCounts.value[day]; 
    };

    onMounted(() => {
      fetchToKhaiCounts();
    });

    const calculateColor = (day) => {
      if (!toKhaiCounts.value[day] || toKhaiCounts.value[day] === 0) {
        return '#ccc'; // Màu xám cho các ngày không có tờ khai
      }
      const countRange = maxToKhaiCount.value - minToKhaiCount.value;
      const countRatio = (toKhaiCounts.value[day] - minToKhaiCount.value) / countRange;
      const hue = 120 - (120 * countRatio); 
      return `hsl(${hue}, 80%, 70%)`; 
    };

    return {
      currentMonthName,
      days,
      toKhaiCounts,
      updateMonth,
      currentMonth,
      updateYear,
      currentYear,
      yearRange,
      minToKhaiCount,
      maxToKhaiCount,
      hasNoToKhai,
      dayIsMaxToKhai,
      dayIsMinToKhai,
      calculateColor,
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
  border-bottom: 1px solid #eee;
  border-right: 1px solid #eee;
  position: relative;
}

.calendar-day:nth-child(7n) { /* Loại bỏ viền phải của ngày cuối tuần */
  border-right: none;
}

.day-label {
  position: absolute;
  top: 5px;
  left: 5px;
  font-size: 13px;
}

.to-khai-count-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 15px; /* Hoặc giá trị khác tùy ý */
}

.to-khai-count {
  font-size: 12px;
  color: #666;
}

.min-to-khai .to-khai-count, 
.max-to-khai .to-khai-count {
    color: white !important; 
}

.min-to-khai, .max-to-khai {
  color: white; 
}

.to-khai-count { 
  font-size: 12px;
  color: black; 
  padding: 2px 4px; 
}

/* .min-to-khai {
  background-color: #4CAF50;
}

.max-to-khai {
  background-color: #f44336; 
}

.no-to-khai {
  background-color: #ccc; 
  color: #333; 
} */
</style>