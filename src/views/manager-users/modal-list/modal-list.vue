<style lang="less">
@import './modal-list.less';
</style>
<template>
    <div class="modal-list">
        <!-- add some person -->
        <Modal :value="showAdd" :title="title" @on-ok="sureAdd('person')" @on-cancel="cancel" closable>
            <Form class="modal-body" ref="person"  :model="person" :label-width="120" :rules="formValidate" v-if="parent.type == 1">
                <FormItem prop="name" label="姓名" required>
                    <div style="display:inline-block;width:300px;">
                        <Input v-model="person.name" placeholder="必填"></Input>
                    </div>
                </FormItem>
                <FormItem prop="sex" label="性别">
                    <RadioGroup v-model="person.sex">
                        <Radio label="0" >男</Radio>
                        <Radio label="1" >女</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem prop="phone" label="电话" required>
                    <div style="display:inline-block;width:300px;">
                        <Input v-model="person.phone" placeholder="必填"></Input>
                    </div>
                </FormItem>
                <FormItem prop="email" label="邮箱">
                    <div style="display:inline-block;width:300px;">
                        <Input v-model="person.email" type="text" placeholder="选填"></Input>
                    </div>
                </FormItem>
                <!-- <FormItem prop="unit" label="部门">
                    <Select v-model="person.unit" style="display:inline-block;width:300px;">
                        <Option v-for="item in units" :value="item.unitNo" :key="item.value">{{ item.unit_name }}</Option>
                    </Select>
                </FormItem> -->
                <FormItem prop="position" label="职位" required>
                    <div style="display:inline-block;width:300px;">
                        <Input v-model="person.position" placeholder="必填"></Input>
                    </div>
                </FormItem>
                <FormItem prop="addTime" label="入职时间">
                    <DatePicker v-model="person.add_time" type="date" placeholder="选填" style="width: 300px"></DatePicker>
                </FormItem>
            </Form>
        </Modal>
        <!-- remove some person -->
        <Modal :value="showRemove" title="删除员工" @on-ok="sureDel" @on-cancel="cancel" closable>
            <Alert type="warning" show-icon>
                确认删除此员工的所有信息？
                <span slot="desc">
                </span>
            </Alert>
        </Modal>
    </div>
</template>
<script>
import userJSON from '../../component-data/user.js';
import unitJSON from '../../component-data/unit.js';

export default {
    name:'modalList',
    props:{
        showAdd:{
            type:Boolean,
            default:true
        },
        showRemove:{
            type:Boolean,
            default:false
        },
        parent:Object
    },
    data(){
        const validePhone = (rule, value, callback) => {
            var re = /^1[0-9]{10}$/;
            if (!re.test(value)) {
                callback(new Error('请输入正确格式的手机号'));
            } else {
                callback();
            }
        };
        return{
            person:{
                name:'',
                sex:'',
                phone:'',
                email:'',
                unit:'',
                position:'',
                add_time:''
            },
            title:'添加人员',
            formValidate:{
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入手机号码' },
                    { validator: validePhone }
                ],
                email: [
                    {type: 'email',message: '格式错误',trigger: 'blur'}
                ],
                position: [
                    {required:true,message:'请输入员工职位',trigger:'blur'}
                ]
            },
            units:[],
            unit:{} //  新增部门
        }
    },
    watch:{
        parent:function(val,old){
            console.log(val)
            this.person.unit = val.label;
        }
    },
    methods:{
        getData(){
            this.units = unitJSON[0].unit;
        },
        sureAdd:function(name){
            var that = this;
            this.$refs[name].validate((valid) => {
                    if (valid) {
                        var data = {};
                        if(this.parent.type == 0){
                            this.unit.id = "org_11" + this.units.length++;
                            this.unit.created_time = new Date();
                            this.unit.company_id = 0;
                            this.unit.type = 1;
                            this.unit.name = this.unit.name;
                            this.unit.children = [];
                            data = this.unit;
                        }else if(this.parent.type == 1){
                            this.person.id = userJSON[0].users.length++;
                            this.person.type = 2;
                            this.person.children = [];
                            this.person.unit_no = this.parent.id;
                            this.person.unit_name = this.parent.name;
                            data = this.person;
                        }
                        this.$emit('appendPush',data);
                    } else {
                        this.$Message.error('添加失败');
                    }
                })
            
        },
        sureDel:function(){
            
        },
        cancel:function(){
            this.showAdd = false;
            this.showRemove = false;
        }
    },
    created(){
        this.getData();
        if(this.parent.type == 0){
            this.title = '添加部门';
        }else{
            this.title = '添加人员';
        }
    }
}
</script>


