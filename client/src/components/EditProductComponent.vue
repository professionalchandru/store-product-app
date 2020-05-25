<template>
  <b-container>
    <Header />
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

        <b-button :disabled="formData.name.length<1 ||
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
</template>

<script>
import ProductService from '../service/productService'
import router from '../router/index'
import Header from '../components/layouts/Header'

export default {
  name: 'EditProductComponent',
  components: {
    Header
  },
  data () {
    return {
      id: '',
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
  async created () {
    this.id = this.$route.params.id
    const res = await ProductService.getProductById(this.id)

    if (res.session) {
      this.$router.push({ path: '/session' })
    }

    this.formData.name = res.name
    this.formData.category = res.category
    this.formData.price = res.price
    this.formData.quantity = res.quantity
    this.formData.description = res.description
  },
  methods: {
    async onSubmit (evt) {
      evt.preventDefault()
      try {
        const result = await ProductService.editProduct(this.id, this.formData)
        console.log(result)
        if (result.success) {
          this.success = result.success
          this.error = ''
          this.formData.name = ''
          this.formData.category = ''
          this.formData.price = 0
          this.formData.quantity = 0
          this.formData.description = ''
          setTimeout(function () {
            router.push({ path: '/' })
          }, 2000)
        }
        if (result.error) {
          this.error = result.error
          this.success = ''
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
      this.formData.price = 0
      this.formData.quantity = 0
      this.formData.description = ''

      this.error = ''
      this.success = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  }
}
</script>

<style scoped>
  .btn {
  margin: 5px;
}
</style>
