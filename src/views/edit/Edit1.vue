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

        <el-col :span="1" :offset="12">
          <el-button type="primary" size="medium" style="margin-top: 10px" @click="connectDoc">编辑</el-button>
        </el-col>
        <el-col :span="1" :offset="1">
          <el-button
            type="primary"
            size="medium"
            style="margin-top: 10px"
            @click="save"
            v-loading.fullscreen.lock="saveloading">保存</el-button>
        </el-col>
        <el-col :span="1" :offset="1">
          <el-button type="primary" size="medium" style="margin-top: 10px" @click="exportDoc">导出</el-button>
        </el-col>
        <el-col :span="1" :offset="1">
          <el-dropdown  @command="handleCommand">
            <img :src="imgurl" class="avatar">
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="account">更换头像</el-dropdown-item>
              <el-dropdown-item command="changeAccount">退出账号</el-dropdown-item>
              <el-dropdown-item command="asideRecord">操作记录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
    <el-aside width="250px" class="aside" v-show="asideDisplay">
      <div>
        <b style="font-size: 18px;margin-left: 15px">操作记录</b>
        <i class="el-icon-close" @click="closeAside" style="margin-right: 10px;background-color: #f1f1f1;float: right;"></i>
        <hr>
      </div>

      <div class="record">
        <ul v-for="(record, index) in recordList" >
          <li class="record" @click="recordRollback(record.content)">
            <div style="margin-top: 15px;"><b>第{{index + 1}}版</b>&nbsp;&nbsp;&nbsp;{{record.modifyTime}}</div>
            <div style="margin-top: 10px;">操作人：{{record.saver}}</div>
            <div class="recordContent">文档内容：{{record.content}}</div>
          </li>
        </ul>
      </div>
    </el-aside>
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
    </el-container>
  </el-container>


</template>

<script>
import SockJS from 'sockjs-client'
import $ from 'jquery'
import Stomp from 'stompjs'
import {config,checktoken,getCookie} from '@/utils/global.js'
import DiffMatchPatch from 'diff-match-patch'
import _ from 'lodash'
import E from 'wangeditor'
import myUpload from 'vue-image-crop-upload'
import axios from 'axios'
// import {saveAs} from '@/assets/js/FileSaver.js'
// import word from '../../assets/js/jquery.wordexport'

