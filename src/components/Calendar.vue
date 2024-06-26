<template>
  <div class="d-flex justify-content-center align-items-center">
    <div class="calendar">
      <div class="calendar-header d-flex justify-content-center align-items-center">
        <div class="month_container d-flex justify-content-center align-items-center">
          <select class="form-control form-select text-center" v-model="currentMonth" @change="updateMonth" style="width: 100%;">
            <option v-for="month in 12" :key="month" :value="month - 1" :selected="month - 1 === currentMonth">
              {{ new Date(0, month - 1).toLocaleString('vi-VN', { month: 'long' }) }}
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
      <div class="calendar-weekdays">
        <div v-for="(weekday, index) in weekdays" :key="index" class="calendar-weekday">
          {{ translateWeekday(weekday) }} 
        </div>
      </div>
      <div class="calendar-body">
        <div v-for="day in days" :key="day" 
          :class="[
            'calendar-day p-4', 
            { 'empty-day': !day } 
          ]"
          :style="{ backgroundColor: calculateColor(day) }"
        >
          <div class="day-label" v-if="day">{{ day }}</div>
            <div class="to-khai-count-container" v-if="day && toKhaiCounts[day]">
              {{ toKhaiCounts[day] }} tờ khai
            </div>
            <div class="to-khai-count-container" v-else-if="day">
              0 tờ khai
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import moment from 'moment';

export default {
  setup() {
    const now = new Date();
    const currentMonth = ref(now.getMonth()); 
    const currentYear = ref(now.getFullYear());
    const toKhaiCounts = ref({});
    const firstDayOfWeek = ref(1);
    const minToKhai = ref(0);
    const maxToKhai = ref(0);
    //Calculate year range from 10 years ago to 10 years later
    const yearRange = computed(() => {
      const startYear = now.getFullYear() - 10; 
      const endYear = now.getFullYear() + 10; 
      const years = [];
      for (let year = startYear; year <= endYear; year++) {
        years.push(year);
      }
      return years;
    });
    //Fetch to khai counts from API
    const fetchToKhaiCounts = async () => {
      try {
        //Get first and last date of the month
        const startDate = new Date(currentYear.value, currentMonth.value, 1);
        const endDate = new Date(currentYear.value, currentMonth.value + 1, 0);
        //Reset toKhaiCounts
        toKhaiCounts.value = {}; 
        //Fetch to khai counts for each day in the month
        for (let day = startDate.getDate(); day <= endDate.getDate(); day++) {
          const currentDate = moment(startDate).date(day); 
          const formattedDate = currentDate.format('YYYY-MM-DD');
          const response = await axios.get(`/api/to-khai/ngay-dang-ky/${formattedDate}/tong-so`);
          toKhaiCounts.value[day] = response.data;
          maxToKhai.value = Math.max(maxToKhai.value, response.data); // Update maxToKhai
        }
        //Fetch maxToKhai
        const maxResponse = await axios.get('/api/to-khai/so-luong/to-khai-max');
        maxToKhai.value = maxResponse.data;
      } catch (error) {
          console.error(error);
      }
    };
    //Calculate number of days in the month
    const daysInMonth = computed(() => {
      return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
    });
    //Calculate current month name
    const currentMonthName = computed(() => {
      return now.toLocaleString('default', { month: 'long' });
    });
    //Calculate first day of month offset
    const firstDayOfMonthOffset = computed(() => {
      return new Date(currentYear.value, currentMonth.value, 1).getDay() - firstDayOfWeek.value;
    });
    //Calculate last day of week
    const lastDayOfWeek = computed(() => {
      return new Date(currentYear.value, currentMonth.value + 1, 0).getDay();
    });
    //Calculate days to display in the calendar
    const days = computed(() => {
      const daysToDisplay = daysInMonth.value + firstDayOfMonthOffset.value;
      const extraDays = (7 - (daysToDisplay % 7)) % 7; 
      const totalDays = daysToDisplay + extraDays;
      const result = [];
      for (let i = 0; i < firstDayOfMonthOffset.value; i++) {
        result.push(null); 
      }
      for (let i = 1; i <= daysInMonth.value; i++) {
        result.push(i); 
      }
      for (let i = 0; i < extraDays; i++) {
        result.push(null); 
      }
      return result;
    });
    //Calculate weekdays
    const weekdays = computed(() => {
      return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    });
    //Translate weekday to Vietnamese
    const translateWeekday = (weekday) => {
      const translations = {
        'Monday': 'Thứ hai',
        'Tuesday': 'Thứ ba',
        'Wednesday': 'Thứ tư',
        'Thursday': 'Thứ năm',
        'Friday': 'Thứ sáu',
        'Saturday': 'Thứ bảy',
        'Sunday': 'Chủ nhật'
      };
      return translations[weekday] || weekday; 
    };
    //Update month
    const updateMonth = async () => {
      now.setMonth(currentMonth.value);
      await fetchToKhaiCounts();
    };
    //Update year
    const updateYear = async () => {
      await fetchToKhaiCounts(); 
    };

    onMounted(() => {
      fetchToKhaiCounts();
    });
    //Calculate color based on to khai count
    const calculateColor = (day) => {
      //Return #ccfccc if there are no to khai
      if (!toKhaiCounts.value[day] || toKhaiCounts.value[day] === 0) {
        return '#ccfccc'; // 
      }
      //Calculate hue based on to khai count
      const countRange = maxToKhai.value - minToKhai.value;
      const countRatio = (toKhaiCounts.value[day] - minToKhai.value) / countRange;
      const hue = 120 - (120 * countRatio); // Calculate hue from 0 to 120
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
      calculateColor,
      firstDayOfWeek,
      weekdays,
      translateWeekday,
      firstDayOfMonthOffset,
      lastDayOfWeek,

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

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #d2dbee; 
  text-align: center;
  border-bottom: 1px solid #eee;
}

.calendar-weekday {
  padding: 5px;
  font-weight: bold;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* 7 cột cho 7 ngày trong tuần */
  grid-auto-rows: minmax(74.3px, auto);
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

.calendar-day:empty { 
  border: none;
}

.calendar-day.empty-day {  
  background-color: #ccc!important;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
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
  font-size: 17px;
}

.to-khai-count {
  font-size: 12px;
  color: #666;
}


.to-khai-count { 
  font-size: 12px;
  color: black; 
  padding: 2px 4px; 
}

.no-to-khai {
  color: black !important;;
}

</style>