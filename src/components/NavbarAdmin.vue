<template>
  <nav class="container-fluid d-flex justify-content-between align-items-center px-5 py-2">
    <input type="checkbox" id="check">
    <label for="check" class="checkbtn_sign_out">
      <i class="bi bi-list"></i>
    </label>
    <label class="logo m-0">Admin</label>
    <ul class="navbar_container">
      <li class="navbar_item"><router-link to="/quan_ly_nguoi_dung">Quản lý người dùng</router-link></li>
      <li class="navbar_item"><router-link to="/quan_ly_doanh_nghiep">Quản lý doanh nghiệp</router-link></li>
      <li class="navbar_item dropdown">
        <a class="dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          Quản lý danh mục
        </a>
        <div class="sub-menu" aria-labelledby="navbarDropdown" style="width: 100%;">
          <router-link class="dropdown-item" to="/quan_ly_danh_muc_don_vi">Danh mục đơn vị</router-link>
          <router-link class="dropdown-item" to="/quan_ly_danh_muc_hang_hoa">Danh mục hàng hóa</router-link>
          <router-link class="dropdown-item" to="/quan_ly_danh_muc_vai_tro">Danh mục vai trò</router-link> 
          <router-link class="dropdown-item" to="/quan_ly_trang_thai_to_khai">Trạng thái tờ khai</router-link> 
        </div>
      </li>
      <li class="navbar_item dropdown">
        <a class="dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          Quản lý lịch sử
        </a>
        <div class="sub-menu" aria-labelledby="navbarDropdown" style="width: 100%;">
          <router-link class="dropdown-item" to="/lich_su_tai_khoan">Lịch sử tài khoản</router-link>
          <router-link class="dropdown-item" to="/lich_su_to_khai">Lịch sử tờ khai</router-link> 
        </div>
      </li>
    </ul>
    <div id="right_side" class="d-flex align-items-center dropdown">
      <a class="nav-link show" aria-expanded="true" @click="useIconClicked">
        <div class="d-flex d-flex align-items-center">
          <i class="bi bi-person-fill icon_nav_admin"></i>
        </div>
      </a>
      <div class="dropdown-menu dropdown-menu-end" v-show="isDropdownVisible">
        <div class="card border-0 mb-0 px-2">
          <div class="card-header py-2">
            <span class="dropdown_text" style="color: black;">{{ userName }}</span><br>
            <span class="dropdown_text" style="color: gray;">{{ tenVaiTro }}</span>
          </div>
          <div class="card-body px-0 py-2">
            <ul class="list-group list-group-flush">
              <li class="card_item list-group-item border-0 py-2">
                <router-link to="" class="nav-link">
                  <i class="bi bi-file-lock"></i>
                  Đổi mật khẩu
                </router-link>
              </li>
            </ul>
          </div>
          <div class="card-footer">
            <li class="card_logout list-group-item border-0 py-2">
              <a @click="signOutClick" class="nav-link">
                <i class="bi bi-box-arrow-in-right"></i>
                Đăng xuất
              </a>
            </li>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import router from '../routers/router';
import axios from 'axios';

