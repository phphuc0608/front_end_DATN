<template>
  <div class="background">
    <form class="my-form">
      <div class="login-welcome-row">
          <h1>Welcome &#x1F44F;</h1>
          <p>Nhập thông tin đăng nhập!</p>
      </div>
      <div class="input__wrapper">
        <input type="email" id="email" name="email" class="input__field" placeholder="Your Email" required>
        <label for="email" class="input__label">Email:</label>
        <svg class="input__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
          stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
          <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28"></path>
        </svg>
      </div>
      <div class="input__wrapper">
        <input id="password" type="password" class="input__field" placeholder="Your Password" required>
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
      <div class="my-form__actions">
        <div class="my-form__row">
            <a href="#" title="Create Account">
                Quên mật khẩu?
            </a>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'DangNhap',
  mounted(){
      document.title = "Đăng nhập";
  }
}
</script>

<style>
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
    font-size: 1.2rem;
}
.input__label,
.input__field:focus~.input__label {
    position: absolute;
    top: -0.8rem;
    display: block;
    font-size: 1.2rem;
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
