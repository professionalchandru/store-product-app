<template>
  <div>
    <Header />
    <div class="container">
      <h1>Products Available</h1>
      <br>
      <b-alert show variant='danger' v-if='error'>{{ error }}</b-alert>
      <b-alert show variant='success' v-if='success'>{{ success }}</b-alert>
      <div class="row">
        <div class="col-md-4 bcard"
        v-for='(product, index) in products'
        :item='product'
        :index='index'
        :key='product._id'
        >
        <!-- <div class="row"> -->
          <div class="card" style="width: 18rem;">
            <div class="card-header">
              <button style="float: left; border: none; background: white;  margin: 2px;"
              @click="likeProduct(product._id, product.likes, product.name)"
              >
              <b-icon-heart-fill
              style='color: red;'
              class='like'
              animation="throb"
              ></b-icon-heart-fill>
            </button>
            <span style="float: left;">{{ product.likes }}</span>
              <h3><strong>{{product.name}}</strong> </h3>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item"><strong><span style="font-size: 18px; font-weight: 800;">Category: {{product.category}}</span></strong></li>
              <li class="list-group-item">{{product.description}}</li>
              <li class="list-group-item"><strong><span style="font-size: 16px;">Price: {{product.price | currency}}</span></strong></li>
              <li class="list-group-item"><strong><span style="font-size: 15px;">Quantity Remains: {{product.quantity}}</span></strong></li>
              <li class="list-group-item"><strong><span style="font-size: 15px;">Likedby: {{product.likedBy.toString()}}</span></strong></li>
            </ul>
            <div>
              <button class='btn btn-warning' id="editbtn"
              @click="editProduct(product._id)"
              style="float: left;  margin: 4px; margin-left:50px;"
              >
                <b-icon-pencil-square class='icons'></b-icon-pencil-square> Edit
              </button>
              <button
              class='btn btn-danger'
              @click="deleteProduct(product._id)"
              style="float: left;  margin: 4px; margin-left:10px;"
              >
                <b-icon-trash class='icons'></b-icon-trash> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    <!-- </div> -->
    </div>
  </div>
</template>

<script>
import ProductService from '../service/productService'
import router from '../router/index'
import Header from '../components/layouts/Header'

export default {
  name: 'HomeComponent',
  components: {
    Header
  },
  data () {
    return {
      products: [],
      error: '',
      success: '',
      search: ''
    }
  },
  methods: {
    async deleteProduct (id) {
      if (window.confirm('Are you sure to delete')) {
        const result = await ProductService.deleteProduct(id)
        if (result.success) {
          this.success = result.success
          this.error = ''
          this.products = await ProductService.getProducts()
        }
        if (result.error) {
          this.error = result.error
          this.success = ''
        }
      }
    },
    async editProduct (id) {
      router.push({ path: `/editproduct/${id}` })
    },
    async likeProduct (id, likes, name) {
      try {
        const result = await ProductService.likeProduct(id, likes)
        if (result.success) {
          window.alert('Suceesfully liked for ' + name)
          this.products = await ProductService.getProducts()
        }
        if (result.error) {
          window.alert('you are already liked for ' + name)
        }
        if (result.session) {
          this.$router.push('/session')
        }
      } catch (err) {
        this.error = err.message
      }
    }
  },
  async created () {
    // unauthourised user
    localStorage.getItem('tokenvariable')
    if (sessionStorage.getItem('token') === null) {
      this.$emit('session', 'Oops...! Session Expired')
      router.push({ path: '/login' })
    }
    try {
      const result = await ProductService.getProducts()
      if (result.session) {
        this.$router.push('/session')
      }
      this.products = result
    } catch (err) {
      this.error = err.message
    }
  }
}
</script>

<style scoped>
div.container {
  max-width: 1000px;
  margin: 0 auto;
}

div.bcard {
  margin-bottom: 20px;
}

.icons {
  margin-right: 5px;
  margin-left: 5px;
}

p.error {
  border: 1px solid #ff5b5f;
  background: #ffc5c1;
  padding: 10px;
  margin-bottom: 15px;
}

.products {
  background: gainsboro;
  color: black;
}

.currency{
  font-weight: 600;
}

.created-at {
  color: blue;
  font-size: 13px;
}

.btn {
  margin: 5px;
  border-radius: 25px;
  color: black;
}

p.created-date {
  text-align: right;
  margin: 1px;
  color: darkgrey;
}
.like {
  float: right;
}

.card-header{
  /* color: rgb(33, 102, 143); */
  color: blue;
}

.logout{
  background: blueviolet;
  color: white;
  float: right;
  margin-right: 15px;
  border-radius: 8px
}
</style>
