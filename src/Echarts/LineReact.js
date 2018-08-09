import React from 'react'
import echarts from 'echarts/lib/echarts' //必须
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/grid'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/toolbox'

export default class LineReact extends React.Component {
  
  initPie = () => {
    const { option={} } = this.props; //外部传入的data数据
    let myChart = echarts.init(this.ID); //初始化echarts


    //设置options
    myChart.setOption(option)
    window.onresize = function() {
      myChart.resize()
    }
  }
  
  componentDidMount() {
    //alert(1);
    this.initPie()
  }
  
  componentDidUpdate() {
    //alert(2);
    this.initPie()
  }
  
  render() {
    const { width="100%", height="300px" } = this.props
    return <div ref={ID => this.ID = ID} style={{width, height}} id="line-chart"></div>
  }
}