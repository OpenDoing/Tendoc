<template>
  <!--<div class="header-wrapper">-->
    <!--<div class="header-logo-wrapper"><span class="logo"></span><span class="logo-text"></span></div>-->
    <!--<div class="header-search" style="margin-left: 45px;margin-right: 244px;">-->
      <!--<div class="header-search-wrap ">-->
        <!--<button class="search-button " aria-label="搜索在线文档" role="button"><span class="icon-search"></span></button>-->
        <!--<div class="search-input "><input aria-label="输入文件名搜索"></div>-->
        <!--<button class="search-close-button " aria-label="清除搜索" role="button"><span class="icon-close"></span></button>-->
        <!--<div style="display: none; z-index: 999; pointer-events: visible;">-->
          <!--<div class="search-result-list" style="box-shadow: rgba(51, 51, 51, 0.15) 2px 2px 4px 0px; z-index: 999;">-->
            <!--<ul class="file-list" style=""><p class="file-list-title">&lt;!&ndash; react-text: 414 &ndash;&gt;你可能需要-->
              <!--&lt;!&ndash; /react-text &ndash;&gt;</p>-->
              <!--<li class="" title="在线文档"><span class="icon-doc"></span>-->
                <!--<div class="item_name">在线文档</div>-->
              <!--</li>-->
              <!--<li class="" title="在线表格"><span class="icon-excel"></span>-->
                <!--<div class="item_name">在线表格</div>-->
              <!--</li>-->
              <!--<li class="" title="在线收集表"><span class="icon-form"></span>-->
                <!--<div class="item_name">在线收集表</div>-->
              <!--</li>-->
            <!--</ul>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
    <!--<div class="header-button-list">-->
      <!--<div class="new-doc-wrap">-->
        <!--<button class="btn btn-new-doc ">新建</button>-->
        <!--<div style="display: none; z-index: 999; pointer-events: visible;">-->

        <!--</div>-->
      <!--</div>-->
      <!--<button class="btn btn-import-file">导入</button>-->
      <!--<div style="display: inline-block;">-->
        <!--<div class="line"></div>-->
        <!--<div style="display: inline-block; position: relative;">-->
          <!--<button class="header-bell-button"></button>-->
        <!--</div>-->
        <!--<div style="display: inline-block;">-->
          <!--<button class="header-menu-button"></button>-->
          <!--<div style="display: none; z-index: 999; pointer-events: visible;">-->
            <!--<div class="header-menu"-->
                 <!--style="box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 0px, rgba(0, 0, 0, 0.25) 0px 2px 5px 0px; z-index: 999;">-->
              <!--<li>关于腾讯文档</li>-->
              <!--<li>进入官网</li>-->
              <!--<li>帮助中心</li>-->
              <!--<li>-->
                <!--<form method="post" action="https://support.qq.com/product/28096" target="_blank"><input type="hidden"-->
                                                                                                         <!--name="nickname"-->
                                                                                                         <!--value="好好睡觉好好吃饭"><input-->
                  <!--type="hidden" name="avatar"-->
                  <!--value="https://thirdqq.qlogo.cn/g?b=oidb&amp;k=UtxKiaRViaxhzJFUIPyI0sew&amp;s=0"><input type="hidden"-->
                                                                                                          <!--name="openid"-->
                                                                                                          <!--value="25446964"><input-->
                  <!--type="hidden" name="customInfo" value="https://docs.qq.com/desktop/"><input type="hidden"-->
                                                                                              <!--name="clientInfo"-->
                                                                                              <!--value="Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36">-->
                  <!--<button type="submit" class="feedback-btn">吐个槽</button>-->
                <!--</form>-->
              <!--</li>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="line"></div>-->
        <!--<div class="user-info-container ">-->
          <!--<div>-->
            <!--&lt;!&ndash;<div class="user-avatar"&ndash;&gt;-->
                 <!--&lt;!&ndash;style="background-image: url(&quot;https://thirdqq.qlogo.cn/g?b=oidb&amp;k=UtxKiaRViaxhzJFUIPyI0sew&amp;s=0&quot;);"></div>&ndash;&gt;-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
  <!--</div>-->

  <el-header>
    <el-row>
      <el-col :span="1">
        <img class="imglogo" src="../../assets/img/word.png">
      </el-col>
      <el-col :span="3">
        <p><strong id="font">在线文档</strong></p>
      </el-col>
      <!--<el-col :span="7" :offset="2">-->
        <!--<el-input type="text" class="search" placeholder="请输入搜索名字" ></el-input>-->
      <!--</el-col>-->
      <el-col :span="1" :offset="16">
        <el-button type="primary" style="margin-top: 10px" @click="newDoc">新建文档</el-button>
      </el-col>
      <el-col :span="1" :offset="1">
        <el-dropdown  @command="handleCommand">
          <img :src="img" class="avatar">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="account">更换头像</el-dropdown-item>
            <el-dropdown-item command="changeAccount">切换账号</el-dropdown-item>
            <!--<el-dropdown-item command="logout">退出账号</el-dropdown-item>-->
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>

    <my-upload field="file"
               @crop-success="cropSuccess"
               @crop-upload-success="cropUploadSuccess"
               @crop-upload-fail="cropUploadFail"
               v-model="show"
               :width="300"
               :height="300"
               :url="uploadPath"
               :params="params"
               :headers="headers">
    </my-upload>
  </el-header>
