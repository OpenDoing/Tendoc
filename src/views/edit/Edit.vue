<template>
<el-container>
  <el-header>
    <el-row  class="head_top">
      <el-col :span="2">logo</el-col>
      <el-col :span="13">logo</el-col>
      <el-col :span="2"><el-button type="primary">分享</el-button></el-col>
      <el-col :span="2"><el-button>权限</el-button></el-col>
      <el-col :span="2"><el-button>新建</el-button></el-col>
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
          <div ref="editorMenu" class="toolbar"></div>
          <div ref="editor" class="text"></div>
    </div>
  </el-main>
</el-container>
</template>

<script>
import E from 'wangeditor'
export default {
  name: "Edit",
  data() {
    return {}
  },
  mounted() {
    let editor = new E(this.$refs.editorMenu, this.$refs.editor)
    editor.customConfig.onchange = (html) => {
      this.editorContent = html
    }
    editor.create()
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
