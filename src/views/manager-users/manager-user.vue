<style lang="less">
    @import './manager-user.less';
</style>
<template>
    <div class="manager-user">
        <Row :style="{'max-height':height + 'px','overflow-y':'auto'}">
            <Col span="6">
                <Card>
                    <h4 slot="title">
                        <Icon type="android-archive"></Icon>
                        企业通讯录
                    </h4>
                    <el-tree
                        :data="unitTree"
                        node-key="id"
                        empty-text='企业数据为空'
                        highlight-current
                        default-expand-all
                       :expand-on-click-node="false"
                       @node-click="nodeClick">
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>{{ data.name }}</span>
                            <div style="width:100%;" v-if="data.type == 0 || data.type == 1">
                                <span class="right">
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="() => append(data)">
                                        添加
                                    </el-button>
                                    <span>|</span>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="() => remove(node, data)">
                                        删除
                                    </el-button>
                                </span>
                            </div>
                            <div style="width:100%;" v-else>
                                <span class="right">
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="() => remove(node, data)">
                                        删除
                                    </el-button>
                                </span>
                            </div>
                        </span>
                    </el-tree>
                </Card>
            </Col>
            
            <Col span="18">
                <Card>
                    <h4 slot="title" style="display:inline-block;" v-if="nodeType==0 || nodeType == 1">
                        <Icon type="android-archive"></Icon>
                        部门人员列表
                    </h4>
                    <h4 slot="title" style="display:inline-block;" v-else>
                        <Icon type="android-archive"></Icon>
                        员工详细信息
                    </h4>
                    <Form slot="extra" v-show="nodeType==0 || nodeType == 1" inline>
                        <FormItem>
                            <span>输入文件名：</span>
                            <Input v-model="excelFileName" icon="document" placeholder="请输入文件名" style="width: 190px" />
                        </FormItem>
                        <FormItem>
                            <a id="hrefToExportTable" style="postion: absolute;left: -10px;top: -10px;width: 0px;height: 0px;"></a>
                            <Button type="primary" size="small" @click="exportExcel">导出Xls格式数据</Button>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" size="small" @click="exportData(1)">导出Cvs格式数据</Button>
                        </FormItem>
                    </Form>
                    <Table 
                        style="margin:2px"
                        :columns="columnsList" 
                        :data="unitPeople" 
                        highlight-row 
                        border
                        v-if="nodeType==0 || nodeType == 1"
                        ref="tableExport"
                    ></Table>
                    <Form :model="userInfo" :label-width="80" v-else-if="nodeType == 2" style="margin:75px;">
                        <FormItem label="姓名:" prop="name">
                            <Input type="text" v-model="userInfo.name" disabled></Input>
                        </FormItem>
                        <FormItem label="性别:" prop="sex">
                            <Input type="text" v-model="userInfo.sex" disabled></Input>
                        </FormItem>
                        <FormItem label="联系电话:" prop="phone">
                            <Input type="text" v-model="userInfo.phone" disabled></Input>
                        </FormItem>
                        <FormItem label="邮箱:" prop="email">
                            <Input type="text" v-model="userInfo.email" disabled></Input>
                        </FormItem>
                        <FormItem label="部门:" prop="unit">
                            <Input type="text" v-model="userInfo.unit" disabled></Input>
                        </FormItem>
                        <FormItem label="职位:" prop="position">
                            <Input type="text" v-model="userInfo.position" disabled></Input>
                        </FormItem>
                        <FormItem label="入职时间:" prop="add_time">
                            <Input type="text" v-model="userInfo.add_time" disabled></Input>
                        </FormItem>
                    </Form>
                </Card> 
            </Col>
        </Row>
        <modal-list :show-add="modalAdd" :show-remove="modalRemove" :parent="parentNode" @appendPush="appendPush"></modal-list>
    </div>
</template>
<script>
import modalList from './modal-list/modal-list.vue';
import {table2csvData, csvColumns} from './data/table2csv.js';
import {table2excelData, excelColumns} from './data/table2excel.js';
import table2excel from '@/libs/table2excel.js';
import companyJSON from '../component-data/company.js';
import unitJSON from '../component-data/unit.js';
import userJSON from '../component-data/user.js';
import company from '../component-data/company.js';

