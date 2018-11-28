<template>
  <el-container>
    <el-header>
      <el-row class="head_top">
        <el-col :span="2">logo</el-col>
        <el-col :span="13">logo</el-col>
        <el-col :span="3"><el-button type="primary" @click="connectDoc">加入编辑</el-button></el-col>
        <el-col :span="2"><el-button @click="sendName">群发消息</el-button></el-col>
        <el-col :span="2"><el-button @click="synchronization">分享</el-button></el-col>
        <el-col :span="1">
          <el-dropdown>
            <el-button type="" plain="">
              <i class="el-icon-tickets"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>保存为本地文件</el-dropdown-item>
              <el-dropdown-item>1</el-dropdown-item>
              <el-dropdown-item>2</el-dropdown-item>
              <el-dropdown-item>3</el-dropdown-item>
              <el-dropdown-item>4</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="1">
          <img src="@/assets/img/logo.png">
        </el-col>
      </el-row>
    </el-header>
    <el-main class="bg">
      <div class="edit_wrapper">
        <div class="editorbody">
          <el-input id="content" type="textarea" :rows="30" v-model="local">

          </el-input>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import SockJS from 'sockjs-client'
import $ from 'jquery'
import Stomp from 'stompjs'
import {config} from '@/utils/global.js'
import DiffMatchPatch from 'diff-match-patch'
import _ from 'lodash'

export default {
  name: 'Edit1',
  data() {
    return {
      stompClient: null,
      dmp: new DiffMatchPatch(),
      otherText: '',
      local: ''
    }
  },
  watch: {
    otherText: function () {
      this.debouncedGetAnswer()
    },
    local: function () {
      this.debouncedGetAnswer2()
    }
  },
  created: function () {
    // `_.debounce` 是一个通过 Lodash 限制操作频率的函数。
    // 在这个例子中，我们希望限制访问 yesno.wtf/api 的频率
    // AJAX 请求直到用户输入完毕才会发出。想要了解更多关于
    // `_.debounce` 函数 (及其近亲 `_.throttle`) 的知识，
    // 请参考：https://lodash.com/docs#debounce
    this.debouncedGetAnswer = _.debounce(this.synchronization, 500)
    this.debouncedGetAnswer2 = _.debounce(this.sendName, 500)
  },
  mounted() {

  },
  methods: {
    contentChange: function() {
      this.local = $("#content").val()
    },
    connectDoc: function() {
      let self = this;
      const socket = new SockJS( config.base_url + '/endpointSang');
      let stompClient = Stomp.Stomp.over(socket);

      console.log(this.stompClient);
      stompClient.connect({}, function (frame) {
        // setConnected(true);
        console.log('Connected:' + frame);
        stompClient.subscribe('/topic/getResponse'+'/1', function (response) {
          let something = JSON.parse(response.body).responseMessage;
          self.otherText = something;
        })
      });
      this.stompClient = stompClient;
    },
    showResponse: function(message) {
      // $("#content").val(message);
      this.$options.methods.synchronization();
    },
    sendName: function(){
      console.log(this.stompClient);
      let name = $('#content').val();
      console.log('name:' + name);
      this.stompClient.send("/welcome", {}, JSON.stringify({'name': name}));
    },
    disconnect: function(stompClient) {
      if (this.stompClient != null) {
        this.stompClient.disconnect();
      }
      console.log('Disconnected');
    },
    hello: function () {
      console.log($);
    },
    synchronization: function () {
      const local = $("#content").val();
      console.log(local);
      console.log(this.otherText);
      let x = this.dmp.diff_main(local,this.otherText);
      let y = this.dmp.diff_cleanupSemantic(x);
      console.log(x);
      console.log(y);
      let patch = this.dmp.patch_make(local,x);
      let result = this.dmp.patch_apply(patch,local);
      console.log("follow: change to result");
      console.log(result);
      $("#content").val(result[0]);
    }
  }
}
</script>

<style scoped>
  .toolbar {
    border: 1px solid #ccc;
    margin-bottom: 60px;
    padding-top: 10px;
  }
  .text {
    border: 1px solid #ccc;
    height: 800px;
    margin-left: 10px;
    margin-right: 10px;
  }
  .edit_wrapper{
    /*display: flex;*/
    background-color: #fff;
    width: 70%;
    min-height: 800px;
    margin-left: 15%;
    margin-right: 15%;
    box-shadow: lightgray 10px 10px 20px 5px
    /*align-items:center;*/
    /*justify-content:center;*/
  }

  .editorbody{
    padding-top: 10%;
    padding-left: 10%;
    padding-right: 10%;
  }
  .content{
    width: 800px;
    height: 800px;
  }

  .bg{
    min-height: 800px;
    background-color: #E9EEF3;
  }
  img{
    width: auto;
    height: auto;
    max-width: 80%;
    max-height: 80%;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
  }
  .el-header{
    padding: 0 10px;
  }
  .head_top {
    /*position: relative;*/
    /*display: inline-block;*/
    /*width: 100%;*/
    height: 50px;
    /*text-align: left;*/
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(20,20,20,.1);
  }

</style>
