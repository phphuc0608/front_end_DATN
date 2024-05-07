import { createRouter, createWebHistory } from 'vue-router';
const routes = [
  {
    path: '/',
    name: 'DangNhap',
    component: () => import('../views/others/DangNhap.vue')
  },
  {
    path: '/quan_ly_nguoi_dung',
    name: 'QuanLyNguoiDung',
    component: () => import('../views/admin/quan_ly_nguoi_dung/QuanLyNguoiDung.vue')
  },
  {
    path: '/them_nguoi_dung',
    name: 'ThemNguoiDung',
    component: () => import('../views/admin/quan_ly_nguoi_dung/ThemNguoiDung.vue')
  },
  {
    path: '/cap_nhat_nguoi_dung/:email',
    name: 'CapNhatNguoiDung',
    component: () => import('../views/admin/quan_ly_nguoi_dung/CapNhatNguoiDung.vue')
  },
  {
    path: '/quan_ly_doanh_nghiep',
    name: 'QuanLyDoanhNghiep',
    component: () => import('../views/admin/quan_ly_doanh_nghiep/QuanLyDoanhNghiep.vue')
  },
  {
    path: '/them_doanh_nghiep',
    name: 'ThemDoanhNghiep',
    component: () => import('../views/admin/quan_ly_doanh_nghiep/ThemDoanhNghiep.vue')
  },
  {
    path: '/cap_nhat_doanh_nghiep/:ma_don_vi',
    name: 'CapNhatDoanhNghiep',
    component: () => import('../views/admin/quan_ly_doanh_nghiep/CapNhatDoanhNghiep.vue')
  },
  {
    path: '/quan_ly_danh_muc_don_vi',
    name: 'QuanLyDanhMucDonVi',
    component: () => import('../views/admin/quan_ly_danh_muc/QuanLyDanhMucDonVi.vue')
  },
  {
    path: '/quan_ly_danh_muc_hang_hoa',
    name: 'QuanLyDanhMucHangHoa',
    component: () => import('../views/admin/quan_ly_danh_muc/QuanLyDanhMucHangHoa.vue')
  },
  {
    path: '/quan_ly_danh_muc_vai_tro',
    name: 'QuanLyDanhMucVaiTro',
    component: () => import('../views/admin/quan_ly_danh_muc/QuanLyDanhMucVaiTro.vue')
  },
  {
    path: '/quan_ly_to_khai',
    name: 'QuanLyToKhai',
    component: () => import('../views/admin/quan_ly_cua_khau/QuanLyToKhai.vue')
  },
  {
    path: '/quan_ly_van_don',
    name: 'QuanLyVanDon',
    component: () => import('../views/admin/quan_ly_cua_khau/QuanLyVanDon.vue')
  },
  {
    path: '/quan_ly_phuong_tien',
    name: 'QuanLyPhuongTien',
    component: () => import('../views/admin/quan_ly_cua_khau/QuanLyPhuongTien.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;