let id = 1000;

export default {
    name: 'managerUser',
    components:{
        modalList
    },
    data(){
        return{
            nodeType:0, //  点击节点的类型
            userInfo:{},
            excelFileName:'原始数据',
            height:'600',
            modalAdd:false,
            modalRemove:false,
            parentNode:{},
            unitTree: [],
            buttonProps: {
                type: 'ghost',
                size: 'small',
            },
            columnsList: [
                {
                    title: '员工号',
                    align: 'center',
                    key: 'id',
                    width: 90,
                    fixed: 'left'
                },
                {
                    title: '姓名',
                    align: 'center',
                    key: 'name',
                    width: 120
                },
                {
                    title: '性别',
                    align: 'center',
                    key: 'sex',
                    width: 80
                },
                {
                    title: '电话',
                    align: 'center',
                    key: 'phone',
                    width: 130
                },
                {
                    title: '邮箱地址',
                    align: 'center',
                    key: 'email',
                    width: 160
                },
                {
                    title: '部门',
                    align: 'center',
                    key: 'unit',
                    width: 120
                },
                {
                    title: '职位名称',
                    align: 'center',
                    key: 'position',
                    width: 180
                },
                {
                    title: '任职状态',
                    align: 'center',
                    key: 'status',
                    width: 120,
                    render: (h,params) => {
                        const row = params.row;
                        let text = '在职';
                        switch (row.status) {
                            case 0:
                                text = '在职';
                                break;
                            case 1:
                                text = '离职';
                                break;
                            default:
                                break;
                        }
                        return h('p',{},text);
                    }
                },
                {
                    title: '入职时间',
                    align: 'center',
                    key: 'add_time',
                    width: 160,
                    render: (h,params) => {
                        if(params.row.addTime == ''){
                            return h('span',{},'—')
                        }else{
                            return h('span',{},params.row.add_time)
                        }
                    }
                },
            ],
            unitPeople: []
        }
    },
    mounted: function(){
        this.height = document.body.scrollHeight - 122;
    },
    methods: {
        getData: function(){
            var users = userJSON[0].users;
            var units = unitJSON[0].unit;
            var companys = companyJSON[0].company;
            var that = this;
            var unitArr = [];
            
            for(var i = 0;i < units.length;i++){
                var unitObj = {
                    id:'',
                    name:'',
                    type:1,
                    children: []
                };
                users.forEach((user) => {
                    if(user.unit_no == units[i].unitNo){
                        unitObj.id = units[i].unitNo;
                        unitObj.name = units[i].unit_name
                        unitObj.type = 1;
                        user.id = user.number;
                        user.type = 2;
                        unitObj.children.push(user);
                    }
                })
                unitArr.push(unitObj);
            }
            var userTree = [{
                name: companys[0].company_name,
                id: companys[0].company_no,
                type:0,
                children: unitArr
            }];
            this.unitTree = userTree;
            that.unitPeople = [];
            userJSON[0].users.forEach((item) => {
                if(item.phone == "" || item.phone == null){
                    item.phone = '暂无';
                }
                if(item.email == "" || item.email == null){
                    item.email = '暂无';
                }
                if(item.position == "" || item.position == null){
                    item.position = '暂无';
                }
                if(item.sex == 0){
                    item.sex = '男'
                }else{
                    item.sex = '女'
                }
                if(item.out_time == "" || item.out_time == null){
                    item.status = 0;
                }else{
                    item.status = 1;
                }
                var userInfo = {};
                unitJSON[0].unit.forEach((item2) => {
                    if(item2.unitNo == item.unit_no){
                        userInfo = {
                            id: item.number,
                            name: item.name,
                            sex: item.sex,
                            phone: item.phone,
                            email: item.email,
                            unit: item2.unit_name,
                            position: item.position,
                            add_time: item.add_time.slice(0,10),
                            status: item.status
                        }
                    }
                })
                    that.unitPeople.push(userInfo);
                
            })
        },
        append(data) {
            this.parentNode = data;
            this.modalAdd = true;
        },
        appendPush: function(data){
            console.log(data)
            if (!this.parentNode.children) {
                this.$set(data, 'children', []);
            }
            this.parentNode.children.push(data);
        },
        remove(node, data) {
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(data => data.id === data.id);
            this.$confirm('确定要删除该部门或人员吗？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                children.splice(index, 1);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'    
                });
            });
        },
        exportData (type) {
            if (type === 1) {
                this.$refs.tableExport.exportCsv({
                    filename: this.excelFileName
                });
            } else if (type === 2) {
                this.$refs.tableExport.exportCsv({
                    filename: '排序和过滤后的数据',
                    original: false
                });
            } else if (type === 3) {
                this.$refs.tableExport.exportCsv({
                    filename: this.csvFileName,
                    columns: this.columnsCsv.filter((col, index) => index >= this.selectMinCol - 1 && index <= this.selectMaxCol - 1),
                    data: this.csvData.filter((data, index) => index >= this.selectMinRow - 1 && index <= this.selectMaxRow - 1)
                });
            }
        },
        exportExcel () {
            table2excel.transform(this.$refs.tableExport, 'hrefToExportTable', this.excelFileName);
        },
        nodeClick: function(node){
            this.nodeType = node.type;
            var that = this;
            if(node.type == 2){
                if(node.phone == "" || node.phone == null){
                    node.phone = '暂无';
                }
                if(node.email == "" || node.email == null){
                    node.email = '暂无';
                }
                if(node.position == "" || node.position == null){
                    node.position = '暂无';
                }
                if(node.sex == 0){
                    node.sex = '男'
                }else{
                    node.sex = '女'
                }
                unitJSON[0].unit.forEach((item) => {
                    if(item.unitNo == node.unit_no){
                        that.userInfo = {
                            name: node.name,
                            sex: node.sex,
                            phone: node.phone,
                            email: node.email,
                            unit: item.unit_name,
                            position: node.position,
                            add_time: node.add_time.slice(0,10)
                        }
                    }
                })
            }else if(node.type == 0){
                that.unitPeople = [];
                userJSON[0].users.forEach((item) => {
                    if(item.phone == "" || item.phone == null){
                        item.phone = '暂无';
                    }
                    if(item.email == "" || item.email == null){
                        item.email = '暂无';
                    }
                    if(item.position == "" || item.position == null){
                        item.position = '暂无';
                    }
                    if(item.sex == 0){
                        item.sex = '男'
                    }else{
                        item.sex = '女'
                    }
                    if(item.out_time == "" || item.out_time == null){
                        item.status = 0;
                    }else{
                        item.status = 1;
                    }
                    var userInfo = {};
                    unitJSON[0].unit.forEach((item2) => {
                        if(item2.unitNo == item.unit_no){
                            userInfo = {
                                id: item.number,
                                name: item.name,
                                sex: item.sex,
                                phone: item.phone,
                                email: item.email,
                                unit: item2.unit_name,
                                position: item.position,
                                add_time: item.add_time.slice(0,10),
                                status: item.status
                            }
                        }
                    })
                        that.unitPeople.push(userInfo);
                    
                })
            }else{
                console.log(node)
                unitJSON[0].unit.forEach((item3) => {
                    if(node.id == item3.unitNo){
                        that.unitPeople = [];
                        for(var j = 0;j < node.children.length;j++){
                            
                            if(node.children[j].phone == "" || node.children[j].phone == null){
                                node.children[j].phone = '暂无';
                            }
                            if(node.children[j].email == "" || node.children[j].email == null){
                                node.children[j].email = '暂无';
                            }
                            if(node.children[j].position == "" || node.children[j].position == null){
                                node.children[j].position = '暂无';
                            }
                            if(node.children[j].sex == 0){
                                node.children[j].sex = '男'
                            }else{
                                node.children[j].sex = '女'
                            }
                            if(node.children[j].out_time == "" || node.children[j].out_time == null){
                                node.children[j].status = 0;
                            }else{
                                node.children[j].status = 1;
                            }
                            node.children[j].unit = item3.unit_name;
                            that.unitPeople.push(node.children[j]);
                        }
                    }
                })
            }
        }
    },
    created(){
        this.getData();
    }
}
</script>

