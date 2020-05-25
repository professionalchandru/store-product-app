<template>
  <div>
    <link rel="stylesheet" href="https://bootswatch.com/4/pulse/bootstrap.min.css">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">Product App</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="/">Home</b-nav-item>
          <b-nav-item href="/AddProduct">Add Products</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <b-badge pill variant="success" class="logout">
                <b-icon-person-fill class="icons"></b-icon-person-fill>
                {{decoded.name}}
              </b-badge>
            </template>
            <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      decoded: {
        name: '',
        email: ''
      }
    }
  },
  methods: {
    logout () {
      localStorage.clear()
      sessionStorage.clear()
      this.$router.push('/login')
    }
  },
  created () {
    const token = sessionStorage.getItem('token')
    const decoded = this.$jwt.decode(token)
    this.decoded.name = decoded.name
    this.decoded.email = decoded.email
  }
}
</script>

<style scoped>
  .navbar{
    margin-bottom: 15px;
  }
  .logout{
    color: rgba(255,255,255,0.5);
    font-size: 15px;
    margin-right: 5px;
    margin-left: 5px;
  }
  .logout:hover{
    color: rgba(255,255,255,0.9);
    cursor: pointer;
  }
</style>
