import React from 'react';
import { connect } from 'react-redux';
import {ShowPicPage} from "./ShowPicPage";


// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';


class DataDistributionPage extends React.Component {

    state = {
        title : {
            text: '关键字数据源',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['新闻','微博','论坛','贴吧']
        },
        series : [
            {
                name: '来源',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'新闻'},
                    {value:310, name:'微博'},
                    {value:234, name:'论坛'},
                    {value:135, name:'贴吧'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ],
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {
                    show:true,
                    excludeComponents :['toolbox'],
                    pixelRatio: 2,
                    title:'导出'
                }
            }
        }
    };

    componentDidMount(){

        const { currentKwd } = this.props;
        if (currentKwd !== undefined) {
            // post到服务器
            // 更新state中的内容
        }
    }



    render() {
        return (
            <ShowPicPage data={this.state} type={'pie'} title={'数据源分布'}/>
        );
    }
}


function mapStateToProps(state, ownProps) {
    const { authentication } = state;
    const { user } = authentication;
    const { currentKwd } = ownProps;
    return {
        user, currentKwd
    };
}

const connectedDataDistributionPage = connect(mapStateToProps)(DataDistributionPage);
export { connectedDataDistributionPage as DataDistributionPage };

