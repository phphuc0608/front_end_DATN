<template>
  <div class="col-md-12 d-flex align-items-center justify-content-end flex-wrap px-3 py-2" style="background-color: white;">
    <nav aria-label="Page navigation example mb-2">
      <ul class="pagination mb-2 mb-sm-0">
        <li class="page-item">
          <a class="page-link" href="#" @click.prevent="previousPage">
            <i class="bi bi-arrow-left-short"></i>
          </a>
        </li>
        <li class="page-item" v-for="page in displayPages" :key="page">
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
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  props: {
    totalItems: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  emits: ['page-changed'],
  setup(props, { emit }) {
    const currentPage = ref(props.currentPage);

    watch(() => props.currentPage, (newPage) => {
      currentPage.value = newPage;
    });

    const totalPages = computed(() => {
      return Math.ceil(props.totalItems / props.itemsPerPage);
    });

    const changePage = (page) => {
      if (page !== '...') {
        currentPage.value = page;
        emit('page-changed', page);
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        emit('page-changed', currentPage.value);
      }
    };

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        emit('page-changed', currentPage.value);
      }
    };

    const displayPages = computed(() => {
      let pages = [];
      let startPage = Math.max(currentPage.value - 2, 1);
      let endPage = Math.min(currentPage.value + 2, totalPages.value);

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages.value) {
        if (endPage < totalPages.value - 1) {
          pages.push('...');
        }
        pages.push(totalPages.value);
      }

      return pages;
    });

    return {
      currentPage,
      totalPages,
      changePage,
      nextPage,
      previousPage,
      displayPages
    }
  }
}
</script>

<style scoped>
.pagination .page-item .page-link {
  text-decoration: none;
  color: #6e6e6e;
}
.pagination .page-item .page-link:hover {
  background-color: #452B90;
  color: white;
  border-color: #452B90; 
}
</style>
