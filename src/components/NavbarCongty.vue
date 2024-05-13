<template>
  <nav class="container-fluid d-flex justify-content-between align-items-center px-5 py-2">
    <label for="check" class="checkbtn_sign_out">
      <i class="bi bi-list"></i>
    </label>
    <label class="logo m-0">Company Side</label>
    <ul class="navbar_container">
      <li class="navbar_item"><router-link to="/quan_ly_nguoi_dung_cong_ty">Quản lý người dùng</router-link></li>
      <li class="navbar_item"><router-link to="/quan_ly_van_don">Quản lý vận đơn</router-link></li>
      <li class="navbar_item"><router-link to="/quan_ly_to_khai">Quản lý tờ khai</router-link></li>
      <li class="navbar_item"><router-link to="">Thống kê</router-link></li>
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
            <span class="dropdown_text" style="color: black;">User1</span><br>
            <span class="dropdown_text" style="color: gray;">Công ty A</span>
          </div>
          <div class="card-body px-0 py-2">
            <ul class="list-group list-group-flush">
              <li class="card_item list-group-item border-0 py-2">
                <router-link to="" class="nav-link">
                  <i class="bi bi-file-earmark-person"></i>
                  Thông tin cá nhân
                </router-link>
              </li>
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
import { ref } from 'vue';
import axios from 'axios';
import router from '../routers/router';
export default{
  setup(){
    const isDropdownVisible = ref(false);
    const signOutClick = () => {
      localStorage.removeItem('token');
      router.push('/');
    };

    const useIconClicked = () => {
      isDropdownVisible.value = !isDropdownVisible.value;
    };  

    return{
      signOutClick,
      isDropdownVisible,
      useIconClicked,
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
  font-size: 30px;
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