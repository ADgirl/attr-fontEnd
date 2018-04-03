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
            <Form 
                    ref="userForm"
                    :model="userForm" 
                    :label-width="100" 
                    label-position="right"
                    :rules="inforValidate"
                >
                    <FormItem label="用户姓名：" prop="name">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="userForm.name" ></Input>
                        </div>
                    </FormItem>
                    <FormItem label="性别" prop="sex">
                        <RadioGroup v-model="userForm.sex">
                            <Radio label="1" >男</Radio>
                            <Radio label="2" >女</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="出生日期" prop="brithday">
                        <DatePicker v-model="userForm.brithday" type="date" placeholder="选择日期"></DatePicker>
                    </FormItem>
                    <FormItem label="用户手机：" prop="cellphone" >
                        <div style="display:inline-block;width:204px;">
                            <Input v-model="userForm.cellphone" @on-keydown="hasChangePhone"></Input>
                        </div>
                        <div style="display:inline-block;position:relative;">
                            <Button @click="getIdentifyCode" :disabled="canGetIdentifyCode">{{ gettingIdentifyCodeBtnContent }}</Button>
                            <div class="own-space-input-identifycode-con" v-if="inputCodeVisible">
                                <div style="background-color:white;z-index:110;margin:10px;">
                                    <Input v-model="securityCode" placeholder="请填写短信验证码" ></Input>
                                    <div style="margin-top:10px;text-align:right">
                                        <Button type="ghost" @click="cancelInputCodeBox">取消</Button>
                                        <Button type="primary" @click="submitCode" :loading="checkIdentifyCodeLoading">确定</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FormItem>
                    <FormItem label="邮箱" prop="email">
                        <Input v-model="userForm.email" type="text" placeholder="选填"></Input>
                    </FormItem>
                    <FormItem label="公司：">
                        <span>{{ userForm.company }}</span>
                    </FormItem>
                    <FormItem label="部门：">
                        <span>{{ userForm.department }}</span>
                    </FormItem>
                    <FormItem label="登录密码：">
                        <!-- <Button type="text" size="small" @click="showEditPassword">修改密码</Button> -->
                        <a href="#/manager/resetPassword">修改密码</a>
                    </FormItem>
                    <div>
                        <Button type="text" style="width: 100px;" @click="cancelEditUserInfor">取消</Button>
                        <Button type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit">保存</Button>
                    </div>
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
     data () {
        const validePhone = (rule, value, callback) => {
            var re = /^1[0-9]{10}$/;
            if (!re.test(value)) {
                callback(new Error('请输入正确格式的手机号'));
            } else {
                callback();
            }
        };
        return {
            userForm: {
                name: '',
                cellphone: '',
                company: '',
                department: '',
                email:'',
                sex:'',
                birthday:''
            },
            uid: '', // 登录用户的userId
            securityCode: '', // 验证码
            phoneHasChanged: false, // 是否编辑了手机
            save_loading: false,
            identifyError: '', // 验证码错误
            editPasswordModal: false, // 修改密码模态框显示
            savePassLoading: false,
            oldPassError: '',
            identifyCodeRight: false, // 验证码是否正确
            hasGetIdentifyCode: false, // 是否点了获取验证码
            canGetIdentifyCode: false, // 是否可点获取验证码
            checkIdentifyCodeLoading: false,
            inforValidate: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                cellphone: [
                    { required: true, message: '请输入手机号码' },
                    { validator: validePhone }
                ],
                brithday: [{required: false,type: 'date',message: '选择日期',trigger: 'change'}],
                email: [{type: 'email',message: '格式错误',trigger: 'blur'}],
            },
            inputCodeVisible: false, // 显示填写验证码box
            initPhone: '',
            gettingIdentifyCodeBtnContent: '获取验证码' // “获取验证码”按钮的文字
        };
    },
    methods: {
        getIdentifyCode () {
            this.hasGetIdentifyCode = true;
            this.$refs['userForm'].validate((valid) => {
                if (valid) {
                    this.canGetIdentifyCode = true;
                    let timeLast = 60;
                    let timer = setInterval(() => {
                        if (timeLast >= 0) {
                            this.gettingIdentifyCodeBtnContent = timeLast + '秒后重试';
                            timeLast -= 1;
                        } else {
                            clearInterval(timer);
                            this.gettingIdentifyCodeBtnContent = '获取验证码';
                            this.canGetIdentifyCode = false;
                        }
                    }, 1000);
                    this.inputCodeVisible = true;
                    // you can write ajax request here
                }
            });
        },
        // showEditPassword () {
        //     this.editPasswordModal = true;
        // },
        cancelEditUserInfor () {
            this.$store.commit('removeTag', 'ownspace_index');
            localStorage.pageOpenedList = JSON.stringify(this.$store.state.app.pageOpenedList);
            let lastPageName = '';
            if (this.$store.state.app.pageOpenedList.length > 1) {
                lastPageName = this.$store.state.app.pageOpenedList[1].name;
            } else {
                lastPageName = this.$store.state.app.pageOpenedList[0].name;
            }
            this.$router.push({
                name: lastPageName
            });
        },
        saveEdit () {
            this.$refs['userForm'].validate((valid) => {
                if (valid) {
                    if (this.phoneHasChanged && this.userForm.cellphone !== this.initPhone) { // 手机号码修改过了而且修改之后的手机号和原来的不一样
                        if (this.hasGetIdentifyCode) { // 判断是否点了获取验证码
                            if (this.identifyCodeRight) { // 判断验证码是否正确
                                this.saveInfoAjax();
                            } else {
                                this.$Message.error('验证码错误，请重新输入');
                            }
                        } else {
                            this.$Message.warning('请先点击获取验证码');
                        }
                    } else {
                        this.saveInfoAjax();
                    }
                }
            });
        },
        // cancelEditPass () {
        //     this.editPasswordModal = false;
        // },
        // saveEditPass () {
        //     this.$refs['editPasswordForm'].validate((valid) => {
        //         if (valid) {
        //             this.savePassLoading = true;
        //             // you can write ajax request here
        //         }
        //     });
        // },
        init () {
            this.userForm.name = 'Lison';
            this.userForm.cellphone = '17712345678';
            this.initPhone = '17712345678';
            this.userForm.company = 'TalkingData';
            this.userForm.department = '可视化部门';
        },
        cancelInputCodeBox () {
            this.inputCodeVisible = false;
            this.userForm.cellphone = this.initPhone;
        },
        submitCode () {
            let vm = this;
            vm.checkIdentifyCodeLoading = true;
            if (this.securityCode.length === 0) {
                this.$Message.error('请填写短信验证码');
            } else {
                setTimeout(() => {
                    this.$Message.success('验证码正确');
                    this.inputCodeVisible = false;
                    this.checkIdentifyCodeLoading = false;
                }, 1000);
            }
        },
        hasChangePhone () {
            this.phoneHasChanged = true;
            this.hasGetIdentifyCode = false;
            this.identifyCodeRight = false;
        },
        saveInfoAjax () {
            this.save_loading = true;
            setTimeout(() => {
                this.$Message.success('保存成功');
                this.save_loading = false;
            }, 1000);
        }
    },
    mounted () {
        this.init();
    }
    };
</script>