import React from 'react';
import {MyTablePage} from "./myTable";
import { connect } from 'react-redux';
import asyncComponent from '../_helpers/AsyncComponent';
import { collectionActions } from '../_actions';

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';

const PieReact = asyncComponent(() => import(/* webpackChunkName: "PieReact" */'../Echarts/PieReact'));  //饼图组件

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

    collection = (event, data, id, type) => {
        const {user, dispatch} = this.props;

        let icon = document.getElementById(id);
        if (icon.getAttribute("class") === "fa fa-star-o") {
            // 收藏
            icon.setAttribute("class", "fa fa-star");

            dispatch(collectionActions.addCollection(user, data, type));

            if (icon.innerHTML !== "") {
                icon.innerHTML = " 取消收藏";
            }
        } else {
            // 取消收藏
            icon.setAttribute("class", "fa fa-star-o");

            dispatch(collectionActions.delCollection(user, data.id, type));

            if (icon.innerHTML !== "") {
                icon.innerHTML = " 收藏";
            }
        }
    };


    render() {
        return (
            <div className="card mb-3">
                <div className="card-header">
                    <i className="fa fa-pie-chart"/> 数据源分布</div>
                <div className="card-body">
                    <PieReact option={this.state}/>
                </div>
                <div className="card-body py-2 small">
                    <a className="mr-3 d-inline-block" href="javascript:void(0);" onClick={(event)=>this.collection(event, this.state, "dataSource")}>
                        <i className="fa fa-star-o" id={"dataSource"}> 收藏</i>
                    </a>
                    <a className="d-inline-block" href="javascript:void(0);"><i className="fa fa-send-o"> 发送</i></a>
                </div>
            </div>
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

