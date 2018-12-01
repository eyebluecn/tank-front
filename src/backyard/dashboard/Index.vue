<template>
  <div class="dashboard-index">
    <div>
      <div class="pedia-navigation">
        <span class="item active">大盘监控</span>
      </div>
    </div>
    <div class="row mt20">
      <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="text-block">
          <div class="upper">
            <div class="indicator">总访问量</div>
            <div class="amount">1265345</div>
            <div>
              <span class="rate">周同比 12% <i class="fa fa-caret-down text-success"></i></span>
              <span class="rate">日同比 11% <i class="fa fa-caret-up text-danger"></i></span>
            </div>
          </div>
          <div class="lower">
            昨日访问量：13456
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="text-block">
          <div class="upper">
            <div class="indicator">总访问IP</div>
            <div class="amount">1265345</div>
            <div>
              <span class="rate">周同比 12% <i class="fa fa-caret-down text-success"></i></span>
              <span class="rate">日同比 11% <i class="fa fa-caret-up text-danger"></i></span>
            </div>
          </div>
          <div class="lower">
            昨日访IP：13456
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="text-block">
          <div class="upper">
            <div class="indicator">文件总数</div>
            <div class="amount">1265345</div>
            <div>
              <span class="rate">周同比 12% <i class="fa fa-caret-down text-success"></i></span>
              <span class="rate">日同比 11% <i class="fa fa-caret-up text-danger"></i></span>
            </div>
          </div>
          <div class="lower">
            昨日新增文件数：13456
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="text-block">
          <div class="upper">
            <div class="indicator">文件总大小(包括缓存)</div>
            <div class="amount">1265345 G</div>
            <div>
              <span class="rate">周同比 12% <i class="fa fa-caret-down text-success"></i></span>
              <span class="rate">日同比 11% <i class="fa fa-caret-up text-danger"></i></span>
            </div>
          </div>
          <div class="lower">
            昨日新增文件数：13456
          </div>
        </div>
      </div>
      <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="figure-block">
          <div class="title">
            最近15日调用量/UV
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
            文件下载量TOP10
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
            活跃用户TOP10
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

  import Dashboard from "../../common/model/dashboard/Dashboard";

  //自定义主题
  ECharts.registerTheme('ovilia-green', theme)


  export default {

    data: function () {
      return {
        dashboard: new Dashboard(),
        //图标加载中的样式
        loadingOption: {
          text: '加载中…',
          color: '#006699',
          maskColor: 'rgba(255, 255, 255, 0.4)'
        },
        initOptions: {
          renderer: 'canvas'
        },
        invokeListOption: {
          tooltip: {},
          legend: {
            data: ['调用量', 'UV']
          },
          xAxis: {
            name: "日期",
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
          },
          yAxis: {
            name: "数量"
          },
          series: [{
            name: '调用量',
            type: 'bar',
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
          }, {
            name: 'UV',
            type: 'line',
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
          }]
        }
      }
    },
    components: {
      ECharts
    },
    methods: {
      //获取七日调用分时数据
      refreshInvokeList() {
        let that = this;

        that.$refs.invokeListChart.showLoading()
        this.dashboard.httpInvokeList(function (response) {
          let list = response.data.data
          //按照日期依次排序
          list.sort((k1, k2) => k1.dt > k2.dt ? 1 : -1)
          that.invokeListOption.xAxis.data = list.map((k) => k.dt.substr(5))
          that.invokeListOption.series[0].data = list.map((k) => k.invokeNum)
          that.invokeListOption.series[1].data = list.map((k) => k.uv)
          that.$refs.invokeListChart.hideLoading()
        }, function (errorMessage) {
          that.$refs.invokeListChart.hideLoading()
        });

      }
    },
    mounted() {
      let that = this;
      this.refreshInvokeList()
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

  }
</style>
