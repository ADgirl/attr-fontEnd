<style lang="less">
    @import './manager-user.less';
</style>
<template>
    <div class="manager-user">
        <Row>
            <Col span="6">
                <Card>
                    <h4 slot="title">
                        <Icon type="android-archive"></Icon>
                        企业通讯录
                    </h4>
                    <el-tree
                        :style="{'max-height':height + 'px','overflow-y':'auto'}"
                        :data="unitTree"
                        node-key="id"
                        empty-text='企业数据为空'
                        highlight-current
                        default-expand-all
                        expand-on-click-node>
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>{{ data.label }}</span>
                            <div style="width:100%;">
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
                        </span>
                    </el-tree>
                </Card>
            </Col>
            
            <Col span="18">
                <Card>
                    <h4 slot="title">
                        <Icon type="android-archive"></Icon>
                        部门人员列表
                    </h4>
                    <Table 
                        :style="{height:height+'px',margin:'2px'}"
                        ref="dragable" 
                        :columns="columnsList" 
                        :data="unitPeople" 
                        highlight-row 
                        border
                    ></Table>
                </Card> 
            </Col>
        </Row>
    </div>
</template>
<script>
let id = 1000;

export default {
    name: 'managerUser',
    data(){
        return{
            height:'600',
            unitTree: [
                {
                    label: '志高科技有限责任公司',
                    id:0,
                    children: [
                        {
                            label: '总裁办',
                            id:1,
                            children: [
                                {
                                    label: '张高志',
                                    id:2
                                },
                                {
                                    label: '肖扬',
                                    id:3
                                }
                            ]
                        },
                        {
                            label: '财务处',
                            id:4,
                            children: [
                                {
                                    label: '刘承宇',
                                    id:5
                                },
                                {
                                    label: '刘浩然',
                                    id:6
                                }
                            ]
                        },
                        {
                            label: '行政处',
                            id:7,
                            children: [
                                {
                                    label: '元宝',
                                    id:8
                                },
                                {
                                    label: '尚余娴',
                                    id:9
                                }
                            ]
                        },
                        {
                            label: '开发部',
                            id:10,
                            children: [
                                {
                                    label: '开发一组',
                                    id:11,
                                    children: [
                                        {
                                            label: '张子枫',
                                            id:112
                                        },
                                        {
                                            label:'王小明',
                                            id: 113
                                        }
                                    ]
                                },
                                {
                                    label: '开发二组',
                                    id:12,
                                    children: [
                                        {
                                            label:'张颖',
                                            id: 121
                                        },
                                        {
                                            label: '张良',
                                            id: 122
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            label: '测试部',
                            id:13,
                            children: [
                                {
                                    label: '潘粤明',
                                    id:14
                                },
                                {
                                    label: '黎明',
                                    id:15
                                }
                            ]
                        },
                        {
                            label: '设计部',
                            id:17,
                            children: [
                                {
                                    label: '许诺',
                                    id:18
                                },
                                {
                                    label: '王又又',
                                    id:19
                                }
                            ]
                        },
                        {
                            label: '产品经理',
                            id:20,
                            children: [
                                {
                                    label: '张子琪',
                                    id:21
                                },
                                {
                                    label: '范冰冰',
                                    id:22
                                }
                            ]
                        },
                        {
                            label: '策划部',
                            id:23,
                            children: [
                                {
                                    label: '张若拉',
                                    id:24
                                },
                                {
                                    label: '刘飞鸿',
                                    id:25
                                }
                            ]
                        },
                        {
                            label: '运营部',
                            id:26,
                            children: [
                                {
                                    label: '李海明',
                                    id:27,
                                },
                                {
                                    label: '张峰',
                                    id:28
                                }
                            ]
                        },
                        {
                            label: '编辑部',
                            id:29,
                            children: [
                                {
                                    label: '王琪琪',
                                    id:30
                                },
                                {
                                    label: '赵宇',
                                    id:31
                                }
                            ]
                        },
                        {
                            label: '市场部',
                            id:32,
                            children: [
                                {
                                    label: '陈诚',
                                    id:33
                                },
                                {
                                    label: '季洁',
                                    id:34
                                }
                            ]
                        }
                    ]
                }
            ],
            buttonProps: {
                type: 'ghost',
                size: 'small',
            },
            columnsList: [
                {
                    title: '员工号',
                    align: 'left',
                    key: 'number',
                    width: 90
                },
                {
                    title: '姓名',
                    align: 'left',
                    key: 'name',
                    width: 120
                },
                {
                    title: '性别',
                    align: 'left',
                    key: 'sex',
                    width: 80
                },
                {
                    title: '电话',
                    align: 'left',
                    key: 'phone',
                    width: 130
                },
                {
                    title: '邮箱地址',
                    align: 'left',
                    key: 'email',
                    width: 140
                },
                {
                    title: '部门',
                    align: 'left',
                    key: 'unitName',
                    width: 120
                },
                {
                    title: '职位名称',
                    align: 'left',
                    key: 'position',
                    width: 120
                },
                {
                    title: '任职状态',
                    align: 'left',
                    key: 'status',
                    width: 120
                },
                {
                    title: '入职时间',
                    align: 'left',
                    key: 'addTime',
                    width: 120
                },
                {
                    title: '离职时间',
                    align: 'left',
                    key: 'outTime',
                    width: 120
                },
                {
                    title: '管理员权限',
                    align: 'left',
                    key: 'manageType',
                    width: 120
                },
            ],
            unitPeople: [
                {
                    id:0,
                    number:'01',
                    name:'李白',
                    sex:'男',
                    phone:'12345678911',
                    email:'123456@qq.com',
                    unitName:'开发部',
                    position:'前端开发工程师',
                    status:0,
                    manageType:0,
                    addTime:'2015-07-01 15:00',
                    outTime:''
                },
                {
                    id:2,
                    number:'02',
                    name:'李白2',
                    sex:'男',
                    phone:'12345678911',
                    email:'123456@qq.com',
                    unitName:'开发部',
                    position:'前端开发工程师',
                    status:0,
                    manageType:0,
                    addTime:'2015-07-01 15:00',
                    outTime:''
                },
                {
                    id:3,
                    number:'03',
                    name:'李白3',
                    sex:'男',
                    phone:'12345678911',
                    email:'123456@qq.com',
                    unitName:'开发部',
                    position:'前端开发工程师',
                    status:0,
                    manageType:0,
                    addTime:'2015-07-01 15:00',
                    outTime:''
                }
            ]
        }
    },
    mounted: function(){
        this.height = document.body.scrollHeight - 200;
    },
    methods: {
        append(data) {
            const newChild = { id: id++, label: 'testtest', children: [] };
            if (!data.children) {
            this.$set(data, 'children', []);
            }
            data.children.push(newChild);
        },
        remove(node, data) {
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
        },
    }
}
</script>

