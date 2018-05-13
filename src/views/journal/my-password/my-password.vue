<style lang="less" scoped>
    @import './my-password.less';
</style>
<template>
    <Row class="pas-form">
        <Col :lg="{span:9,offset:7}" :md="{ span: 9, offset: 7 }">
        <Form :label-width="100" :model="pasValue" :rules="ruleValidate">
            <FormItem prop="oldPas" label="原始密码">
                <Input type="password" :autofocus="true" v-model="pasValue.oldPas" style="width:300px;"></Input>
            </FormItem>
            <FormItem prop="newPas" label="新密码">
                <Input type="password" :autofocus="true" v-model="pasValue.newPas" style="width:300px;"></Input>
            </FormItem>
            <FormItem label="密码强度">
                <div class="pas-form-slider">
                    <div class="slider" :class="{'slider-low':sliderLow,'slider-middle':slidermiddle,'slider-high':sliderHigh}"></div>
                    <div class="slider" :class="{'slider-middle':slidermiddle,'slider-high':sliderHigh}"></div>
                    <div class="slider" :class="{'slider-high':sliderHigh}"></div>
                    <span>{{pasValue.level}}</span>
                </div>
            </FormItem>
            <FormItem prop="confirmPas" label="确认密码">
                <Input type="password" :autofocus="true" v-model="pasValue.confirmPas" style="width:300px;"></Input>
            </FormItem>
            <FormItem>
                <Button @click="save" type="primary" style="width:300px;">保存</Button>
            </FormItem>
        </Form>
        </Col>
    </Row>
</template>
<script>
    import Cookies from 'js-cookie';
    // import jquery_md5 from '@/vendors/jquery/jquery.md5.js';

    export default {
      name: 'myPassword',
      data() {
        const oldpasEqual = (rule, val, callback) => {
          var errors = [];
          if (val != Cookies.get('password')) {
            callback('原始密码错误');
          }
          callback(errors);
        };
        const newpasEqual = (rule, val, callback) => {
          var errors = [];
          if (val == this.pasValue.oldPas) {
            callback('新密码不能与原始密码一致!');
          }
          callback(errors);
        };
        const confirmpasEqual = (rule, val, callback) => {
          var errors = [];
          if (val != this.pasValue.newPas) {
            callback('两次输入密码不一致，请重新输入!');
          }
          callback(errors);
        };
        return {
          pasValue: {
            oldPas: null,
            newPas: null,
            confirmPas: null,
            level: ''
          },
          ruleValidate: {
            oldPas: [{
              required: true,
              message: '原始密码不能为空',
              trigger: 'blur',
              placeholder: '必填'
            },
            {
              validator: oldpasEqual,
              trigger: 'blur'
            }
            ],
            newPas: [{
              required: true,
              message: '新密码不能为空',
              trigger: 'blur',
              placeholder: '必填'
            },
            {
              validator: newpasEqual,
              trigger: 'blur'
            }
            ],
            confirmPas: [{
              required: true,
              message: '确认密码不能为空',
              trigger: 'blur',
              placeholder: '必填'
            },
            {
              validator: confirmpasEqual,
              trigger: 'blur'
            }
            ]
          },
          sliderLow: false,
          slidermiddle: false,
          sliderHigh: false
        };
      },
      computed: {
        newPassword: function () {
          return this.pasValue.newPas;
        }
      },
      watch: {
        newPassword: function (val) {
          var num = this.checkStrong(val);
          switch (num) {
            case -1:
              this.sliderLow = false;
              this.slidermiddle = false;
              this.sliderHigh = false;
              break;
            case 0:
              this.sliderLow = true;
              this.pasValue.level = '低';
              break;
            case 1:
              this.sliderLow = true;
              this.pasValue.level = '低';
              break;
            case 2:
              this.slidermiddle = true;
              this.pasValue.level = '中';
              break;
            case 3:
              this.sliderHigh = true;
              this.pasValue.level = '强';
              break;
            case 4:
              this.sliderHigh = true;
              this.pasValue.level = '强';
              break;
          }
        }
      },
      methods: {
        checkStrong: function (val) {
          var modes = 0;
          if (val.length == 0) return -1;
          if (val.length < 6 && val.length > 0) return 0;
          if (/\d/.test(val)) modes++; //数字
          if (/[a-z]/.test(val)) modes++; //小写
          if (/[A-Z]/.test(val)) modes++; //大写
          if (/\W/.test(val)) modes++; //特殊字符
          return modes;
        },
        save: function () {
          // var user = Cookies.get('userId');
          // var params = {
          //   'userId': user,
          //   'oldPassword': $.md5(this.pasValue.oldPas),
          //   'newPassword': $.md5(this.pasValue.newPas),
          //   'updatedUserid': user
          // };
          if((this.pasValue.oldPas!=""&&this.pasValue.newPas!=""&&this.pasValue.confirmPas!="")
          &&(this.pasValue.oldPas!=null&&this.pasValue.newPas!=null&&this.pasValue.confirmPas!=null)){
            Cookies.set('password',this.pasValue.newPas);
            var user = Cookies.get('user');
            var password = Cookies.get('password');
            console.log('user:'+user+','+'password:'+password);
            this.$Modal.success({
                              title: '提示',
                              content: '密码修改成功'
                          });
          }
          
          // var that = this;
          // this.$http
          //   .post('user/password', params)
          //   .then(function (res) {
          //     var response = res.data;
          //     if (response.code === 0) {
          //       that.$message.success('操作成功！');
          //       // 退出登录
          //       that.$store.commit('logout', that);
          //       that.$store.commit('clearOpenedSubmenu');
          //       // that.$router.push({
          //       //   name: 'login'
          //       // });
          //     } else {
          //       var mes = '修改用户密码失败！';
          //       if (response.message) {
          //         mes = mes + ' 失败原因：' + response.message;
          //       }
          //       that.$message.error(mes);
          //     }
          //   });
        }
      }
    };
</script>