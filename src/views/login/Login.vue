<template>
  <div class="image">
      <el-header class="header">

      </el-header>
      <el-main class="main">
        <el-row >
          <el-col :span="7" :offset="14" class="login_wrapper">
            <el-tabs
              v-model="activeName"
              :stretch=true>
              <el-tab-pane
                label="登录"
                name="first">
                <!--<div>登录</div>-->
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
                  <el-col :span="18" :offset="3">
                    <el-button type="primary" class="log_btn" @click="login">登录</el-button>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="注册" name="second">
                <!--<div>注册</div>-->
                <el-row class="mt_20">
                  <el-col :span="4">
                    <p class="center">账号</p>
                  </el-col>
                  <el-col :span="16" :offset="1">
                    <el-input v-model="rusername" placeholder="请输入账号"  class="center"></el-input>
                  </el-col>
                </el-row>

                <el-row class="mt_20">
                  <el-col :span="4" >
                    <p class="center">密码</p>
                  </el-col>
                  <el-col :span="16" :offset="1">
                    <el-input type="password" v-model="rpassword" placeholder="请输入密码" class="center"></el-input>
                  </el-col>
                </el-row>

                <el-row class="mt_20">
                  <el-col :span="18" :offset="3">
                    <el-button type="primary" class="log_btn" @click="register">注册</el-button>
                  </el-col>
                </el-row>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </el-main>
  </div>

</template>

<script>
import store from '@/store/store.js'
import {config} from '@/utils/global.js'
import axios from 'axios'
export default {
  name: "login",
  data() {
    return {
      username: '',
      password: '',
      rusername: '',
      rpassword: '',
      activeName: 'first',
      sharedState: store.state
    }
  },
  methods: {
    login: function () {
      // console.log(this.sharedState)
      let url = config.base_url + '/login'
      axios
        .post(url, {
          username: this.username,
          password: this.password
        })
        .then(response => {
          let data = response.data
          if (data.errno === 0) {
            let exp = new Date()
            exp.setTime(exp.getTime() + 1000 * 3600)
            document.cookie = 'token=' + data.data + ';expires=' + exp.toGMTString()
            this.updatecookie (data.data)
            // this.$router.push('/home')
          } else if (data.errno === 403) {
            this.$notify.info({
              title: '提示',
              message: '账号密码不对!'
            });
          } else if (data.errno === 402) {
            this.$notify.info({
              title: '提示',
              message: '请输入正确的用户名！'
            });
          } else {
            this.$notify.info({
              title: '提示',
              message: '这是个意外！'
            });
          }
        })
        .catch(error => {
          console.log(error)
          this.$notify.error({
            title: '错误',
            message: '请检查网络！'
          });
        })
    },
    updatecookie:function (token) {

      let url = config.base_url+'/info?&token=' + token
      let self = this
      axios
        .get(url)
        .then(data => {
          let exp = new Date()
          exp.setTime(exp.getTime() + 1000 * 3600)
          document.cookie = 'user_id=' + data.data.data.userId + ';expires=' + exp.toGMTString()
          self.$router.push('/home')
        })
        .catch(error => {
          console.log(error)
          this.$notify.error({
            title: '错误',
            message: '请检查网络！'
          });
        })

    },
    register: function () {
      let url = config.base_url + '/register'
      console.log(this.rusername)
      axios({
        url: url,
        method:"post",
        params: {
          username: this.rusername,
          password: this.rpassword
        },
        headers: {
          'Content-Type':'application/x-www-form-urlencoded'
        }
      })
        .then(function (response) {
          this.$notify({
            title: '成功',
            message: '账号成功注册',
            type: 'success'
          });
        })
        .catch(function (error) {
          this.$notify.error({
            title: '错误',
            message: '注册失败'
          });
        });

    }
  }
}
</script>

<style scoped>
  .font{
    font-size: 20px;
  }
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
    margin-top: 100px;
    background-color: #E9EEF3;
    opacity:0.9;
    padding-bottom: 50px;
    border: 1px solid lightgray;
    box-shadow: lightgray 10px 10px 20px 5px;
    border-radius: 20px;
  }
  .image{
    background:url("../../assets/img/index.png") no-repeat;
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
