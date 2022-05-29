<template>
  <page-layout :avatar="currUser.avatar">
    <div slot="headerContent">
      <div class="title">
        {{ welcome.timeFix[lang] }}，{{ currUser.name }}，{{
          welcome.message[lang]
        }}
      </div>
      <div>{{ currUser.position[lang] }}</div>
    </div>

    <template>
      <a-row style="margin: 0 -12px">
        <a-col
          style="padding: 0 12px"
          :xl="16"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24"
        >
          <a-card :loading="loading" title="报修动态" :bordered="false">
          <a slot="extra" href="#/order/list">More</a>
            <a-list>
              <a-list-item
                :key="index"
                v-for="(item, index) in workerOrderList"
              >
                <a-list-item-meta>
                  <div slot="title">
                    <a-tag color="orange">
                      {{ item.buildingNum }}</a-tag
                    > 号宿舍楼  <a-tag color="green">
                      {{ item.dormNum }} </a-tag
                    > 房间 <a-tag color="red">
                      {{ item.contentId }}
                    </a-tag>
                  </div>
                  <div slot="description">{{ item.gmtCreate }}</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
        <a-col
          style="padding: 0 12px"
          :xl="8"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24"
        >
          <a-card
            :title="$t('access')"
            style="margin-bottom: 24px"
            :bordered="false"
            :body-style="{ padding: 0 }"
          >
            <div class="item-group">
              <a>操作一</a>
              <a>操作二</a>
              <a>操作三</a>
              <a>操作四</a>
              <a>操作五</a>
              <a>操作六</a>
              <a-button size="small" type="primary" ghost icon="plus">{{
                $t("add")
              }}</a-button>
            </div>
          </a-card>

          <a-card :loading="loading" title="技术团队" :bordered="false">
            <div class="members">
              <a-row>
                <a-col :span="12" v-for="(item, index) in teams" :key="index">
                  <a>
                    <span class="member" style="font-size:12px">{{ item.name }}</span>
                  </a>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </template>
  </page-layout>
</template>

<script>
import PageLayout from "@/layouts/PageLayout";
import HeadInfo from "@/components/tool/HeadInfo";
import Radar from "@/components/chart/Radar";
import { mapState } from "vuex";
import { request, METHOD } from "@/utils/request";

export default {
  name: "WorkPlace",
  components: { Radar, HeadInfo, PageLayout },
  i18n: require("./i18n"),
  data() {
    return {
      projects: [],
      loading: true,
      activities: [],
      teams: [],
      workerOrderList: [],
      welcome: {
        timeFix: "",
        message: "",
      },
    };
  },
  computed: {
    ...mapState("account", { currUser: "user" }),
    ...mapState("setting", ["lang"]),
  },
  created() {
    this.getList();
    request("/user/welcome", METHOD.GET).then(
      (res) => (this.welcome = res.data)
    );
    request("/work/activity", METHOD.GET).then(
      (res) => (this.activities = res.data)
    );
    request("/work/team", METHOD.GET).then((res) => (this.teams = res.data));
    request("/project", METHOD.GET).then((res) => {
      this.projects = res.data;
      this.loading = false;
    });
  },
  methods: {
    getList() {
      this.$axios({
        method: "get",
        url: `http://116.62.33.39:14578/workOrder`,
        params: { pageStart: 1, pageNum: 6 },
      }).then((response) => {
        console.log(response.data);
        this.workerOrderList = response.data.data.workerOrderMsg.reverse();
      });
    },
  },
};
</script>

<style lang="less">
@import "index";
</style>
