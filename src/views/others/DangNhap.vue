<template>
<div class="background">
  <form class="my-form" @submit.prevent="handleSubmit">
    <div class="login-welcome-row">
      <h1>Welcome &#x1F44F;</h1>
      <p>Nhập thông tin đăng nhập!</p>
    </div>
    <div class="input__wrapper">
      <input type="email" id="username" v-model="username" class="input__field" placeholder="Your Email" required>
      <label for="username" class="input__label">Email:</label>
      <svg class="input__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
        stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
        <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28"></path>
      </svg>
    </div>
    <div class="input__wrapper">
      <input id="password" type="password" v-model="password" class="input__field" placeholder="Your Password" required>
      <label for="password" class="input__label">
        Password:
      </label>
      <svg class="input__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
          stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z"></path>
          <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"></path>
          <path d="M8 11v-4a4 4 0 1 1 8 0v4"></path>
      </svg>
    </div>
    <button type="submit" class="my-form__button">
      Đăng nhập
    </button>
  </form>
</div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import router from '../../routers/router';
import { useUserStore } from '../../stores/store';
import Swal from 'sweetalert2';

export default {
  setup() {
    const userStore = useUserStore();
    const username = ref('');
    const password = ref('');
    //Take savedEmail from localStorage and set it to userStore
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      userStore.setEmail(savedEmail); // Set email value to userStore
    }
    //Take savedMaVaiTro from localStorage and set it to userStore
    const savedMaVaiTro = localStorage.getItem('savedMaVaiTro');
    if (savedMaVaiTro) {
      userStore.setMaVaiTro(savedMaVaiTro); // Set ma_vai_tro value to userStore
    }
    //Take savedThuocDonVi from localStorage and set it to userStore
    const savedThuocDonVi = localStorage.getItem('savedThuocDonVi');
    if (savedThuocDonVi) {
      userStore.setThuocDonVi(savedThuocDonVi); // Set thuoc_don_vi value to userStore
    }
    //Take savedTenVaiTro from localStorage and set it to userStore
    const savedTenVaiTro = localStorage.getItem('savedTenVaiTro');
    if (savedTenVaiTro) {
      userStore.setTenVaiTro(savedTenVaiTro); // Set ten_vai_tro value to userStore
    }
    //Get user information by email
    const getNguoiDungByEmail = async() => {
      const emailParam = userStore.email;
      console.log(emailParam);  
      try {
        const response = await axios.get(`/api/nguoi-dung/${emailParam}`);
        console.log(response.data);
        // Save ma_vai_tro, thuoc_don_vi to localStorage and userStore
        const ma_vai_tro = response.data.ma_vai_tro;
        const thuoc_don_vi = response.data.thuoc_don_vi;
        localStorage.setItem('savedMaVaiTro', ma_vai_tro);
        userStore.setMaVaiTro(ma_vai_tro);
        localStorage.setItem('savedThuocDonVi', thuoc_don_vi);
        userStore.setThuocDonVi(thuoc_don_vi);
      } catch (error) {
        console.log(error);
      }
    }
    //Handle submit form
    const handleSubmit = async() => {
      //Create URLSearchParams object containing username and password (key-value)
      const userData = new URLSearchParams();
      //Append username and password to userData
      userData.append('username', username.value);
      userData.append('password', password.value);
      // Save email to localStorage
      localStorage.setItem('savedEmail', username.value);
      //Update email in userStore
      userStore.setEmail(username.value);
      try {
        const response = await axios.post('/api/login', userData); 
        // Save token to localStorage
        localStorage.setItem('token', response.data.access_token);
        // Get user information and update savedMaVaiTro
        const userInfo = await axios.get(`/api/nguoi-dung/${username.value}`);
        // Save ma_vai_tro to localStorage and userStore
        const ma_vai_tro = userInfo.data.ma_vai_tro;
        localStorage.setItem('savedMaVaiTro', ma_vai_tro);
        userStore.setMaVaiTro(ma_vai_tro);
        // Save ten_vai_tro to localStorage and userStore
        const ten_vai_tro = userInfo.data.vai_tro.ten_vai_tro;
        localStorage.setItem('savedTenVaiTro', ten_vai_tro);
        userStore.setTenVaiTro(ten_vai_tro);
        // Save thuoc_don_vi to localStorage and userStore
        const thuoc_don_vi = userInfo.data.thuoc_don_vi;  
        localStorage.setItem('savedThuocDonVi', thuoc_don_vi);
        userStore.setThuocDonVi(thuoc_don_vi);
        // Check ma_vai_tro and redirect to corresponding page
        if (Number(ma_vai_tro) === 1) {
          router.push('/quan_ly_nguoi_dung');
        } else if (Number(ma_vai_tro) === 3 || Number(ma_vai_tro) === 5) {
          router.push('/thong_ke_cong_ty');
        } else if (Number(ma_vai_tro) === 2 || Number(ma_vai_tro) === 4) {
          router.push('/thong_ke_cua_khau');
        } 
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Thông tin đăng nhập không chính xác!',
        });
      }
    }

    onMounted(() => {
      document.title = 'Đăng nhập';

    });

    return {
      username,
      password,
      handleSubmit,
      getNguoiDungByEmail
    };
  },
}
</script>

