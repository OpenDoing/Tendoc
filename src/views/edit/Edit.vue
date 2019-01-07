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
      <el-col :span="2" :offset="18" style=" margin-top: 10px;">
        <el-button type="primary" @click="login">登录</el-button>
      </el-col>
    </el-row>
  </el-header>
  <el-main class="bg">
    <div class="edit_wrapper">
      <div id="editorMenu" class="toolbar"></div>
      <div id="editor" class="text"></div>
    </div>
  </el-main>
</el-container>
</template>

<script>
import E from 'wangeditor'
import {config,checktoken,getCookie} from '@/utils/global.js'
import axios from 'axios'
export default {
  name: "Edit",
  data() {
    return {
      editorObject: new E('#editorMenu', '#editor')
    }
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
    login() {
      this.$router.push({path: '/login'})
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
