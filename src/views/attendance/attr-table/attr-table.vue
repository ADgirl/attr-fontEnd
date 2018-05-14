<style lang="less" scoped>
@import "../../../styles/common.less";
@import "./attr-table.less";
</style>
<template>
    <div class="attr-content">
        <Card>
            <Form slot="title" inline :label-width="100" :model="chartFilter" class="attr-content-title">
                <FormItem prop="date">
                    <Select slot="label" v-model="chartFilter.timeType" style="width:100px">
                        <Option v-for="item in titleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <div style="margin-left:5px;line-height:51px;">
                        <span>:</span>
                        <DatePicker v-if="chartFilter.timeType == 1" v-model="chartFilter.month" type="month" placeholder="选择年月" style="width: 200px;"></DatePicker>
                        <DatePicker v-else v-model="chartFilter.date" type="date" placeholder="选择日期" style="width: 200px;"></DatePicker>
                    </div>
                </FormItem>
                <FormItem prop="person">
                    <Select slot="label" v-model="chartFilter.userType" style="width:100px">
                        <Option v-for="item in titleList2" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <div style="margin-left:5px;line-height:51px;">
                        <span>:</span>
                        <Select v-model="chartFilter.unit" style="width:100px;">
                            <Option v-for="item in unitJSON" :value="item.unitNo" :key="item.value">{{ item.unit_name }}</Option>
                        </Select>
                        <Select v-show="chartFilter.userType == 0" multiple v-model="chartFilter.person" style="width:100px">
                            <Option v-for="item in personJSON" :value="item.number" :key="item.value">{{ item.name }}</Option>
                        </Select>
                    </div>
                </FormItem>
                <FormItem>
                    <Button type="primary" size="default" icon="ios-search" @click="search">查询</Button>
                </FormItem>
            </Form>
            <Table border style="margin:2px;" highlight-row no-data-text="无数据" :height="height" :columns="tableColumns" :data="tableData2"></Table>
        </Card>
    </div>
</template>
<script>
import unitJSON from "../../component-data/unit.js";
import personJSON from "../../component-data/user.js";
import workJSON from "../../component-data/work_time.js";
import managerJSON from "../../component-data/manager.js";
import util from '../../../libs/util.js';