<style scoped>
*{
  font-family:'Verdana', sans-serif;
}
.background {
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('@/assets/backgrounds/signin_bg.png');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-color: #222B40;
  background-blend-mode: overlay;
  height: 100vh;
}
.my-form {
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 1rem;
  background-color: var(--white);
  width: 100%;
  max-width: 32rem;
  padding: 3rem 2rem;
  border-radius: 2rem;
}
.login-welcome-row {
    margin-bottom: 1rem;
    text-align: center;
}
.welcome-message {
    max-width: 24rem;
}
.logo {
    height: 3rem;
    margin: 0 auto;
}
.my-form {
    display: flex;
    flex-direction: column;
    justify-content: start;
    position: relative;
    gap: 1rem;
    background-color: var(--white);
    width: 100%;
    max-width: 32rem;
    padding: 3rem 2rem;
    border-radius: 2rem;
    height: fit-content;
}
.my-form__button {
    background-color: var(--primary);
    color: white;
    white-space: nowrap;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
    line-height: 3.125rem;
    outline: none;
    font-size: 1.125rem;
    letter-spacing: .025rem;
    text-decoration: none;
    cursor: pointer;
    font-weight: 800;
    min-height: 3.125rem;
    width: 100%;
    border-radius: 10rem;
    transition: all .3s ease;
    -webkit-transition: all .3s ease;
}
.my-form__button:hover {
    background-color: var(--primary-dark);
}
/*? input wrapper */
.input__wrapper {
    position: relative;
    padding: 0.9375rem 0 0;
    margin-bottom: 0.5rem;
}
.input__field {
    font-size: 1.5rem;
    color: var(--text);
    padding: 0.375rem 0;
    padding-right: 2rem;
    padding-bottom: 0.5rem;
    line-height: 2rem;
    height: 2rem;
    outline: 0;
    border: 0;
    width: 100%;
    vertical-align: middle;
    padding-bottom: 0.7rem;
    border-bottom: 3px solid var(--secondary);
    background: transparent;
    transition: border-color 0.2s;
}
.input__field::placeholder {
    color: transparent;
}
.input__label {
    user-select: none;
}
.input__field:placeholder-shown~.input__label {
    cursor: text;
    color: var(--text);
    top: 0.8rem;
    font-size: 1.3rem;
}
.input__label,
.input__field:focus~.input__label {
    position: absolute;
    top: -0.8rem;
    display: block;
    font-size: 1.3rem;
    color: var(--text);
    transition: 0.3s;
}
.input__field:focus~.input__label {
    color: var(--primary);
}
.input__field:focus {
    border-bottom: 3px solid var(--primary);
}
.input__field:focus~svg {
    stroke: var(--primary);
}
.input__icon {
    position: absolute;
    right: -0.875rem;
    bottom: -0.6875rem;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0.125rem;
    transform: translate(-50%, -50%);
    transform-origin: center;
    cursor: pointer;
}
.input__icon:hover {
    border-radius: 50%;
}
/* my form actions */
.my-form__actions {
    display: flex;
    flex-direction: column;
    align-self: center;
    color: var(--secondary);
    gap: 1rem;
    margin-top: 0.5rem;
}
.my-form__actions a {
    color: var(--secondary);
    font-weight: 600;
    text-decoration: none;
}
.my-form__actions a:hover {
    text-decoration: underline;
}
.my-form__row {
    display: flex;
    gap: 0.5rem;
    justify-content: space-between;
}
</style>
