import React from 'react'
import echarts from 'echarts/lib/echarts' //必须
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts-wordcloud'
import 'echarts/lib/component/toolbox'

export default class WordcloudReact extends React.Component {


    state = {
        title: {
            text: title,
            textStyle: {
                fontSize: 26,
                fontFamily: 'Helvetica',
                fontWeight: 400
            },
            left: 'center',
            top: 20
        },
        toolbox: {
            feature: {
                saveAsImage: {},
                dataView: {}
            },
            right: 20,
            top: 20
        },
        series: [{
            // 设置图表类型为'wordCloud'
            type: 'wordCloud',
            // 设置cloud的形状
            shape: 'cardioid',
            // shape: 'pentagon',
            // shape: 'circle',
            left: 'center',
            top: 30,
            width: '75%',
            height: '80%',
            // 设置字符字体大小的范围
            sizeRange: [12, 75],
            // 设置字符旋转的角度范围
            rotationRange: [-90, 90],
            rotationStep: 45,
            // 字符间距
            gridSize: 8,
            // 字符字体样式
            textStyle: {
                normal: {
                    fontFamily: 'Microsoft Yahei',
                    fontWeight: 'bold',
                    // 字符字体颜色用一个函数随机设置
                    color: function() {
                        return 'rgb(' + [
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160)
                        ].join(',') + ')'
                    }
                },
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            // data必选包含name和value选项,name即为显示的字符，value越大字符字体大小越大
            data: [{
                name: '',
                value: 10,
                textStyle: {
                    normal: {},
                    emphasis: {}
                }
            },]
        }]
    }

    constructor(props) {
        super(props);
        this.initWordcloud = this.initWordcloud.bind(this)
    }

    initWordcloud() {
        const { option={} } = this.props //外部传入的data数据
        let myChart = echarts.init(this.ID) //初始化echarts

        //设置options
        myChart.setOption(option)
        window.onresize = function() {
            myChart.resize()
        }
    }

    componentDidMount() {
        this.initPie()
    }

    componentDidUpdate() {
        this.initPie()
    }

    render() {
        const { width="100%", height = '300px' } = this.props
        return <div ref={ID => this.ID = ID} style={{width, height}}></div>
    }
}