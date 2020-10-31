<template>
  <div class="login_container">
   <div>
     <el-form  ref="ruleForm"  :model="ruleForm" :rules="rules" label-width="80px">
       <el-row>
         <el-col :span=24>
           <el-form-item label="用户名" prop="username">
              <el-input prefix-icon="el-icon-user-solid" v-model="ruleForm.username"></el-input>
           </el-form-item>
         </el-col>
       </el-row>
         <el-row>
         <el-col :span=24>
           <el-form-item label="密码" prop="password">
               <el-input show-password v-model="ruleForm.password" type="password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登陆</el-button>
          <el-button type="info" native-type="reset">重置</el-button>
        </el-form-item>
      </el-form>
   </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 5,
            message: '长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post('login', this[formName])
          if (res.meta.status === 200) {
            this.$message({
              message: '登陆成功',
              type: 'success'
            })
            window.sessionStorage.setItem('token', res.data.token)
            this.$router.push('/home')
          } else {
            this.$message('登陆失败')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container{
    background:grey;
    height:100%;
    display:flex;
    align-items: center;
    justify-content: center;
    & > div{
      width:350px;
      height:200px;
      background:white;
      padding:30px;
    }
  }
</style>
