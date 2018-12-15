<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="1">
          <img class="imglogo" src="../../assets/img/word.png">
        </el-col>
        <el-col :span="3">
          <p><strong id="font">在线文档</strong></p>
        </el-col>

        <el-col :span="1" :offset="16">
          <el-button type="primary" style="margin-top: 10px" @click="connectDoc">加入</el-button>
        </el-col>
        <el-col :span="1" :offset="1">
          <el-dropdown  @command="handleCommand">
            <img :src="imgurl" class="avatar">
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="account">账号管理</el-dropdown-item>
              <el-dropdown-item command="changeAccount">切换账号</el-dropdown-item>
              <el-dropdown-item command="logout">退出账号</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="bg">
      <div class="edit_wrapper">
        <!--<div class="editorbody">-->
          <!--<el-input id="content" type="textarea" :rows="30" v-model="local">-->

          <!--</el-input>-->
        <!--</div>-->
        <div id="editorMenu" class="toolbar"></div>
        <div id="editor" class="text"></div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import SockJS from 'sockjs-client'
import $ from 'jquery'
import Stomp from 'stompjs'
import config from '@/utils/global.js'
import DiffMatchPatch from 'diff-match-patch'
import _ from 'lodash'
import E from 'wangeditor'

export default {
  name: 'Edit1',
  data() {
    return {
      stompClient: null,
      dmp: new DiffMatchPatch(),
      otherText: '',
      local: '',
      imgurl: '../static/img/logo.png',
      editorObject: new E('#editorMenu', '#editor')
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
    this.initEditor()
  },
  methods: {
    initEditor: function() {
      // let editor = new E('#editorMenu', '#editor')
      this.editorObject.customConfig.onchange = (html) => {
        this.local = html
      }
      this.editorObject.create()
      this.editorObject.txt.html(this.local)
    },


    connectDoc: function() {
      let self = this;
      const socket = new SockJS( config.base_url + '/endpointSang');
      let stompClient = Stomp.Stomp.over(socket);

      console.log(this.stompClient);
      stompClient.connect({}, function (frame) {
        // setConnected(true);
        console.log('Connected:' + frame);
        stompClient.subscribe('/user/message/doc/4' , function (response) {
          let something = JSON.parse(response.body).content;
          self.otherText = something;
        })
      });
      this.stompClient = stompClient;
    },
    sendName: function(){
      let self = this;
      console.log(this.stompClient);
      // let name = $('#content').val();
      let userId = '2';
      let docId = '4';
      this.stompClient.send("/message", {}, JSON.stringify({'content': self.editorObject.txt.html(),'userid': userId,'docid': docId}));
    },
    disconnect: function(stompClient) {
      if (this.stompClient != null) {
        this.stompClient.disconnect();
      }
      console.log('Disconnected');
    },
    synchronization: function () {
      let local = this.editorObject.txt.html();
      // const local = $("#content").val();
      // console.log(local);
      // console.log(this.otherText);
      let x = this.dmp.diff_main(local, this.otherText);
      let y = this.dmp.diff_cleanupSemantic(x);
      let patch = this.dmp.patch_make(local,x);
      let result = this.dmp.patch_apply(patch,local);
      this.local = result[0];
      this.editorObject.txt.html(result[0])
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

    },
    changeAccount() {
      //TODO: 清空cookie信息
      this.$router.push({path: 'login'})
    },
    logout() {
      //TODO: 清空cookie信息
    },
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
    box-shadow: lightgray 10px 10px 20px 5px;
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

  .imglogo{
    max-width: 40px;
    max-height: 40px;
    vertical-align: middle;
    align-items: center;
    margin-top: 10px;
  }

  #font{
    font-size: 22px;
    align-items: center;
    vertical-align: center;
  }

  .avatar{
    margin-top: 10px;
    max-width: 40px;
    max-height: 40px;
    vertical-align: middle;
    align-items: center;
  }
</style>
