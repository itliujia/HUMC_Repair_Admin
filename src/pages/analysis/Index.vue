<template>
<div>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <h1>工人信息</h1>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="工人姓名"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-select placeholder="请选择" @select="nameChange">
                  <a-select-option
                    :value="item.id"
                    v-for="(item, index) in workerList"
                    :key="index"
                    >{{ item.wname }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="负责楼号"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-select placeholder="请选择" @select="getBuildingNum">
                  <a-select-option
                    :value="item.id"
                    v-for="(item, index) in buildingNumList"
                    :key="index"
                    >{{ item.text }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <h1>工单状态</h1>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="工单状态"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-select placeholder="请选择" @select="getStatus">
                  <a-select-option
                    :value="item.id"
                    v-for="(item, index) in status"
                    :key="index"
                    >{{ item.name }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="advanced">
            <h1>查询时间</h1>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="年份"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-select placeholder="请选择" @select="getYear">
                  <a-select-option
                    :value="item.id"
                    v-for="(item, index) in yeardata"
                    :key="index"
                    >{{ item.name }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="月份"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-select placeholder="请选择" @select="getMonth">
                  <a-select-option
                    :value="item.month"
                    v-for="(item, index) in monthdata"
                    :key="index"
                    >{{ item.name }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="日子"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-select placeholder="请选择" @select="getDay">
                  <a-select-option
                    :value="item.day"
                    v-for="(item, index) in daydata"
                    :key="index"
                    >{{ item.name }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px">
          <a-button type="primary" @click="sumit">查询</a-button>
          <a-button style="margin-left: 8px">重置</a-button>
          <a @click="toggleAdvanced" style="margin-left: 8px">
            {{ advanced ? "收起" : "展开" }}
            <a-icon :type="advanced ? 'up' : 'down'" />
          </a>
        </span>
      </a-form>
    </div>


    
  </a-card>
   <a-card :bordered="false">
      <div style="display: flex; flex-wrap: wrap">
        <head-info
          title="当前条件下工单数"
          :content="analysisData.length"
          :bordered="true"
        />
        <!-- <head-info title="本周任务平均处理时间" content="32分钟" :bordered="true"/>
          <head-info title="本周完成任务数" content="24个"/> -->
      </div>
    </a-card>
    </div>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import HeadInfo from "../../components/tool/HeadInfo";
const columns = [
  {
    title: "规则编号",
    dataIndex: "no",
  },
  {
    title: "描述",
    dataIndex: "description",
    scopedSlots: { customRender: "description" },
  },
  {
    title: "服务调用次数",
    dataIndex: "callNo",
    sorter: true,
    needTotal: true,
    customRender: (text) => text + " 次",
  },
  {
    dataIndex: "status",
    needTotal: true,
    slots: { title: "statusTitle" },
  },
  {
    title: "更新时间",
    dataIndex: "updatedAt",
    sorter: true,
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];

const statusList = [
  { id: 0, name: "未开始" },
  { id: 1, name: "进行中" },
  { id: 2, name: "已完成" },
];
const dataSource = [];

for (let i = 0; i < 100; i++) {
  dataSource.push({
    key: i,
    no: "NO " + i,
    description: "这是一段描述",
    callNo: Math.floor(Math.random() * 1000),
    status: Math.floor(Math.random() * 10) % 4,
    updatedAt: "2018-07-26",
  });
}

export default {
  name: "QueryList",
    components: { StandardTable, HeadInfo },
  data() {
    return {
      advanced: true,
      status: statusList,
      yeardata: [],
      daydata: [],
      astatus: "",
      year: "",
      month: "",
      day: "",
      analysisData: [],
      monthdata: [],
      columns: columns,
      workerList: [],
      buildingNumList: [],
      dataSource: dataSource,
      selectedRows: [],
      building_num: "",
    };
  },
  created() {
    this.getWorkerList();
    this.baseDada();
  },
  authorize: {
    deleteRecord: "delete",
  },
  methods: {
    getBuildingNum(id) {
      this.building_num = id;
      console.log(id);
    },
    getStatus(id) {
      this.astatus = id;
      console.log(id);
    },
    getYear(id) {
      this.year = id;
      console.log(id);
    },
    getMonth(id) {
      this.month = id;
      console.log(id);
    },
    getDay(id) {
      this.day = id;
      console.log(id);
    },
    sumit() {
      var building_num = this.building_num;
      if (this.month != 0) {
        if (this.day == 0) {
          var gmt_create = this.year + "-" + this.month;
        }
        if (this.day != 0) {
          var gmt_create = this.year + "-" + this.month + "-" + this.day;
        }
      }
      if (this.month == 0) {
        var gmt_create = this.year;
      }
      var status = this.astatus;
      console.log(
        "building_num:" + building_num,
        "gmt_create:" + gmt_create,
        "status:" + status
      );
      this.$axios({
        method: "get",
        url: `http://116.62.33.39:14578/v1/queryWorkOrder`,
        params: { building_num, gmt_create, status },
      }).then((response) => {
        console.log(response.data);
        this.analysisData = response.data.data;
      });
    },

    baseDada() {
      var yeardata = {};
      for (var i = 2022; i < 2099; i++) {
        yeardata[i] = {};
        yeardata[i]["id"] = i;
        yeardata[i]["name"] = i + "年";
      }
      this.yeardata = yeardata;
      console.log(yeardata);

      var monthdata = {};
      for (var i = 0; i < 13; i++) {
        monthdata[i] = {};
        monthdata[i]["id"] = i == 0 ? 0 : i;
        monthdata[i]["name"] = i == 0 ? "整年" : i + "月";
        if (i < 10) {
          monthdata[i]["month"] = i == 0 ? 0 : "0" + i;
        }
        if (i >= 10) {
          monthdata[i]["month"] = i.toString();
        }
      }
      this.monthdata = monthdata;

      var daydata = {};
      for (var i = 0; i < 32; i++) {
        daydata[i] = {};
        daydata[i]["id"] = i == 0 ? 0 : i;
        daydata[i]["name"] = i == 0 ? "整月" : i + "日";
        if (i < 10) {
          daydata[i]["day"] = i == 0 ? 0 : "0" + i;
        }
        if (i >= 10) {
          daydata[i]["day"] = i.toString();
        }
      }
      this.daydata = daydata;
    },
    getWorkerList() {
      this.$axios({
        method: "get",
        url: `http://116.62.33.39:14578/worker`,
        params: { pageStart: 0, pageNum: 50 },
      }).then((response) => {
        this.workerList = response.data.data.workerMsg;

        console.log(response.data);
      });
    },
    nameChange(id) {
      this.buildingNumList = [];
      this.$axios({
        method: "get",
        url: `http://116.62.33.39:14578/worker/` + id + "/",
      }).then((response) => {
        var sVal = "全部 " + response.data.data.buildingNum;
        sVal = sVal.replace(/\s+/g, " ");
        sVal = sVal.replace(/(^\s*)|(\s*$)/g, "");
        var a = sVal.split(" ");
        var data = {};
        for (var i = 0; i < a.length; i++) {
          data[i] = {};
          if (a[i] == "全部") {
            if (a.length > 2) {
              var b = a[i + 1] + " " + a[i + 2];
            } else {
              var b = a[i + 1];
            }
          } else {
            var b = a[i];
          }

          data[i]["id"] = b;
          data[i]["text"] = a[i];
        }
        this.buildingNumList = data;
        console.log(this.buildingNumList);
      });

      console.log(id);
    },

    deleteRecord(key) {
      this.dataSource = this.dataSource.filter((item) => item.key !== key);
      this.selectedRows = this.selectedRows.filter((item) => item.key !== key);
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    remove() {
      this.dataSource = this.dataSource.filter(
        (item) =>
          this.selectedRows.findIndex((row) => row.key === item.key) === -1
      );
      this.selectedRows = [];
    },
    onClear() {
      this.$message.info("您清空了勾选的所有行");
    },
    onStatusTitleClick() {
      this.$message.info("你点击了状态栏表头");
    },
    onChange() {
      this.$message.info("表格状态改变了");
    },
    onSelectChange() {
      this.$message.info("选中行改变了");
    },
    addNew() {
      this.dataSource.unshift({
        key: this.dataSource.length,
        no: "NO " + this.dataSource.length,
        description: "这是一段描述",
        callNo: Math.floor(Math.random() * 1000),
        status: Math.floor(Math.random() * 10) % 4,
        updatedAt: "2018-07-26",
      });
    },
    handleMenuClick(e) {
      if (e.key === "delete") {
        this.remove();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
