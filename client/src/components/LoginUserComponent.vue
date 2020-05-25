<template>
  <b-container>
    <div class="login-form">
      <b-alert show variant='danger' v-if='error'>{{ error }}</b-alert>
      <b-alert show variant='success' v-if='success'>{{ success }}</b-alert>
        <form @submit="onSubmit" >
            <h1 class="text-center"> Login </h1>
            <div class="form-group">
            <input type="email" class="form-control" id="email" v-model="formData.email" placeholder="Email" required="required">
            </div>
            <div class="form-group">
                <input type="password" class="form-control" id="password" v-model="formData.password" placeholder="Password" required="required">
            </div>
            <div class="form-group">
                <a href="/register" id="signup">Create an account</a>
                <button type="submit"
                class="btn btn-primary"
                :disabled="formData.email.length<5 ||
                formData.password.length<6"
                >Login</button>
            </div>
        </form>
    </div>
  </b-container>
</template>

<script>
import UserService from '../service/userService'
import router from '../router/index'

export default {
  name: 'LoginUserComponent',
  data () {
    return {
      formData: {
        email: '',
        password: ''
      },
      success: '',
      error: ''
    }
  },
  methods: {
    async onSubmit (evt) {
      evt.preventDefault()
      try {
        const result = await UserService.loginUser(this.formData)
        if (result.success) {
          router.push({ path: '/' })
          setTimeout(() => {
            localStorage.clear()
            sessionStorage.clear()
          }, 1000 * 60 * 60)
        }
        if (result.error) {
          this.error = result.error
          this.success = ''
        }
      } catch (err) {
        this.error = err
      }
    }
  }
}
</script>

<style>
.login-form {
      width: 340px;
      margin: 140px auto;
  }

  .login-form form {
      margin-bottom: 15px;
      background: #f7f7f7;
      box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
      padding: 30px;
  }

  .login-form h1 {
      margin: 0 0 15px;
  }

  .form-control,
  .btn {
      min-height: 38px;
      border-radius: 5px;
      ;
  }

  .btn {
      font-size: 15px;
      font-weight: bold;
  }

  #signup {
      margin-top: 5px;
      float: right;
  }
</style>
