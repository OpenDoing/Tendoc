<template>
  <div class="image">
      <el-header class="header">

      </el-header>
      <el-main class="main">
        <el-row >
          <el-col :span="8" :offset="14" class="login_wrapper">
            <el-tabs v-model="activeName">
              <el-tab-pane label="登录" name="first">
                <div>登录</div>
                <el-row class="mt_20">
                  <el-col :span="4">
                    <p class="center">账号</p>
                  </el-col>
                  <el-col :span="16" :offset="1">
                    <el-input v-model="username" placeholder="请输入账号"  class="center"></el-input>
                  </el-col>
                </el-row>

                <el-row class="mt_20">
                  <el-col :span="4" >
                    <p class="center">密码</p>
                  </el-col>
                  <el-col :span="16" :offset="1">
                    <el-input type="password" v-model="password" placeholder="请输入密码" class="center"></el-input>
                  </el-col>
                </el-row>

                <el-row class="mt_20">
                  <el-col :span="18" :offset="2">
                    <el-button type="primary" class="log_btn">登录</el-button>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="注册" name="second">注册</el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </el-main>
  </div>

</template>

<script>
export default {
  name: "login",
  data() {
    return {
      username: '',
      password: '',
      activeName: 'first'
    };
  },
}
</script>

<style scoped>
  body{
    margin: 0;
  }
  .center{
    display: flex;
    justify-content: center;
    align-items: center;
    vertical-align:middle;
  }
  .log_btn{
    width: 100%;
  }
  .mt_20{
    margin-top: 20px;
  }
  .login_wrapper{
    margin-top: 80px;
    background-color: #E9EEF3;
    opacity:0.9;
  }
  .image{
    background:url("../../assets/img/home.png") no-repeat;
    width:100%;
    min-height: 800px;
    overflow: hidden;
    background-size:cover;
    margin: 0 auto;
  }
  .header{
    /*background-color: gray;*/
  }
  .main{
    /*min-height: 800px;*/
  }

</style>