export default {
  name: "attr-table",
  data() {
    return {
      personJSON: [],
      unitJSON: [],
      height: 600,
      remark: "",
      titleList: [
        {
          value: 0,
          label: "日期"
        },
        {
          value: 1,
          label: "月份"
        }
      ],
      titleList2: [
        {
          value: 0,
          label: "员工"
        },
        {
          value: 1,
          label: "部门"
        }
      ],
      chartFilter: {
        timeType: 0,
        userType: 0,
        month: "",
        date: "",
        unit: "",
        person: []
      },
      tableColumns: [
        {
          title: "员工编号",
          key: "number",
          align: "center"
        },
        {
          title: "姓名",
          key: "name",
          align: "center"
        },
        {
          title: "日期",
          key: "work_date",
          align: "center"
        },
        {
          title: "上班时间",
          key: " work_up",
          align: "center",
          render: (h, params) => {
            if (params.row.work_up == "") {
              return h("span", {}, "—");
            } else {
              return h("span", {}, params.row.work_up);
            }
          }
        },
        {
          title: "下班时间",
          key: " work_down",
          align: "center",
          render: (h, params) => {
            if (params.row.work_down == "") {
              return h("span", {}, "—");
            } else {
              return h("span", {}, params.row.work_down);
            }
          }
        },
        {
          title: "考勤状态",
          key: "work_state", //0：正常，1：加班，2：早退，3：矿工，4：迟到，5：休假
          align: "center",
          render: (h, params) => {
            const row = params.row;

            let color = "green";
            let text = "正常";
            switch (row.work_state) {
              case 0:
                color = "green";
                text = "正常";
                break;
              case 1:
                color = "blue";
                text = "加班";
                break;
              case 2:
                color = "red";
                text = "早退";
                break;
              case 3:
                color = "red";
                text = "旷工";
                break;
              case 4:
                color = "red";
                text = "迟到";
                break;
              case 5:
                color = "green";
                text = "休假";
                break;

              default:
                break;
            }

            return h(
              "Tag",
              {
                props: {
                  type: "dot",
                  color: color
                }
              },
              text
            );
          }
        },
        {
          title: "备注",
          key: "update_remark",
          align: "center",
          render: (h, params) => {
            const row = params.row;
            let that = this;
            if (row.update_remark == "" || row.update_remark == null) {
              return h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: function() {
                      that.resetRemark(row);
                    }
                  }
                },
                "编辑"
              );
            } else {
              return h("span", {}, row.update_remark);
            }
          }
        }
      ],
      tableData: [],
      tableData2: []
    };
  },
  computed: {
    title2ed() {
      return this.chartFilter.userType;
    },
    united() {
      return this.chartFilter.unit;
    },
    personed() {
      return this.chartFilter.person;
    }
  },
  watch: {
    title2ed: function(newValue, old) {
      if (newValue == 1) {
        this.chartFilter.unit = null;
      }
    },
    united: function(newValue, old) {
      var that = this;
      var personJSONed = [];
      this.chartFilter.person = [];
      personJSON[0].users.forEach(item => {
        if (item.unit_no == newValue) {
          personJSONed.push(item);
        }
      });
      that.personJSON = personJSONed;
    },
    personed: function(newValue, old) {
      return newValue;
    }
  },
  mounted: function() {
      this.height = document.body.scrollHeight - 270;
  },
  methods: {
      getData: function() {
          this.unitJSON = unitJSON[0].unit;
          this.personJSON = personJSON[0].users;
          var persons = personJSON[0].users;
          var managers = managerJSON[0].manager;
          var that = this;

          workJSON[0].work.forEach(item => {
            for (var i = 0; i < persons.length; i++) {
              if (item.number == persons[i].number) {
                item.name = persons[i].name;
                item.unit_no = persons.unit_no;
              }
            }
            if (item.update_user != null || item.update_user != "") {
              for (var j = 0; j < managers.length; j++) {
                item.update_user = managers[j].user_name;
                item.update_id = managers[j].user_id;
              }
            }
            that.tableData.push(item);
          });
          that.tableData2 = that.tableData;
      },
    resetRemark: function(index) {
        var that = this;
        this.$Modal.confirm({
          title: "备注",
          render: h => {
            return h("Input", {
              props: {
                value: this.remark,
                autofocus: true,
                placeholder: "考勤备注说明"
              },
              on: {
                input: val => {
                  this.remark = val;
                }
              }
            });
          },
          onOk: function() {
            index.update_remark = that.remark;
          }
        });
    },
    search: function() {
      var that = this;
      this.tableData2 = [];
      var timeType = this.chartFilter.timeType;
      var userType = this.chartFilter.userType;
      var dt = this.chartFilter.date;
      var month = this.chartFilter.month;
      var person = this.chartFilter.person;
      var unit = this.chartFilter.unit;

      if (timeType == 0) {  //timeType:0,日期;1:月份
        if (dt == "" || dt == null) {
          dt = "2018-05-01";
        } else {
          dt = util.dateFormat(dt,"YYYY-MM-dd");
        }
        if (userType == 0) {  //userType:0,员工;1:部门
          if (person.length == 0) {
            this.tableData.forEach(item => {
              if (item.work_date == dt) {
                that.tableData2.push(item);
              }
            });
          } else {
            for (var i = 0; i < person.length; i++) {
              this.tableData.forEach(item => {
                if (item.work_date == dt && item.number == person[i]) {
                  that.tableData2.push(item);
                }
              });
            }
          }
        } else {
          if (unit == null || unit == "") {
            this.tableData.forEach(item => {
              if (item.work_date == dt) {
                that.tableData2.push(item);
              }
            });
          } else {
            this.tableData.forEach(item => {
              if (item.work_date == dt && item.unit_no == unit) {
                that.tableData2.push(item);
              }
            });
          }
        }
      } else {
        if (month == "" || month == null) {
          month = "2018-05";
        } else {
            month = util.dateFormat(month,"yyyy-MM");
        }
        if (userType == 0) {
          if (person.length == 0) {
            this.tableData.forEach(item => {
              if (item.work_date.slice(0, 7) == month) {
                that.tableData2.push(item);
              }
            });
          } else {
            for (var i = 0; i < person.length; i++) {
              this.tableData.forEach(item => {
                if (
                  item.work_date.slice(0, 7) == month &&
                  item.number == person[i]
                ) {
                  that.tableData2.push(item);
                }
              });
            }
          }
        } else {
          if (unit == "" || unit == null) {
            this.tableData.forEach(item => {
              if (item.work_date.slice(0, 7) == month) {
                that.tableData2.push(item);
              }
            });
          } else {
            this.tableData.forEach(item => {
              if (item.work_date.slice(0, 7) == month && item.unit_no == unit) {
                that.tableData2.push(item);
              }
            });
          }
        }
      }
    },
  },
  created: function() {
    this.getData();
  }
};
</script>