export default {
  name: 'Edit1',
  components: {
    'my-upload': myUpload
  },
  data() {
    return {
      user_id: getCookie('user_id'),
      docId: this.$route.params.did,
      show: false,
      params: {
        user_id: getCookie('user_id')
      },
      headers: {
      },
      uploadPath: config.base_url + '/fileUpload',
      stompClient: null,
      dmp: new DiffMatchPatch(),
      otherText: '',
      local: '',
      imgurl: '',
      editorObject: new E('#editorMenu', '#editor'),
      saveloading: false,
      recordList:[
        {
          "id": 1,
          "userId": 2,
          "docId": 2,
          "modifyTime": "2019-01-19T14:01:19",
          "content": "阿萨德asdsd富士康东方神娃分不开价位高帮客人水电费看见GV",
          "saver": "乌尔苏拉"
        },
        {
          "id": 1,
          "userId": 2,
          "docId": 2,
          "modifyTime": "2013-02-19T14:01:19",
          "content": "666",
          "saver": "白的"
        }
      ],
      asideDisplay: false
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
    // this.nologin()
  },
  mounted() {
    this.initEditor()
    this.initImage()
    // this.nologin()
  },
  methods: {
    //关闭页面侧边栏
    closeAside() {
      this.asideDisplay = false;
    },
    //点击侧边栏记录，回滚编辑器内容
    recordRollback(content) {
      this.editorObject.txt.html(content)

    },
    asideRecord() {
      let self = this
      let docId = this.$route.params.did
      let url = config.base_url + '/record/list?docId=' + docId
      axios
        .get(url)
        .then(response => {
          console.log(response.data)
          this.recordList = response.data
          if (response.data.length === 0) {
            this.$message.error("此文档暂无操作记录，在编辑框添加你的文档内容吧！")
          } else {
            this.asideDisplay= true
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    exportDoc() {
      //下面这行很关键，确保页面加载完之后再执行，否则会报错 wordExport is not a function
      jQuery(document).ready(function ($) {
        $("#editor").wordExport()
      });
    },
    initContent() {
      let self = this
      let docId = this.$route.params.did
      let url = config.base_url + '/doc/get?docId=' + docId
      axios
        .get(url)
        .then(response => {
          console.log(response.data)
          self.editorObject.txt.html(response.data.content)
        })
        .catch(err => {

        })
    },
    save() {
      this.saveloading = true
      const url = config.base_url + '/doc/save'
      let docId = this.$route.params.did
      let content = this.editorObject.txt.html()
      let user_id = getCookie('user_id')
      axios
        .post(url,{
          user_id,
          docId,
          content
        })
        .then(response => {
          this.saveloading = false
          this.$message({
            message: '保存成功！',
            type: 'success'
          });
        })
        .catch(err => {
          this.saveloading = false
          this.$message.error('保存失败！'+err);
        })
    },
    initImage: function() {
      if (getCookie('token') === "") {
        this.$router.push({path: '/edit/' + this.$route.params.did})
        this.$message({
          message: '您现在以游客模式进行预览',
          type: 'warning'
        });
      } else{
        let url = config.base_url+'/info?&token=' + getCookie('token')
        axios
          .get(url)
          .then(data => {
            this.imgurl = config.image_url + data.data.data.avatar
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    initEditor: function() {
      // let editor = new E('#editorMenu', '#editor')
      this.editorObject.customConfig.onchange = (html) => {
        this.local = html
      }
      this.editorObject.create()
      // this.editorObject.txt.html(this.local)
      this.editorObject.$textElem.attr('contenteditable', false)
      let docId = this.$route.params.did
      let url = config.base_url + '/doc/get?docId=' + docId
      axios
        .get(url)
        .then(response => {
          let content = response.data.data.content
          this.editorObject.txt.html(content)
        })
        .catch(err => {

        })
    },
    join:function() {
      let docId = this.$route.params.did
      let self = this
      let url = config.base_url + '/getAuth?userId=' + getCookie('user_id') + '&docId=' + docId
      axios
        .get(url)
        .then(response=>{
          console.log(response.data.data)
          if (response.data.data.status === 2) {
            this.$message({
              message: '您对此文档有可编辑权限！',
              type: 'success'
            });
            self.editorObject.$textElem.attr('contenteditable', true)
          } else {
            self.$message.error("您只有可读的权限，不可进行编辑操作！")
          }
        })
        .catch(err=>{

        })
    },
    connectDoc: function() {
      this.join()
      // this.editorObject.$textElem.attr('contenteditable', true)
      let self = this;
      const socket = new SockJS( config.base_url + '/endpointSang');
      let stompClient = Stomp.Stomp.over(socket);

      console.log(this.stompClient);
      stompClient.connect({}, function (frame) {
        // setConnected(true);
        console.log('Connected:' + frame);
        stompClient.subscribe('/user/message/doc/' + self.docId, function (response) {
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
      if (this.stompClient !== null) {
        this.stompClient.send("/message", {}, JSON.stringify({'content': self.editorObject.txt.html(),'userid': self.user_id,'docid': self.docId}));
      }
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
        this.asideRecord();
      }
    },
    account() {
      this.show = !this.show;
    },
    changeAccount() {
      //TODO: 清空cookie信息
      this.$router.push({path: '/login'})
    },
    cropSuccess(imgDataUrl, field){
      console.log('-------- crop success --------');
      this.imgDataUrl = imgDataUrl;
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
      this.imgurl = config.image_url+jsonData.data;
      config.avatar = config.base_url+'/image/'+jsonData.data;
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
    }
  },
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
    width: 40px;
    height: 40px;
    /*max-width: 80%;*/
    /*max-height: 80%;*/
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
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
    width: 40px;
    height: 40px;
    vertical-align: middle;
    align-items: center;
    border-radius: 40px;
  }

  .aside{
    background-color: #fff;
    /*display: none;*/
    /*width: 300px;*/
    border: 1px solid lightslategray;
    padding-top: 20px;
    padding-right: 15px;
  }
  /*多余文本用...代替样式*/
  .recordContent{
    margin-top: 8px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  /*操作记录划过效果*/
  ul li:hover{ color:#000;  background: lightgrey; }
</style>
