<template>
  <div class="users">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入用户名" v-model="queryInfo.query" clearable>
            <el-button @click="getUserListByName" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
        <el-button type="primary" @click="userEditWithInfo">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table
          :data="userList.users"
          stripe>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="username" label="用户名称"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="mobile" label="电话"></el-table-column>
            <el-table-column prop="role_name" label="角色"></el-table-column>
            <el-table-column label="状态">
              <template v-slot="scope">
                <el-switch
                  v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column  label="操作">
              <template v-slot="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="userEditWithInfo(scope.row)" circle></el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="removeUserById(scope.row.id)"></el-button>
                <el-tooltip  content="Top center" placement="top" >
                  <el-button size="mini" type="warning" icon="el-icon-setting" circle></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes = [1,5,10]
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userList.total">
      </el-pagination>

      <el-dialog
        title="提示"
        :visible.sync="dialogVisible">
        <el-form  ref="userEditForm" label-width="120px" :model="userData" :rules="userRule">
          <el-form-item v-if="!userData.id" label="用户名称" prop="username">
            <el-input v-model="userData.username" ></el-input>
          </el-form-item>
          <el-form-item v-if="!userData.id" label="用户密码"  :prop=" userData.id ? 'editPassword' : 'password'">
            <el-input v-model="userData.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userData.email" ></el-input>
          </el-form-item>
          <el-form-item label="电话"  prop="mobile">
            <el-input v-model="userData.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelUserEdit('userEditForm')">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    var checkMobile = (rule, value, cb) => {
      const reg = /[\d]{11}/
      if (reg.test(value)) {
        cb()
      }
      cb(new Error('手机格式不合法'))
    }
    return {
      userList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      dialogVisible: false,
      userData: {},
      userRule: {
        username: [{ required: true, message: '不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '不能为空', trigger: 'blur' }],
        email: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    getUserListByName () {
      this.queryInfo.pagenum = 1
      this.getUserList()
    },
    cancelUserEdit (formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields()
    },
    userEditWithInfo (userInfo) {
      this.dialogVisible = true
      // 表单渲染完后赋值，才能resetFields重置为空
      this.$nextTick(() => {
        this.userData = JSON.parse(JSON.stringify(userInfo)) || {}
      })
    },
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status === 200) {
        this.userList = res.data
      }
    },
    async userStateChange (userInfo) {
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        this.$message.error('修改用户状态失败')
      } else {
        this.$message({
          message: '状态改变成功',
          type: 'success'
        })
      }
    },
    async editUser () {
      if (!this.userData.id) {
        const { data: res } = await this.$http.post('users', this.userData)
        if (res.meta.status === 201) {
          this.dialogVisible = false
          this.getUserList()
          this.$message({
            message: '用户添加成功',
            type: 'success'
          })
        }
      } else {
        const { data: res } = await this.$http.put('users/' + this.userData.id, this.userData)
        if (res.meta.status === 200) {
          this.dialogVisible = false
          this.$message({
            message: '用户编辑成功',
            type: 'success'
          })
        }
      }
    },
    async removeUserById (id) {
      const msg = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)

      console.log(msg)
      if (msg === 'confirm') {
        const { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status === 200) {
          this.getUserList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      } else {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    }
  }
}
</script>
