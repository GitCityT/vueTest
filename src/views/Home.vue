<template>
  <el-container class="home">
    <el-header>
      <span>Header</span>
      <el-button @click="userExit">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isToggleMenu ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleMenu">|||</div>
        <el-menu unique-opened :collapse="isToggleMenu" :collapse-transition="false" :router="true" :default-active="$route.path">
            <el-submenu :index="item.path" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item.authName}}</span>
              </template>

              <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" >
                <i class="el-icon-menu"></i>{{subItem.authName}}
              </el-menu-item>
            </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>

export default {
  data () {
    return {
      menuList: [],
      isToggleMenu: false
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    userExit () {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    toggleMenu () {
      this.isToggleMenu = !this.isToggleMenu
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status === 200) {
        this.menuList = res.data
        console.log(this)
      }
    }
  }
}
</script>

<style lang="less">
  .el-header, .el-footer {
    display:flex;
    align-items: center;
    justify-content: space-between;
  }

  .el-aside {
    width:200px;
    .toggle-button {
      color: grey;
      text-align: center;
      letter-spacing: 2px;
      cursor:pointer;
    }
  }

  .el-container.home {
    height: 100vh;
  }

</style>
