<template>
  <div>
  <THeader></THeader>
  <div class="bg">
    <div class="wrapper">
      <el-row style="margin-bottom: 15px">
        <el-col :span="6">
          <el-dropdown  @command="handleDocCommand">
            <span class="el-dropdown-link font">
              <strong>筛选</strong><i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="alldoc">全部文档</el-dropdown-item>
              <el-dropdown-item command="created">我创建的</el-dropdown-item>
              <el-dropdown-item command="joined">我加入的</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>

      <el-table
        v-loading="loading"
        height="450"
        :data="tableData"
        stripe
        empty-text='您还没有文档，快去新建文档吧'
        style="width: 100%">
        <el-table-column
          prop="date"
          label="文件名"
          width="300">
          <template slot-scope="scope">
            <div style="float:left;display: flex">
            <div v-if="scope.row.authID === 1" style="width: 20px">
              <el-tooltip class="item" effect="dark" content="获得链接的人都可以查看" placement="bottom">
                <i class="el-icon-view"></i>
              </el-tooltip>
            </div>
            <div v-else-if="scope.row.authID === 2" style="width: 20px">
              <el-tooltip class="item" effect="dark" content="获得链接的人都可以编辑" placement="bottom">
                <i class="el-icon-edit"></i>
              </el-tooltip>
            </div>
            <div v-else-if="scope.row.authID === 3" style="width: 20px">
              <el-tooltip class="item" effect="dark" content="仅指定成员可查看/编辑" placement="bottom">
                <i class="el-icon-document"></i>
              </el-tooltip>
            </div>
            <div v-else style="width: 20px">
              <el-tooltip class="item" effect="dark" content="仅自己可查看/编辑" placement="bottom">
                <i class="el-icon-edit-outline"></i>
              </el-tooltip>
            </div>
            <router-link :to="{name:'Edit1',params: {did: scope.row.id}}"><span style="margin-left: 10px">{{ scope.row.docName }}</span></router-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="来自"
          width="180">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.creator === myname ? 'primary' : 'success'">
              {{scope.row.creator === myname ? '我' : scope.row.creator}}

            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="最近打开">
        </el-table-column>
        <el-table-column
          prop=""
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              circle
              @click="handleEdit(scope.$index, scope.row)"></el-button>
            <!--<el-button-->
              <!--size="mini"-->
              <!--@click="handleEdit(scope.$index, scope.row)">重命名</el-button>-->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="DeleteDoc(scope.$index, scope.row, tableData)"></el-button>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-view"
              circle
              @click="auth(scope.$index, scope.row)"></el-button>
            <!--<el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>-->
            <!--<el-button type="text" size="small">编辑</el-button>-->
            <!--<el-dropdown  @command="handleCommand">-->
              <!--<el-button type="" plain="" size="small">-->
                <!--<i class="el-icon-tickets"></i>-->
              <!--</el-button>-->
              <!--<el-dropdown-menu slot="dropdown">-->
                <!--<el-dropdown-item command="change">更改名称</el-dropdown-item>-->
                <!--<el-dropdown-item command="share">分享文档</el-dropdown-item>-->
                <!--<el-dropdown-item command="auth">设置共享权限</el-dropdown-item>-->
                <!--<el-dropdown-item command="delete">删除文档</el-dropdown-item>-->
              <!--</el-dropdown-menu>-->
            <!--</el-dropdown>-->
          </template>
        </el-table-column>
      </el-table>


      <el-dialog
        title="权限设置"
        :visible.sync="dialogFormVisible"
        width="40%">
        <!--<div style="padding-top: 20px">-->
          <!--<span>设置文档权限</span>-->
          <!--<el-select  v-model="select" placeholder="请设置权限">-->
            <!--<el-option-->
              <!--v-for="item in category"-->
              <!--:key="item.value"-->
              <!--:label="item.label"-->
              <!--:value="item.value"-->
              <!--:disabled="item.disabled">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</div>-->


        <el-table
          :data="userlist"
          :fit=true
          :center=true
          empty-text='您的文档还没有人加入'
          style="width: 100%">
          <el-table-column
            prop="head"
            label="">
            <template slot-scope="scope">
              <img :src="scope.row.avatar" style="width: 40px;height: 40px">
            </template>
          </el-table-column>
          <el-table-column
            prop="nickname"
            label="成员ID">
            <template slot-scope="scope">
              <p style="font-size: 16px;">{{scope.row.creator}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="operate"
            label="设置权限">
            <template slot-scope="scope">
              <el-select v-model="scope.row.status" placeholder="请选择" size="small" style="width: 100%">
                <el-option
                  v-for="item in authSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <!--<el-button-->
                <!--size="mini"-->
                <!--type="danger"-->
                <!--@click="handleDelete(scope.$index, userlist)">移除</el-button>-->
            </template>
          </el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateAuth">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>

  </div>


</template>

<script>
import THeader from '@/views/components/THeader'
import axios from 'axios'
import {config,checktoken,getCookie} from "../utils/global";
export default {
  name: 'Home',
  components: {
    THeader
  },
  data(){
    return{
      myname: '',
      loading: true,
      dialogFormVisible: false,
      select: '',
      authope: '设置权限',
      category: [
        {
          value: 0,
          label: '获得链接的人仅可查看'
        },
        {
          value: 1,
          label: '获得链接的人都可编辑'
        },
        {
          value: 2,
          label: '仅指定成员可查看/编辑'
        }
      ],
      authSelect: [
        {
          label: '仅可读',
          value: 1
        },
        {
          label: '可编辑',
          value: 2
        }

      ],
      formLabelWidth: '120px',
      icon: 'el-icon-view',
      tips: '所有人都可编辑',
      tableData: [],
      userlist: []
    }
  },
  created: function() {
    this.alldoc()
  },
  mounted: function () {
    this.authIcon(1)
    // this.initImage()
    this.init()
    // this.alldoc()
  },
  methods: {
    //更新用户列表权限
    updateAuth() {
      let url = config.base_url + '/authlist'
      axios
        .post(url,{
          userlist: this.userlist
        })
        .then(response=>{
          console.log(response)
        })
      this.dialogFormVisible = false
    },
    handleDocCommand(command) {
      if (command === 'created' ) {
        this.created()
      }else if (command === 'joined') {
        this.joined()
      } else {
        this.alldoc()
      }
    },
    created() {
      let self = this
      self.loading = true
      let url = config.base_url + '/doc/listdocType?user_id=' + getCookie('user_id') + '&type=1'
      axios
        .get(url)
        .then(response=>{
          self.tableData = response.data
          self.loading = false
        })
    },
    joined() {
      let self = this
      self.loading = true
      let url = config.base_url + '/doc/listdocType?user_id=' + getCookie('user_id') + '&type=2'
      axios
        .get(url)
        .then(response=>{
          self.tableData = response.data
          self.loading = false
        })
    },
    handleEdit(index, row) {
      console.log(index)
      console.log(row)
      this.$prompt('', '修改文件名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputErrorMessage: '文件名不正确'
      }).then(({ value }) => {
        let self = this
        const url = config.base_url + '/doc/updatename'
        axios
          .post(url, {
          uid: getCookie('user_id'),
          name: value,
          docid: row.id
        })
          .then(function (response) {
            row.docName = value
            self.$message({
              message: '文件名成功修改为：' + value,
              type: 'success'
            })
          })
          .catch(function (error) {
            console.log(error)
          });

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    DeleteDoc(index, row, table) {
      let self = this
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //TODO :检查是否有删除的权限---管理员才可以删除
        const url = config.base_url + '/doc/delete'
        axios
          .post(url,{
            user_id: getCookie('user_id'),
            docid: row.id
          })
          .then(response => {
            if (response.data.errno !== 0) {
              this.$message.error(response.data.errmsg)
            } else {
              // console.log(self.tableData)
              table.splice(index, 1)
              self.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          })
          .catch(err=>{

          })

        //TODO : 更新表格数据
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });
      });
    },
    init() {
      let url = config.base_url+'/info?&token=' + checktoken()
      axios
        .get(url)
        .then(data => {
          // console.log(data.data.data.nickname)
          this.myname = data.data.data.nickname
        })
        .catch(error => {
          console.log(error)
          this.$message.error('网络请求错误!')
        })
    },
    alldoc() {
      let self = this
      self.loading = true
      const url = config.base_url + '/doc/listAlldoc?user_id=' + getCookie('user_id')
      axios
        .get(url)
        .then(response => {
          // console.log(response.data)
          // console.log(this.myname)
          // for (let i =0; i < response.data.length; i++) {
          //   let time = response.data[i].updateTime
          //   time.replace('T'," ")
          // }
          self.tableData = response.data
          self.loading = false
        })
        .catch(err => {
          this.$message.error('您暂无加入或创建的文档！');
          self.loading = false
        })
    },
    handleDelete(index, rows) {
      rows.splice(index, 1)
    },
    authIcon(id) {
      if (id === 0) {
        this.tips = '获得链接的人都可以查看'
        this.icon = 'el-icon-view'
      }else if(id === 1){
        this.tips = '获得链接的人都可以编辑'
        this.icon = 'el-icon-edit'
      }else if(id === 2){
        this.tips = '仅指定成员可查看/编辑'
        this.icon = 'el-icon-view'
      }else{
        this.tips = '仅自己可查看/编辑'
        this.icon = 'el-icon-view'
      }
    },
    handleCommand(command) {
      if (command === 'delete') {
        this.delete();
      }else if (command === 'share') {
        this.share();
      }else if (command === 'auth'){
        this.auth();
      }else {
        this.change();
      }
    },
    auth(index, row) {
      //TODO: 判定是否 文档拥有者
      let self = this
      if (row.creator !== this.myname) {
        this.$message.error('您不是文档创建者，没有权限设置！');
      } else {
        let url = config.base_url + '/joinlist?docId=' + row.id +'&type=2'
        axios
          .get(url)
          .then(response => {
            for (let i = 0; i<response.data.data.length;i++){
              response.data.data[i].avatar = config.image_url + response.data.data[i].avatar
            }
            self.userlist = response.data.data
          })
          .catch(err => {

          })

        this.dialogFormVisible = true
      }
      // this.select =
    },
    delete() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //TODO :检查是否有删除的权限---管理员才可以删除
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        //TODO : 更新表格数据
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });
      });
    },
    share() {

    },
    change() {
      console.log(this)

    },
    handleAuth(row) {
      console.log(row)
      // if (command === 'readable') {
      //   this.authope = '仅可读'
      // }else if (command === 'editable') {
      //   this.authope = '可编辑'
      // }else if (command === 'remove') {
      //   this.authope = '移除'
      // }
    }
  }

}
</script>

<style scoped>


  .el-dropdown-link.font{
    font-size: 20px;
  }

  .bg{
    width: 100%;
    height: 700px;
    background-color: #E9EEF3;
  }
  .wrapper{

    padding-top: 100px;
    padding-left: 20%;
    padding-right: 20%;
    /*width: 70%;*/
    /*display: flex;*/
    /*justify-content: center;*/

  }

</style>
