import { createRouter, createWebHistory } from 'vue-router';
import Swal from 'sweetalert2';
const routes = [

  {
    path: '/',
    name: 'DangNhap',
    component: () => import('../views/others/DangNhap.vue')
  },
  {
    path: '/doi_mat_khau',
    name: 'DoiMatKhau',
    component: () => import('../views/others/DoiMatKhau.vue')
  },
  //Admin hệ thống
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
    path: '/quan_ly_trang_thai_to_khai',
    name: 'QuanLyTrangThaiToKhai',
    component: () => import('../views/admin/quan_ly_danh_muc/QuanLyTrangThaiToKhai.vue')
  },
  {
    path: '/lich_su_tai_khoan',
    name: 'LichSuTaiKhoan',
    component: () => import('../views/admin/quan_ly_lich_su/LichSuTaiKhoan.vue')
  },
  {
    path: '/lich_su_to_khai',
    name: 'LichSuToKhai',
    component: () => import('../views/admin/quan_ly_lich_su/LichSuToKhai.vue')
  },
  //Company
  {
    path: '/quan_ly_to_khai',
    name: 'QuanLyToKhai',
    component: () => import('../views/cong_ty/quan_ly_to_khai/QuanLyToKhai.vue')
  },
  {
    path: '/them_to_khai',
    name: 'ThemToKhai',
    component: () => import('../views/cong_ty/quan_ly_to_khai/ThemToKhai.vue')
  },
  {
    path: '/cap_nhat_to_khai/:ma_to_khai',
    name: 'CapNhatToKhai',
    component: () => import('../views/cong_ty/quan_ly_to_khai/CapNhatToKhai.vue')
  },
  {
    path: '/quan_ly_van_don',
    name: 'QuanLyVanDon',
    component: () => import('../views/cong_ty/quan_ly_van_don/QuanLyVanDon.vue')
  },
  {
    path: '/them_van_don',
    name: 'ThemVanDon',
    component: () => import('../views/cong_ty/quan_ly_van_don/ThemVanDon.vue')
  },
  {
    path: '/cap_nhat_van_don/:ma_van_don',
    name: 'CapNhatVanDon',
    component: () => import('../views/cong_ty/quan_ly_van_don/CapNhatVanDon.vue')
  },
  {
    path: '/quan_ly_nguoi_dung_cong_ty',
    name: 'QuanLyNguoiDungCongTy',
    component: () => import('../views/cong_ty/quan_ly_nguoi_dung/QuanLyNguoiDung.vue')
  },
  {
    path: '/cap_nhat_nguoi_dung_cong_ty/:email',
    name: 'CapNhatNguoiDungCongTy',
    component: () => import('../views/cong_ty/quan_ly_nguoi_dung/CapNhatNguoiDung.vue')
  },
  {
    path: '/thong_ke_cong_ty',
    name: 'ThongKeCongTy',
    component: () => import('../views/cong_ty/thong_ke/ThongKe.vue')
  },
  {
    path: '/chi_tiet_van_don/:ma_van_don',
    name: 'ChiTietVanDon',
    component: () => import('../views/cong_ty/quan_ly_van_don/ChiTietVanDon.vue')
  },
  //Border gate
  {
    path: '/quan_ly_nguoi_dung_cua_khau',
    name: 'QuanLyNguoiDungCuaKhau',
    component: () => import('../views/cua_khau/quan_ly_nguoi_dung/QuanLyNguoiDung.vue')
  },
  {
    path: '/cap_nhat_nguoi_dung_cua_khau/:email',
    name: 'CapNhatNguoiDungCuaKhau',
    component: () => import('../views/cua_khau/quan_ly_nguoi_dung/CapNhatNguoiDung.vue')
  },
  {
    path: '/quan_ly_xe_ra_vao',
    name: 'QuanLyXeRaVao',
    component: () => import('../views/cua_khau/QuanLyXeRaVao.vue')
  },
  {
    path: '/lich_su_phuong_tien',
    name: 'LichSuPhuongTien',
    component: () => import('../views/cua_khau/LichSuPhuongTien.vue')
  },
  {
    path: '/thong_ke_cua_khau',
    name: 'ThongKeCuaKhau',
    component: () => import('../views/cua_khau/ThongKe.vue')
  },
  {
    path: '/quan_ly_to_khai_cua_khau',
    name: 'QuanLyToKhaiCuaKhau',
    component: () => import('../views/cua_khau/QuanLyToKhai.vue')
  }
];
//Create a router instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

//Check if the user has the right to access the page
router.beforeEach((to, from, next) => {
  const savedMaVaiTro = localStorage.getItem('savedMaVaiTro');
  //List of routes that can be accessed by each role
  const adminRoutes = [
    'QuanLyNguoiDung',
    'ThemNguoiDung',
    'CapNhatNguoiDung',
    'QuanLyDoanhNghiep',
    'ThemDoanhNghiep',
    'CapNhatDoanhNghiep',
    'QuanLyDanhMucDonVi',
    'QuanLyDanhMucHangHoa',
    'QuanLyDanhMucVaiTro',
    'QuanLyTrangThaiToKhai',
    'LichSuTaiKhoan',
    'LichSuToKhai',
    'DoiMatKhau',
  ];
  const cuaKhauRoutes = [
    'QuanLyNguoiDungCuaKhau',
    'CapNhatNguoiDungCuaKhau',
    'QuanLyXeRaVao',
    'LichSuPhuongTien',
    'ThongKeCuaKhau',
    'DoiMatKhau',
    'QuanLyToKhaiCuaKhau',
    'DoiMatKhau'
  ];
  const congTyRoutes = [
    'QuanLyNguoiDungCongTy',
    'CapNhatNguoiDungCongTy',
    'QuanLyToKhai',
    'ThemToKhai',
    'CapNhatToKhai',
    'QuanLyVanDon',
    'ThemVanDon',
    'CapNhatVanDon',
    'ThongKeCongTy',
    'DoiMatKhau',
    'ChiTietVanDon'
  ];
  //Restricted routes
  const cuaKhauRestrictedRoutes = ['quan_ly_nguoi_dung_cua_khau', 'cap_nhat_nguoi_dung_cua_khau'];
  const congTyRestrictedRoutes = ['quan_ly_nguoi_dung_cong_ty', 'cap_nhat_nguoi_dung_cong_ty'];
  //Check if the user has the right to access the page
  if (to.name === 'DangNhap') {
    next();
  } else if (savedMaVaiTro === '1' && adminRoutes.includes(to.name)) {
    next();
  } else if (savedMaVaiTro === '2' && cuaKhauRoutes.includes(to.name)) {
    next();
  } else if (savedMaVaiTro === '3' && congTyRoutes.includes(to.name)) {
    next();
  } else if (savedMaVaiTro === '4' && cuaKhauRoutes.includes(to.name) && !cuaKhauRestrictedRoutes.includes(to.name)) {
    next();
  } else if (savedMaVaiTro === '5' && congTyRoutes.includes(to.name) && !congTyRestrictedRoutes.includes(to.name)) {
    next();
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Bạn không có quyền vào trang này!',
    }).then(() => {
      next(from.path);
      localStorage.removeItem('savedMaVaiTro');
      localStorage.removeItem('savedEmail');
      localStorage.removeItem('savedThuocDonVi');
      localStorage.removeItem('token');
      localStorage.removeItem('savedTenVaiTro');
      router.push('/');
    });
  }
});

export default router;