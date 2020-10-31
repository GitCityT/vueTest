<template>
  <div class="home">
   <el-button @click="userExit">退出</el-button>
  </div>
</template>

<script>

export default {
  methods: {
    userExit () {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>
