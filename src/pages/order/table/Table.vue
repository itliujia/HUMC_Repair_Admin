<template>
  <div class="table">
    <a-card :bordered="false">
      <div style="display: flex; flex-wrap: wrap">
        <head-info title="当前工单总数" :content="total" :bordered="true" />
        <head-info
          v-for="(item, index) in statistical"
          :key="index"
          :title="
            item.status == 'NONE_WORK'
              ? '当前未开始工单总数'
              : item.status == 'DONG_WORK'
              ? '当前进行中工单总数'
              : '当前已完成工单总数'
          "
          :content="item.data.length"
        />
      </div>
    </a-card>
    <advance-table
      :columns="columns"
      :data-source="dataSource"
      title="工单列表"
      :loading="loading"
      rowKey="id"
      @search="onSearch"
      @refresh="onRefresh"
      :format-conditions="true"
      @reset="onReset"
      :pagination="{
        current: pageStart,
        pageNum: pageNum,
        total: total,
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
        onChange: onPageChange,
        onShowSizeChange: onSizeChange,
      }"
    >
      <template slot="statusTitle">
        状态<a-icon style="margin: 0 4px" type="info-circle" />
      </template>
      <template slot="send" slot-scope="{ text }">
        {{ text ? "是" : "否" }}
      </template>
      <template slot="status" slot-scope="{ text }">
        {{
          text == "NONE_WORK"
            ? "未开始"
            : text == "DONG_WORK"
            ? "进行中"
            : "已完成"
        }}
      </template>
    </advance-table>
    <!-- <api /> -->
  </div>
</template>

<script>
import AdvanceTable from "@/components/table/advance/AdvanceTable";
import { dataSource as ds } from "@/services";
import Api from "@/pages/components/table/Api";
import HeadInfo from "@/components/tool/HeadInfo";

export default {
  name: "Table",
  components: { Api, AdvanceTable, HeadInfo },
  filters: {
    statusStr(val) {
      switch (val) {
        case 1:
          return "已下单";
        case 2:
          return "已付款";
        case 3:
          return "已审核";
        case 4:
          return "已发货";
      }
    },
  },
  data() {
    return {
      loading: false,
      pageStart: 1,
      pageNum: 10,
      total: '',
      statistical: [],
      columns: [
        {
          title: "学/工号",
          dataIndex: "launchId",
        },
        {
          title: "身份",
          dataIndex: "launchRole",
          customRender: (text) => (text == 1 ? "学生" : "教师"),
        },
        {
          title: "手机号",
          dataIndex: "launchTel",
        },
        {
          title: "宿舍楼",
          dataIndex: "buildingNum",
          customRender: (text) => text + "号楼",
        },
        {
          title: "房间",
          dataIndex: "dormNum",
        },
        {
          title: "故障内容",
          dataIndex: "contentId",
        },
        {
          title: "发起时间",
          dataIndex: "gmtCreate",
        },
        {
          dataIndex: "status",
          title: "状态",
          scopedSlots: { customRender: "status" },
          // search: {
          //   selectOptions: [
          //     {title: '未开始', value: 'NONE_WORK'},
          //     {title: '已付款', value: 2},
          //     {title: '已审核', value: 3},
          //     {title: '已发货', value: 4}
          //   ]
          // }
        },
        {
          title: "紧急程度",
          dataIndex: "degree",
          customRender: (text) => (text == 'GeneralDegree' ? "一般" : "加急"),
        },
        {
          title: "开始时间",
          dataIndex: "startTime",
        },
        {
          title: "结束时间",
          dataIndex: "endTime",
        },
      ],
      dataSource: [],
      conditions: {},
    };
  },
  created() {
    this.getGoodList();
    // this.getColumns()
  },
  methods: {
    getNum() {
      this.$axios({
        method: "get",
        url: `http://116.62.33.39:14578/workOrder`,
        params: { pageStart: 0, pageNum: this.total },
      }).then((response) => {
        this.statistical = this.getArrWithKey(
          response.data.data.workerOrderMsg,
          "status"
        );
      });
    },

    getArrWithKey(originalArr, field) {
      let tempArr = [];
      let endData = [];
      for (let i = 0; i < originalArr.length; i++) {
        if (tempArr.indexOf(originalArr[i][field]) === -1) {
          endData.push({
            [field]: originalArr[i][field],
            data: [originalArr[i]],
          });
          tempArr.push(originalArr[i][field]);
        } else {
          for (let j = 0; j < endData.length; j++) {
            if (endData[j][field] == originalArr[i][field]) {
              endData[j].data.push(originalArr[i]);
              break;
            }
          }
        }
      }
      return endData; // 最终输出
    },

    getGoodList() {
      this.loading = true;
      const { pageStart, pageNum, conditions } = this;
      ds.goodsList({ pageStart, pageNum, ...conditions }).then((result) => {
        const { workerOrderMsg, pages, total } = result.data.data;
        this.dataSource = workerOrderMsg.reverse();
        console.log(this.dataSource);
        this.total = parseInt(total);
        this.getNum();
        this.loading = false;
      });
    },
    // getColumns() {
    //   ds.goodsColumns().then(res => {
    //     this.columns = res.data
    //   })
    // },
    onSearch(conditions, searchOptions) {
      console.log(searchOptions);
      this.pageStart = 1;
      this.conditions = conditions;
      this.getGoodList();
    },
    onSizeChange(current, size) {
      this.pageStart = 1;
      this.pageNum = size;
      this.getGoodList();
    },
    onRefresh(conditions) {
      this.conditions = conditions;
      this.getGoodList();
    },
    onReset(conditions) {
      this.conditions = conditions;
      this.getGoodList();
    },
    onPageChange(pageStart, pageNum) {
      this.pageStart = pageStart;
      this.pageNum = pageNum;
      this.getGoodList();
    },
  },
};
</script>

<style scoped lang="less">
.table {
  background-color: @base-bg-color;
  padding: 24px;
}
</style>