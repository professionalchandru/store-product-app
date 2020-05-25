<template>
  <div>
    <Header />
    <b-container>
      <h1>ADD PRODUCT</h1>
      <div>
        <b-alert show variant='danger' v-if='error'>{{ error }}</b-alert>
        <b-alert show variant='success' v-if='success'>{{ success }}</b-alert>
        <b-form @submit="onSubmit" @reset="onReset">
          <b-form-group id="input-group-1">
            <b-form-input
              id="name"
              v-model="formData.name"
              type="text"
              required
              placeholder="Enter Product Name"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2">
            <b-form-input
              id="category"
              v-model="formData.category"
              required
              placeholder="Enter Category"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-3">
            <b-form-input
              id="price"
              type="number"
              v-model="formData.price"
              required
              placeholder="Enter Price"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-4">
            <b-form-input
              id="quantity"
              type="number"
              v-model="formData.quantity"
              required
              placeholder="Enter Quantity"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-5">
            <b-form-textarea
              id="description"
              placeholder = Description
              v-model="formData.description"
            >
            </b-form-textarea>
          </b-form-group>

          <b-button :disabled="formData.name.length<3 ||
          formData.category.length<3 ||
          formData.price<1 ||
          formData.quantity<1"
          type="submit"
          variant="primary">
          Submit
          </b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
      </div>
    </b-container>
  </div>
</template>

<script>
import ProductService from '../service/productService'
import Header from '../components/layouts/Header'

export default {
  name: 'AddProductComponent',
  components: {
    Header
  },
  data () {
    return {
      formData: {
        name: '',
        category: '',
        price: '',
        quantity: '',
        description: ''
      },
      error: '',
      success: ''
    }
  },
  methods: {
    async onSubmit (evt) {
      evt.preventDefault()
      try {
        const result = await ProductService.insertProduct(this.formData)
        if (result.success) {
          this.success = result.success
          this.error = ''

          this.formData.name = ''
          this.formData.category = ''
          this.formData.price = ''
          this.formData.quantity = ''
          this.formData.description = ''
        }
        if (result.error) {
          this.error = result.error
          this.success = ''
        }
        if (result.session) {
          this.$router.push({ path: '/session' })
        }
      } catch (err) {
        this.error = err.message
      }
    },
    onReset (evt) {
      evt.preventDefault()
      // Reset our form values
      this.formData.name = ''
      this.formData.category = ''
      this.formData.price = ''
      this.formData.quantity = ''
      this.formData.description = ''

      this.error = ''
      this.success = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  },
  created () {
    // unauthourised user
    localStorage.getItem('tokenvariable')
    if (sessionStorage.getItem('token') === null) {
      this.$emit('session', 'Oops...! Session Expired')
      this.$router.push({ path: '/login' })
    }
  }
}
</script>

<style scoped>
  .btn {
  margin: 5px;
  border-radius: 25px;
}
</style>
