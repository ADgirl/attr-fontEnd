<style lang="less" scoped>
    @import './my-profile.less';
</style>
<template>
    <Row type="flex" align="bottom" justify="center">
        <Col span="15" class="profile-content">
        <Row>
            <Col class="profile-content-left" span="8">
            <Upload multiple type="select" action="//jsonplaceholder.typicode.com/posts/" :format="['png','jpg','jpeg','bmp']" class="upload">
                <div class="icon">
                    <Icon type="ios-plus-empty"></Icon>
                </div>
            </Upload>
            <p>点击上传图片</p>
            <p>支持图片格式png/jpg/jpeg/bmp</p>
            </Col>
            <Col class="profile-content-right" span="16">
            <Form ref="formValidate" :label-width="100" :model="info" :rules="ruleValidate">
                <FormItem label="账户名称" prop="loginName">
                    <Input v-model="info.loginName" type="text" placeholder="必填" disabled></Input>
                </FormItem>
                <FormItem label="姓名" prop="name">
                    <Input v-model="info.name" type="text" placeholder="必填"></Input>
                </FormItem>
                <FormItem label="性别" prop="sex">
                    <RadioGroup v-model="info.sex">
                        <Radio label="1" >男</Radio>
                        <Radio label="2" >女</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="出生日期" prop="brithday">
                    <DatePicker v-model="info.brithday" type="date" placeholder="选择日期"></DatePicker>
                </FormItem>
                <FormItem label="警号" prop="workCode">
                    <Input v-model="info.workCode" type="text" placeholder="选填"></Input>
                </FormItem>
                <FormItem label="手机号码" prop="phoneNumber">
                    <Input v-model="info.phoneNumber" type="text" placeholder="必填"></Input>
                </FormItem>
                <FormItem label="邮箱" prop="email">
                    <Input v-model="info.email" type="text" placeholder="选填"></Input>
                </FormItem>
                <FormItem label="APP账户">
                    <el-switch v-model="info.appOnOff" active-value="1" inactive-value="0">
                    </el-switch>
                </FormItem>
                <FormItem label="所属单位" prop="orgId">
                    <Select v-model="info.orgId" disabled>
                        <Option v-for="item in orgData" :value="item.orgId" :key="item.orgId">{{ item.orgCname }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="所属角色" prop="role">
                    <el-select class="select" v-model="info.roleArr" placeholder="全选" filterable multiple collapse-tags size="small" disabled>
                        <el-option v-for="item in roleData" :key="item.roleId" :label="item.roleCname" :value="item.roleId">
                        </el-option>
                    </el-select>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="save">保存</Button>
                </FormItem>
            </Form>
            </Col>
        </Row>
        </Col>
    </Row>
</template>
<script>
    import Cookies from 'js-cookie';
    import util from '@/libs/util';

    export default {
      name: 'myProfile',
      data() {
        return {
          info: {
            loginName: '',
            name: '',
            sex: '',
            brithday: '',
            workCode: '',
            phoneNumber: '',
            email: '',
            appOnOff: null,
            org: '',
            role: null,
            roleArr: []
          },
          orgData: [],
          roleData: [],
          //初始化角色
          defaultRoleId: '',

          ruleValidate: {
            name: [{
              required: true,
              message: '姓名不能为空',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 20,
              message: '姓名只能输入2-20个汉字，例如：李四',
              trigger: 'blur'
            },
            {
              validator(rule, value, callback, source, options) {
                var errors = [];
                if (!/^[\u4E00-\u9FA5]{1,5}$/.test(value)) {
                  callback('姓名只能输入2-20个汉字，例如：李四');
                }
                callback(errors);
              }
            }
            ],
            policeId: [{
              required: false,
              trigger: 'blur'
            }],
            phoneNumber: [{
              required: true,
              message: '手机号码不能为空',
              trigger: 'blur'
            },
            {
              number: true,
              len: 11,
              message: '请输入正确的手机号码',
              trigger: 'blur'
            }
            ],
            email: [{
              type: 'email',
              message: '格式错误',
              trigger: 'blur'
            }],
            brithday: [{
              required: false,
              type: 'date',
              message: '选择日期',
              trigger: 'change'
            }]
          }
        };
      },
      mounted: function () {
        var that = this;
        this.loadOrgData(function () {
          that.loadRoleData(function () {
            that.loadData();
          });
        });
      },
      methods: {
        save: function () {
          this.$refs.formValidate.validate(valid => {
            if (valid) {
              var user = Cookies.get('userId');
              var time = util.dateFormat(new Date());
              var birthDate = util.dateFormat(this.info.brithday, 'yyyy-MM-dd');
              var appOnOff = this.info.appOnOff == true ? '1' : this.info.appOnOff;
              var role = this.info.roleArr.join(',');
              var sex = this.info.sex == 'male' ? '0' : this.info.sex;

              var params = {
                //'departId': this.info.departId,
                'orgId': this.info.orgId,
                'loginName': this.info.loginName,
                'status': '1',
                'name': this.info.name,
                'sex': sex,
                'brithday': birthDate,
                'phoneNumber': this.info.phoneNumber,
                'updatedUserid': user,
                'roleIds': role
              };
              if (this.info.workCode != '') {
                params.workCode = this.info.workCode;
              }
              if (appOnOff != '') {
                params.appOnOff = appOnOff;
              }
              if (this.info.email != '') {
                params.email = this.info.email;
              }
              if (this.info.pictureUrl != '') {
                params.pictureUrl = this.info.pictureUrl;
              }
              if (this.info.remark != '') {
                params.remark = this.info.remark;
              }
              params.userId = this.info.userId;
              this.update(params);
            } else {
              this.$message.error('请确保信息填写完整！');
            }
          });
        },
        update: function (filterParams) {
          var that = this;

          this.$http
            .post('user/edit', filterParams)
            .then(function (res) {
              var response = res.data;
              if (response.code === 0) {
                that.$message.success('操作成功！');
              } else {
                var mes = '编辑用户失败！';
                if (response.message) {
                  mes = mes + ' 失败原因：' + response.message;
                }
                that.$message.error(mes);
              }
            });
        },

        //数据加载
        loadData: function () {
          var that = this;
          var user = Cookies.get('userId');
          var params = {
            'userId': user
          };

          this.$http
            .post('user/get', params)
            .then(function (res) {
              var response = res.data;
              if (response.code === 0) {
                that.info = response.data;
                if (that.info.appOnOff) {
                  that.info.appOnOff = that.info.appOnOff.toString();
                }
    
                that.getOrgById(that.info.orgId);
                if (that.info.initFlag === 1) {
                  that.info.roleArr = [];
                  that.info.roleArr.push(that.defaultRoleId); ;
                } else {
                  that.getRoleById(that.info.userId);
                }
              } else {
                var mes = '查询用户列表失败！';
                if (response.message) {
                  mes = mes + ' 失败原因：' + response.message;
                }
                that.$message.error(mes);
              }
            });
        },

        getRoleById: function (userId) {
          var that = this;
          if (typeof (userId) === 'undefined') {
            return null;
          } else {
            var params = {
              userId: userId
            };
            this.$http
              .post('user/role/list', params)
              .then(function (res) {
                var response = res.data;
                if (response.code === 0) {
                  var data = response.data;
                  var roles = '';
                  var rolesArr = [];
                  if (data) {
                    data.forEach(element => {
                      roles += roles.length === 0 ? element.roleCname
                        : ',' + element
                          .roleCname;
                      rolesArr.push(element.roleId);
                    });
                    that.info.role = roles;
                    that.info.roleArr = rolesArr;
                  }
                } else {
                  var mes = '查询指定角色失败！';
                  if (response.message) {
                    mes = mes + ' 失败原因：' + response.message;
                  }
                  that.$message.error(mes);
                }
              });
          }
        },

        getOrgById: function (orgId) {
          var that = this;
          var params = {
            'orgId': orgId
          };

          this.$http
            .post('org/get', params)
            .then(function (res) {
              var response = res.data;
              if (response.code === 0) {
                var data = response.data;
                that.info.org = data.orgId;
              } else {
                var mes = '查询指定单位失败！';
                if (response.message) {
                  mes = mes + ' 失败原因：' + response.message;
                }
                that.$message.error(mes);
              }
            });
        },
        //查询单位列表
        loadOrgData: function (callback) {
          var that = this;
          var params = {};

          this.$http
            .post('org/list', params)
            .then(function (res) {
              var response = res.data;
              if (response.code === 0) {
                var data = response.data;
                that.orgData = [];
                data.forEach(element => {
                  that.orgData.push(element);
                });

                if (callback) {
                  callback();
                }
              } else {
                var mes = '查询单位列表失败！';
                if (response.message) {
                  mes = mes + ' 失败原因：' + response.message;
                }
                that.$message.error(mes);
              }
            });
        },
        //查询角色列表
        loadRoleData: function (callback) {
          var that = this;
          var params = {
            'currentPage': 1,
            'pageSize': 99999999
          };

          this.$http
            .post('role/pages', params)
            .then(function (res) {
              var response = res.data;
              if (response.code === 0) {
                var data = response.data.datas;

                that.roleData = [];
                data.forEach(element => {
                  if (element.initFlag === 1) {
                    that.defaultRoleId = element.roleId;
                  }
                  that.roleData.push(element);
                });
                if (callback) {
                  callback();
                }
              } else {
                var mes = '查询角色列表失败！';
                if (response.message) {
                  mes = mes + ' 失败原因：' + response.message;
                }
                that.$message.error(mes);
              }
            });
        }

      }
    };
</script>