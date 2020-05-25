<template>
  <b-container>
    <div class="login-form">
        <b-alert show variant='danger' v-if='error'>{{ error }}</b-alert>
        <b-alert show variant='success' v-if='success'>{{ success }}</b-alert>
        <form @submit="onSubmit">
            <h1 class="text-center"> Register </h1>
            <div class="form-group">
                <input type="text" class="form-control" id="name" v-model="formData.name" placeholder="Name" required="required">
            </div>
            <div class="form-group">
                <input type="email" class="form-control" id="email" v-model="formData.email" placeholder="Email" required="required">
            </div>
            <div class="form-group">
                <input type="password" class="form-control" id="password" v-model="formData.password" placeholder="Password" minlength="6"
                    required="required">
            </div>
            <div class="form-group">
                <button type="submit"
                class="btn btn-primary btn-block"
                :disabled="formData.email.length<5 ||
                formData.name.length<3 ||
                formData.password.length<6"
                >Signup</button>
            </div>
            <a href="/login" id="login">Login</a>
        </form>
    </div>
  </b-container>
</template>

<script>
import UserService from '../service/userService'
import router from '../router/index'

export default {
  name: 'RegisterUserComponent',
  data () {
    return {
      formData: {
        name: '',
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
        const result = await UserService.registerUser(this.formData)
        if (result.success) {
          this.success = result.success
          this.error = ''

          this.formData.name = ''
          this.formData.email = ''
          this.formData.password = ''

          setTimeout(() => {
            router.push({ path: '/login' })
          }, 2000)
        }
        if (result.error) {
          this.error = result.error
          this.success = ''
        }
      } catch (err) {
        this.error = err.message
      }
    }
  }
}
</script>

<style>
.login-form {
      width: 340px;
      margin: 50px auto;
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
