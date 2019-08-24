<template>
  <div class="dashboard-index">

    <div class="row mt20">
      <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="text-block">
          <div class="upper">
            <div class="indicator">{{ $t('dashboard.totalInvokeNum') }}</div>
            <div class="amount">{{dashboard.totalInvokeNum}}</div>
            <div>
              <RatePanel :name="$t('dashboard.weekRate')" :standardValue="standardWeekInvokeNum"
                         :compareValue="compareWeekInvokeNum"/>
              <RatePanel :name="$t('dashboard.dayRate')" :standardValue="standardDayInvokeNum"
                         :compareValue="compareDayInvokeNum"/>
            </div>
          </div>
          <div class="lower">
            {{ $t('dashboard.yesterdayInvoke') }}:{{dashboard.invokeNum}}
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="text-block">
          <div class="upper">
            <div class="indicator">{{ $t('dashboard.totalUV') }}</div>
            <div class="amount">{{dashboard.totalUv}}</div>
            <div>
              <RatePanel :name="$t('dashboard.weekRate')" :standardValue="standardWeekUv"
                         :compareValue="compareWeekUv"/>
              <RatePanel :name="$t('dashboard.dayRate')" :standardValue="standardDayUv" :compareValue="compareDayUv"/>

            </div>
          </div>
          <div class="lower">
            {{ $t('dashboard.yesterdayUV') }}:{{dashboard.uv}}
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="text-block">
          <div class="upper">
            <div class="indicator">{{ $t('dashboard.totalMatterNum') }}</div>
            <div class="amount">{{dashboard.totalMatterNum}}</div>
            <div>
              <RatePanel :name="$t('dashboard.weekRate')" :standardValue="standardWeekMatterNum"
                         :compareValue="compareWeekMatterNum"/>
              <RatePanel :name="$t('dashboard.dayRate')" :standardValue="standardDayMatterNum"
                         :compareValue="compareDayMatterNum"/>

            </div>
          </div>
          <div class="lower">
            {{ $t('dashboard.yesterdayMatterNum') }}:{{dashboard.matterNum}}
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="text-block">
          <div class="upper">
            <div class="indicator">{{ $t('dashboard.totalFileSize') }}</div>
            <div class="amount">{{dashboard.totalFileSize | humanFileSize}}</div>
            <div>
              <RatePanel :name="$t('dashboard.weekRate')" :standardValue="standardWeekSize"
                         :compareValue="compareWeekSize"/>
              <RatePanel :name="$t('dashboard.dayRate')" :standardValue="standardDaySize"
                         :compareValue="compareDaySize"/>

            </div>
          </div>
          <div class="lower">
            {{ $t('dashboard.yesterdayMatterSize') }}:{{dashboard.fileSize | humanFileSize}}
          </div>
        </div>
      </div>
      <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="figure-block">
          <div class="title">
            {{ $t('dashboard.recentDayInvokeUV',[days]) }}
          </div>
          <figure>
            <ECharts
              ref="invokeListChart"
              theme="ovilia-green"
              :autoResize="true"
              :initOptions="initOptions"
              :options="invokeListOption"/>
          </figure>
        </div>
      </div>

      <div class="col-lg-6 col-md-6 col-sm-12">
        <div class="figure-block">
          <div class="title">
            {{ $t('dashboard.downloadMatterTop10') }}
          </div>
          <div class="list-rank">
            <ul>
              <li v-for="(matter,index) in matterPager.data">
                <span class="rank" :class="{top3:index<3}">{{index+1}}</span>
                <router-link class="name" :to="'/matter/detail/'+matter.uuid">{{matter.name}}</router-link>
                <span class="info">{{matter.times}}</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

      <div class="col-lg-6 col-md-6 col-sm-12">
        <div class="figure-block">
          <div class="title">
            {{ $t('dashboard.activeIpTop10') }}
          </div>
          <div class="list-rank">
            <ul>
              <li v-for="(item,index) in activeIpTop10">
                <span class="rank" :class="{top3:index<3}">{{index+1}}</span>
                <span class="name" :to="'/'">{{item.ip}}</span>
                <span class="info">{{item.times}}</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<script>

  import ECharts from 'vue-echarts/components/ECharts'

  import 'echarts/lib/chart/bar'
  import 'echarts/lib/chart/line'
  import 'echarts/lib/chart/pie'
  import 'echarts/lib/chart/map'
  import 'echarts/lib/chart/radar'
  import 'echarts/lib/chart/scatter'
  import 'echarts/lib/chart/effectScatter'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/polar'
  import 'echarts/lib/component/geo'
  import 'echarts/lib/component/legend'
  import 'echarts/lib/component/title'
  import 'echarts/lib/component/visualMap'
  import 'echarts/lib/component/dataset'
  import 'echarts/map/js/world'
  import 'zrender/lib/svg/svg'


  import theme from "./theme"

  import Dashboard from "../../model/dashboard/Dashboard";
  import Pager from "../../model/base/Pager";
  import {SortDirection} from "../../model/base/SortDirection";
  import {simpleDate} from "../../common/filter/time";
  import RatePanel from "./widget/RatePanel"
  import Matter from "../../model/matter/Matter";

  //自定义主题
  ECharts.registerTheme('ovilia-green', theme)

  export default {

    data: function () {
      return {
        days: 15,
        //用来存放日期的，辅助x轴的生成
        dateStrings: [],
        //昨天的统计情况
        dashboard: new Dashboard(),
        //调用量周环比
        standardWeekInvokeNum: 0,
        compareWeekInvokeNum: 0,
        //调用量日环比
        standardDayInvokeNum: 0,
        compareDayInvokeNum: 0,
        //UV周环比
        standardWeekUv: 0,
        compareWeekUv: 0,
        //UV日环比
        standardDayUv: 0,
        compareDayUv: 0,
        //文件总数周环比
        standardWeekMatterNum: 0,
        compareWeekMatterNum: 0,
        //文件总数日环比
        standardDayMatterNum: 0,
        compareDayMatterNum: 0,
        //文件大小周环比
        standardWeekSize: 0,
        compareWeekSize: 0,
        //文件大小日环比
        standardDaySize: 0,
        compareDaySize: 0,

        pager: new Pager(Dashboard, 15),
        matterPager: new Pager(Matter, 10),
        activeIpTop10: [],
        //图标加载中的样式
        loadingOption: {
          text: this.$t("dashboard.loading"),
          color: '#006699',
          maskColor: 'rgba(255, 255, 255, 0.4)'
        },
        initOptions: {
          renderer: 'canvas'
        },
        invokeListOption: {
          tooltip: {},
          legend: {
            data: ['PV', 'UV']
          },
          xAxis: {
            name: this.$t("dashboard.date"),
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
          },
          yAxis: {
            name: this.$t("dashboard.num")
          },
          series: [{
            name: 'PV',
            type: 'bar',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }, {
            name: 'UV',
            type: 'line',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }]
        }
      }
    },
    components: {
      ECharts,
      RatePanel
    },
    methods: {
      updateDateStrings() {
        let that = this;
        //更新横坐标 从昨天开始倒推
        let arr = []
        for (let d = that.days; d >= 1; d--) {
          let thenDate = new Date((new Date()).getTime() - d * 24 * 60 * 60 * 1000)
          arr.push(simpleDate(thenDate))
        }
        that.dateStrings = arr
      },
      //获取15日调用分时数据
      refreshDashboardPager() {
        let that = this;

        this.pager.setFilterValue("orderDt", SortDirection.DESC)

        that.$refs.invokeListChart.showLoading()
        this.pager.httpFastPage(function (response) {

          let list = that.pager.data

          if (list.length > 0) {
            that.dashboard.render(list[list.length - 1])
          }

          //数据转换成map，方便检索
          let map = {}
          for (let i = 0; i < list.length; i++) {
            map[list[i].dt] = list[i]
          }

          let invokeNumData = []
          let uvData = []
          let matterNumData = []
          let fileSizeData = []
          for (let i = 0; i < that.days; i++) {
            invokeNumData.push(0)
            uvData.push(0)
            matterNumData.push(0)
            fileSizeData.push(0)
          }

          //按照日期对应。
          for (let i = 0; i < that.dateStrings.length; i++) {
            let item = map[that.dateStrings[i]];
            if (item) {
              invokeNumData[i] = item.invokeNum
              uvData[i] = item.uv
              matterNumData[i] = item.matterNum
              fileSizeData[i] = item.fileSize

            }
          }

          //同环比
          that.standardWeekInvokeNum = 0
          that.compareWeekInvokeNum = 0
          //调用量日环比
          that.standardDayInvokeNum = 0
          that.compareDayInvokeNum = 0
          //UV周环比
          that.standardWeekUv = 0
          that.compareWeekUv = 0
          //UV日环比
          that.standardDayUv = 0
          that.compareDayUv = 0

          //文件总数周环比
          that.standardWeekMatterNum = 0
          that.compareWeekMatterNum = 0
          //文件总数日环比
          that.standardDayMatterNum = 0
          that.compareDayMatterNum = 0
          //文件大小周环比
          that.standardWeekSize = 0
          that.compareWeekSize = 0
          //文件大小日环比
          that.standardDaySize = 0
          that.compareDaySize = 0

          for (let i = 0; i < that.days; i++) {
            if (i >= 1 && i <= 7) {
              that.standardWeekInvokeNum += invokeNumData[i]
              that.standardWeekUv += uvData[i]
              that.standardWeekMatterNum += matterNumData[i]
              that.standardWeekSize += fileSizeData[i]

            } else if (i >= 8 && i <= 14) {
              that.compareWeekInvokeNum += invokeNumData[i]
              that.compareWeekUv += uvData[i]
              that.compareWeekMatterNum += matterNumData[i]
              that.compareWeekSize += fileSizeData[i]
            }
            if (i === 13) {
              that.standardDayInvokeNum = invokeNumData[i]
              that.standardDayUv = uvData[i]
              that.standardDayMatterNum = matterNumData[i]
              that.standardDaySize = fileSizeData[i]

            }
            if (i === 14) {
              that.compareDayInvokeNum = invokeNumData[i]
              that.compareDayUv = uvData[i]
              that.compareDayMatterNum = matterNumData[i]
              that.compareDaySize = fileSizeData[i]
            }
          }


          that.invokeListOption.xAxis.data = that.dateStrings.map((k) => k.substr(5))
          that.invokeListOption.series[0].data = invokeNumData
          that.invokeListOption.series[1].data = uvData


          that.$refs.invokeListChart.hideLoading()
        }, function () {

          that.$refs.invokeListChart.hideLoading()
        })

      },
      //获取下载前10的文件
      refreshMatterPager() {
        let that = this;
        that.matterPager.setFilterValue("orderTimes", SortDirection.DESC)
        that.matterPager.httpFastPage()
      },
      refreshActiveIpTop10() {
        let that = this
        that.dashboard.httpActiveIpTop10(function (response) {
          that.activeIpTop10 = response.data.data
        })
      }
    },
    mounted() {
      let that = this;
      this.updateDateStrings()
      this.refreshDashboardPager()
      this.refreshMatterPager()
      this.refreshActiveIpTop10()
    }
  }