export default{
  setup(){
    const isDropdownVisible = ref(false);
    const userName = ref(localStorage.getItem('savedEmail'));
    const tenVaiTro = ref(localStorage.getItem('savedTenVaiTro'));
    const route = useRoute();

    watch(route, (to, from) => {
      if (to.path === '/') {
        router.push('/');
      }
    });

    const signOutClick =  () => {
      localStorage.removeItem('savedEmail');
      localStorage.removeItem('savedMaVaiTro');
      localStorage.removeItem('savedThuocDonVi');
      localStorage.removeItem('savedTenVaiTro');
      localStorage.removeItem('token');
      addLichSuTaiKhoan();
      router.push('/');
    };

    const addLichSuTaiKhoan = async() => {
      const lichSuData = {
        email: userName.value,
        ma_hanh_dong: 2,
      };
      console.log(lichSuData);
      try {
        const response = await axios.post(`/api/lich-su-tai-khoan`, lichSuData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const useIconClicked = () => {
      isDropdownVisible.value = !isDropdownVisible.value;
    };  

    return{
      signOutClick,
      isDropdownVisible,
      useIconClicked,
      userName,
      tenVaiTro
    }
  },
}
</script>

<style scoped>
*{
  padding: 0;
  margin: 0;
  text-decoration: none;
  list-style: none;
  font-family: 'Space Grotesk', sans-serif;
}
nav{
  background: #222B40;
  height: 80px;
  width: 100%;
  position: fixed;
  z-index: 9999;
  top: 0;
}
label.logo{
  color: white;
  font-size: 35px;
  /* line-height: 80px; */
  font-weight: bold;
}
nav .navbar_container{
  float: right;
  margin-right: 20px;
}
nav .navbar_container .navbar_item{
  display: inline-block;
  line-height: 79px;
  margin: 0px;
  padding: 0px;
}
nav .navbar_container .navbar_item a{
  color: white;
  font-size: 20px;
  padding: 7px 13px;
  text-transform: uppercase;
}
nav .navbar_container .navbar_item .dropdown-item{
  color: white;
  font-size: 20px;
  padding: 0px 13px;
  min-width: 100%;
  text-transform: uppercase;
}
nav .navbar_container .navbar_item a.active,nav .navbar_container .navbar_item a:hover{
  background: #1b9bff;
  transition: .5s;
  /* border-radius: 10px; */
}
.checkbtn_sign_out{
  font-size: 50px;
  color: white;
  float: right;
  line-height: 80px;
  margin-right: 40px;
  cursor: pointer;
  display: none;
}
.navbar_item.dropdown:hover .sub-menu {
  display: block;
}
.sub-menu {
  display: none;
  position: absolute;
  background-color: #222B40;
  min-width: 200px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}
.dropdown-item {
  color: black;
  padding: 12px 12px;
  text-decoration: none;
  display: block;
}
.dropdown-item:hover {
  background-color: #f1f1f1;
}
#check{
  display: none;
}
.dropdown_text{
  font-size: 14px;
  font-weight: bold;
}
#right_side{
  position: relative;
  margin-right: 20px;
  scrollbar-width: thin;
  box-sizing: border-box;
}
.dropdown-menu{
  width: 240px;
  border-radius: 0.375rem;
  top: 60px;
  right: 0; 
  display: block;
  position: absolute; 
}
.icon_nav_admin{
  font-size: 30px;
  color: white;
  cursor: pointer;
}
.card_item{
  color: black;
  font-size: 20px;
  transition: 0.1s;
}
.card_item a{
  color: black;
  font-size: 0.875rem;;
}
.card_item a:hover{
  color: #1b9bff;
}
.card_logout a{
  color: red;
}
.card_logout a:hover{
  color: #db3700;
  cursor: pointer;
}
.card-footer, .card-header{
  background-color: transparent;
}
@media (max-width: 1157px){
  .checkbtn_sign_out{
    display: block;
  }
  .navbar_container{
    position: fixed;
    width: 100%;
    height: 100vh;
    background: #2c3e50;
    top: 80px;
    left: -100%;
    text-align: center;
    transition: all .5s;
  }
  nav .navbar_container .navbar_item{
    display: block;
    margin: 50px 0;
    line-height: 30px;
  }
  nav .navbar_container .navbar_item a{
    padding: 15px 0px;
  }
  nav .navbar_container .navbar_item a:hover, nav .navbar_container .navbar_itema.active{
    background: none;
    color: #0082e6;
  }
  #check:checked ~ ul{
    left: 0;
  }
  #right_side{
    float: right;
    z-index: 1;
  } 
  .sub-menu {
    display: none;
    position: absolute;
    background-color: #222B40;
    min-width: 200px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    left: 50%; 
    transform: translateX(-50%); 
    top: 100%; 
  }
  .navbar_item.dropdown {
    position: relative; /* Đảm bảo vị trí tương đối cho dropdown item */
  }
  nav .navbar_container .navbar_item .dropdown-item{
  color: white;
  font-size: 20px;
  padding: 10px 13px;
  min-width: 100%;
  text-transform: uppercase;
}
}
</style>
