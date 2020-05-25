import axios from 'axios'

const url = 'api/products/'

class ProductService {
  static async getProducts () {
    try {
      const res = await axios.get(url, { headers: { token: sessionStorage.getItem('token') } })
      const data = res.data
      if (res.data.session) {
        return res
      }
      return data.map(product => ({
        ...product,
        created_dt: new Date(product.created_dt)
      }))
    } catch (err) {
      return err
    }
  }

  // Create Prodcut
  static async insertProduct (data) {
    try {
      const res = await axios.post(`${url}insert`, {
        name: data.name,
        category: data.category,
        price: data.price,
        quantity: data.quantity,
        description: data.description
      }, { headers: { token: sessionStorage.getItem('token') } })
      const result = res.data
      console.log(result)
      return result
    } catch (err) {
      return err
    }
  }

  // Get Product by Id
  static async getProductById (_id) {
    try {
      const res = await axios.get(`${url}${_id}`, { headers: { token: sessionStorage.getItem('token') } })
      const product = res.data
      return product
    } catch (err) {
      return err
    }
  }

  // Edit Product
  static async editProduct (_id, data) {
    try {
      const res = await axios.patch(`${url}/edit/${_id}`, {
        name: data.name,
        category: data.category,
        price: data.price,
        quantity: data.quantity,
        description: data.description
      }, { headers: { token: sessionStorage.getItem('token') } })
      const result = res.data
      return result
    } catch (err) {
      return err
    }
  }

  // Like Product
  static async likeProduct (_id, likes) {
    try {
      const newLike = likes + 1
      const res = await axios.patch(`${url}like/${_id}`, {
        likes: newLike
      }, { headers: { token: sessionStorage.getItem('token') } })
      const result = res.data
      return result
    } catch (err) {
      return err
    }
  }

  // Delete Product
  static async deleteProduct (_id) {
    try {
      const res = await axios.delete(`${url}${_id}`, { headers: { token: sessionStorage.getItem('token') } })
      const result = res.data
      return result
    } catch (err) {
      return err
    }
  }
}

export default ProductService