</template>

<script>
import myUpload from 'vue-image-crop-upload'
import {config,checktoken,getCookie} from '../../utils/global.js'
import axios from 'axios'
export default {
  name: 'THeader',
  components: {
    'my-upload': myUpload
  },
  data() {
    return {
      show: false,
      img: '',
      params: {
        user_id: getCookie('user_id'),
      },
      headers: {
      },
      uploadPath: config.base_url + '/fileUpload',
    }
  },
  methods: {
    clearCookie() {
      var date = new Date();
      date.setTime(date.getTime() - 10000);
      var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
      if (keys) {
        for (var i = keys.length; i--;)
          document.cookie = keys[i] + "=0; expire=" + date.toGMTString() + "; path=/";
      }
    },
    newDoc() {
      //TODO: 发请求新建文档，地址栏加  DOC ID
      const url = config.base_url + '/doc/new'
      // let date = new Date()
      // let mytime = date.toLocaleTimeString()
      axios
        .post(url,{
          userId: getCookie('user_id'),
        })
        .then(response => {
          // console.log(response)
          this.$router.push({path: 'edit1/'+response.data.data})
        })
        .catch(err => {
          console.log(err)
        })
      // this.$router.push({path: 'edit1/8'})
    },
    handleCommand(command) {
      if (command === 'account') {
        this.account();
      }else if (command === 'changeAccount') {
        this.changeAccount();
      }else {
        this.logout();
      }
    },
    account() {
      this.show = !this.show;
    },
    changeAccount() {
      //TODO: 清空cookie信息
      this.clearCookie()
      this.$router.push({path: 'login'})
    },
    logout() {
      //TODO: 清空cookie信息
      this.clearCookie()
    },
    cropSuccess(imgDataUrl, field){

    },
    /**
     * upload success
     *
     * [param] jsonData   服务器返回数据，已进行json转码
     * [param] field
     */
    cropUploadSuccess(jsonData, field){
      console.log('-------- upload success --------');
      console.log(jsonData);
      console.log('field: ' + field);
      this.img = config.image_url + jsonData.data;
    },
    /**
     * upload fail
     *
     * [param] status    server api return error status, like 500
     * [param] field
     */
    cropUploadFail(status, field){
      console.log(status);
      console.log('field: ' + field);
    },
    initImage() {
      if (checktoken() === -1) {
        this.$notify.warning({
          title: '页面过期',
          message: '您的token已过期，正跳转到登录页面'
        });
      }
        let url = config.base_url+'/info?&token=' + checktoken()
        axios
          .get(url)
          .then(data => {
            this.img = config.image_url + data.data.data.avatar
          })
          .catch(error => {
            this.$notify.error({
              title: '错误',
              message: '网络链接超时！'
            });
          })
    }
  },
  mounted() {
    this.initImage()
  }
}
</script>

<style scoped>
  .avatar{
    margin-left: 5px;
    margin-top: 10px;
    width: 40px;
    height: 40px;
    vertical-align: middle;
    align-items: center;
    border-radius: 40px;
  }


  .search{
    padding-top: 10px;
    display: flex;
    align-items: center;
    vertical-align:middle;
  }

  #font{
    font-size: 22px;
    align-items: center;
    vertical-align: center;
  }


  .el-header{
    /*text-align: left;*/
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(30,20,20,.1);

    /*height: 100px;*/
  }
  .sameLine{
    display: flex;
  }
  .imglogo{
    max-width: 40px;
    max-height: 40px;
    vertical-align: middle;
    align-items: center;
    margin-top: 10px;
  }


</style>
