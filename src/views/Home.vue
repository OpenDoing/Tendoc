<template>
  <div>
  <THeader></THeader>
  <div class="bg">
    <div class="wrapper">
      <el-row style="margin-bottom: 15px">
        <el-col :span="6">
          <el-dropdown>
            <span class="el-dropdown-link font">
              <strong>全部文档</strong><i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>我创建的</el-dropdown-item>
              <el-dropdown-item>我加入的</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>

      <el-table
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
            <div v-if="scope.row.auth === 0" style="width: 20px">
              <el-tooltip class="item" effect="dark" content="获得链接的人都可以查看" placement="bottom">
                <i class="el-icon-view"></i>
              </el-tooltip>
            </div>
            <div v-else-if="scope.row.auth === 1" style="width: 20px">
              <el-tooltip class="item" effect="dark" content="获得链接的人都可以编辑" placement="bottom">
                <i class="el-icon-edit"></i>
              </el-tooltip>
            </div>
            <div v-else-if="scope.row.auth === 2" style="width: 20px">
              <el-tooltip class="item" effect="dark" content="仅指定成员可查看/编辑" placement="bottom">
                <i class="el-icon-document"></i>
              </el-tooltip>
            </div>
            <div v-else style="width: 20px">
              <el-tooltip class="item" effect="dark" content="仅自己可查看/编辑" placement="bottom">
                <i class="el-icon-edit-outline"></i>
              </el-tooltip>
            </div>
            <router-link :to="{name:'Edit1',params: {did: scope.row.id}}"><span style="margin-left: 10px">{{ scope.row.docname }}</span></router-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="来自"
          width="180">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.name === '我' ? 'primary' : 'success'">
              {{scope.row.name}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          label="最近打开">
        </el-table-column>
        <el-table-column
          prop=""
          label="操作"
          width="100">
          <template slot-scope="scope">
            <!--<el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>-->
            <!--<el-button type="text" size="small">编辑</el-button>-->
            <el-dropdown  @command="handleCommand">
              <el-button type="" plain="" size="small">
                <i class="el-icon-tickets"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="change">更改名称</el-dropdown-item>
                <el-dropdown-item command="share">分享文档</el-dropdown-item>
                <el-dropdown-item command="auth">设置共享权限</el-dropdown-item>
                <el-dropdown-item command="delete">删除文档</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>


      <el-dialog
        title="文档权限"
        :visible.sync="dialogFormVisible"
        width="40%">
        <div style="padding-top: 20px">
          <span>设置文档权限</span>
          <el-select  v-model="select" placeholder="请设置权限">
            <el-option
              v-for="item in category"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </div>


        <el-table
          :data="userlist"
          :fit=true
          :center=true
          empty-text='您的文档还没有人加入'
          style="width: 100%">
          <el-table-column
            prop="head"
            label="设置成员权限">
            <template slot-scope="scope">
              <img :src="scope.row.head" style="width: 40px;height: 40px">
            </template>
          </el-table-column>
          <el-table-column
            prop="nickname"
            >
            <template slot-scope="scope">
              <p style="font-size: 16px;">{{scope.row.nickname}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="operate"
            >
            <template slot-scope="scope">
              <el-select v-model="scope.row.aid" placeholder="请选择" size="small" style="width: 50%">
                <el-option
                  v-for="item in authSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, userlist)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>

  </div>


</template>

<script>
import THeader from '@/views/components/THeader'
export default {
  name: 'Home',
  components: {
    THeader
  },
  data(){
    return{
      dialogFormVisible: false,
      select: '',
      authope: '设置权限',
      category: [
        {
          value: 0,
          label: '获得链接的人都可以查看'
        },
        {
          value: 1,
          label: '获得链接的人都可以编辑'
        },
        {
          value: 2,
          label: '仅指定成员可查看/编辑'
        },
        {
          value: 3,
          label: '仅自己可查看/编辑'
        },
      ],
      authSelect: [
        {
          label: '仅可读',
          value: 0
        },
        {
          label: '可编辑',
          value: 1
        }

      ],
      formLabelWidth: '120px',
      icon: 'el-icon-view',
      tips: '所有人都可编辑',
      tableData: [
        {
        id: 1,
        docname: '再别康桥',
        name: '王小虎',
        date: '2018-12-7 15:14:18',
        auth: 0
      }, {
        id: 2,
        docname: '新闻联播',
        name: '我',
        date: '2018-12-8 15:14:18',
        auth: 1
      }, {
        id: 3,
        docname: '呐喊',
        name: '王小虎',
        date: '2018-12-9 15:14:18',
        auth: 2
      }, {
        id: 5,
        docname: '百年孤独马尔克斯',
        name: 'test1',
        date: '2018-12-8 15:14:18',
        auth: 3
      }],
      userlist: [
        {
          id: 5,
          aid: 0,
          nickname: 'test2',
          head: '/static/img/logo.png',
        },
        {
          id: 11,
          aid: 1,
          nickname: '腾讯文档',
          head: '/static/img/word.png',
        }
      ]
    }
  },
  mounted: function () {
    this.authIcon(1)
  },
  methods: {
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
    auth() {
      //TODO: 判定是否 文档拥有者
      this.dialogFormVisible = true
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
      this.$prompt('请输入文件名', '修改文件名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: '文件名不正确'
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '文件名修改为: ' + value
        });
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '取消输入'
        // });
      });
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
