<template>
  <div class="body">
    <h1> Access Denied... Please login to continue...</h1>
    <p> Page will automatically redirects to login page in {{ timerCount }}s </p>
  </div>
</template>

<script>
export default {
  name: 'AccessDeniedComponent',
  data () {
    return {
      timerCount: 5
    }
  },
  watch: {
    timerCount: {
      handler (value) {
        if (value > 0) {
          setTimeout(() => {
            this.timerCount--
          }, 1000)
        }
        if (this.timerCount === 0) {
          this.$router.push('/login')
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
  .body{
    background: floralwhite;
    color: red;
    max-width: 800px;
    text-align: center;
    margin: 0px;
  }
</style>