</script>

<style lang="less" rel="stylesheet/less">
  @import "../../assets/css/global/variables";

  .dashboard-index {

    figure {
      .echarts {
        width: 100%;
        height: 300px;
      }
    }

    .text-block {
      background-color: white;
      box-shadow: 0 0 5px rgba(0, 0, 0, .2);
      border-radius: 5px;
      padding: 20px 15px 10px 15px;
      margin-bottom: 30px;

      .upper {

        .indicator {
          color: rgba(0, 0, 0, .45);
          font-size: 14px;
          line-height: 22px;
          height: 22px;
        }

        .amount {
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          white-space: nowrap;
          color: rgba(0, 0, 0, .85);
          margin-top: 4px;
          margin-bottom: 20px;
          font-size: 30px;
          line-height: 38px;
          height: 38px;

        }

        .rate {
          margin-right: 15px;
        }
      }

      .lower {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid #eee;
        font-size: 14px;
      }
    }

    .figure-block {
      background-color: white;
      box-shadow: 0 0 5px rgba(0, 0, 0, .2);
      border-radius: 5px;
      margin-bottom: 20px;

      .title {
        font-size: 18px;
        padding: 15px 20px;
        color: black;
        margin-bottom: 10px;
        border-bottom: 1px solid #eee;
      }

    }

    .list-rank {
      padding: 0 20px 10px 20px;

      ul {
        list-style: none;
        padding: 0;

        li {
          zoom: 1;
          margin-top: 16px;
          display: flex;
          align-items: center;

          .rank {
            border-radius: 20px;
            display: inline-block;
            font-size: 12px;
            font-weight: 600;
            margin-right: 16px;
            height: 20px;
            line-height: 20px;
            width: 20px;
            text-align: center;
            margin-top: 1.5px;

            background-color: #f5f5f5;

            &.top3 {
              background-color: #314659;
              color: #fff;
            }
          }

          .name {

            color: rgba(0, 0, 0, .65);
            font-size: 14px;
            line-height: 22px;
            flex: 1 1;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            margin-right: 8px;

            &:hover {
              color: @brand-primary;
            }
          }

          .info {
            color: rgba(0, 0, 0, .65);
            font-size: 14px;
            line-height: 22px;
          }
        }
      }

    }
  }
</style>
