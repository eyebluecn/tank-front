<template>
  <div class="dashboard-index">
    <div class="row">
      <div class="col-md-6">
        <div class="pedia-navigation">
          <span class="item active">网站偏好</span>
        </div>
        <ECharts
          ref="invokeListChart"
          theme="ovilia-green"
          auto-resize
          :initOptions="initOptions"
          :options="invokeListOption"/>
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
            data: [1, 2, 3, 4, 5, 6, 7]
          },
          yAxis: {
            name: "数量"
          },
          series: [{
            name: '调用量',
            type: 'bar',
            data: [1, 2, 3, 4, 5, 6, 7]
          }, {
            name: 'UV',
            type: 'line',
            data: [1, 2, 3, 4, 5, 6, 7]
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

      this.refreshInvokeList()

    }
  }

</script>

<style lang="less" rel="stylesheet/less">
  @import "../../assets/css/global/variables";

  .dashboard-index {

  }
</style>
