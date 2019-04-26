<template>
  <div>
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
            <vue-ueditor-wrap v-model="msg" :config="myConfig"></vue-ueditor-wrap>

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
  </div>
</template>

<script>
import myUpload from 'vue-image-crop-upload'
import {config,checktoken,getCookie} from '../../utils/global'
import axios from 'axios'

export default {
  name: "Edit2",
  components: {
    'my-upload': myUpload
  },
  data() {
    return {
      show: false,
      imgurl: '',
      msg: '',
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 640,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了测试文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: 'http://35.201.165.105:8000/controller.php',
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: '/static/UEditor/'
      }

    }
  },
  mounted() {
    this.init()
    this.initImage()
  },
  methods:{
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
    init() {
      let docId = this.$route.params.did
      let url = config.base_url + '/doc/get?docId=' + docId
      axios
        .get(url)
        .then(response => {
          let content = response.data.data.content
          // this.editorObject.txt.html(content)
          console.log(content)
          this.msg = content
        })
        .catch(err => {

        })
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
