<style lang="less">
@import './modal-list.less';
</style>
<template>
    <div class="modal-list">
        <!-- add some person -->
        <Modal :value="showAdd" title="添加人员" @on-ok="sureAdd" @on-cancel="cancel" closable>
            <Form class="modal-body":label-width="120" :rules="inforValidate">
                <FormItem prop="name" label="姓名" required>
                    <div style="display:inline-block;width:300px;">
                        <Input v-model="person.name" placeholder="必填"></Input>
                    </div>
                </FormItem>
                <FormItem prop="sex" label="性别">
                    <RadioGroup v-model="person.sex">
                        <Radio label="1" >男</Radio>
                        <Radio label="2" >女</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem prop="phone" label="电话" required>
                    <div style="display:inline-block;width:300px;">
                        <Input v-model="person.cellphone" placeholder="必填"></Input>
                    </div>
                </FormItem>
                <FormItem prop="email" label="邮箱">
                    <div style="display:inline-block;width:300px;">
                        <Input v-model="person.email" type="text" placeholder="选填"></Input>
                    </div>
                </FormItem>
                <FormItem prop="unit" label="部门">
                    <div style="display:inline-block;width:300px;">
                        <Input v-model="person.unit" disabled></Input>
                    </div>
                </FormItem>
                <FormItem prop="position" label="职位" required>
                    <div style="display:inline-block;width:300px;">
                        <Input v-model="person.position" placeholder="必填"></Input>
                    </div>
                </FormItem>
                <FormItem prop="addTime" label="入职时间">
                    <DatePicker v-model="person.addTime" type="datetime" placeholder="选填" style="width: 300px"></DatePicker>
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
                addTime:''
            },
            inforValidate:{
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入手机号码' },
                    { validator: validePhone }
                ],
                email: [{type: 'email',message: '格式错误',trigger: 'blur'}],
                position: [{required:true,message:'请输入员工职位',trigger:'blur'}]
            }
        }
    },
    watch:{
        parent:function(val){
            this.person.unit = val.label;
        }
    },
    methods:{
        sureAdd:function(){
            if(this.parent.CoId){
                const data = {
                    id:this.parent.id++,
                    person:person,
                    orgId:this.parent.id++
                }
            }else if(this.parent.orgId){
                const data = {
                    id:this.parent.id++,
                    person:person,
                    grpId:this.parent.id++
                }
            }else if(this.parent.grpId){
                const data = {
                    id:this.parent.id++,
                    person:person
                }
            }
            console.log('sure')
            console.log(data)
            this.$emit('appendPush',data);
        },
        sureDel:function(){
Y
        },
        cancel:function(){
            this.showAdd = false;
            this.showRemove = false;
        }
    }
}
</script>


