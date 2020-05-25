import axios from 'axios'

const url = 'api/users/'

class UserService {
  // Create New User
  static async registerUser (data) {
    try {
      const res = await axios.post(`${url}register`, {
        name: data.name,
        email: data.email,
        password: data.password
      })
      const result = res.data
      console.log(res)
      return result
    } catch (err) {
      return err
    }
  }

  // Login to existing User
  static async loginUser (data) {
    try {
      const res = await axios.post(`${url}login`, {
        email: data.email,
        password: data.password
      })
      const result = res.data
      localStorage.setItem('tokenvariable', 'token')
      sessionStorage.setItem('token', res.data.token)
      return result
    } catch (err) {
      return err
    }
  }
}

export default UserService
