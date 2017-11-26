import React from 'react';
import {MyTablePage} from "./myTable";
import { connect } from 'react-redux';
import asyncComponent from '../_helpers/AsyncComponent';
import { collectionActions } from '../_actions';

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';

const MapReact = asyncComponent(() => import(/* webpackChunkName: "MapReact" */'../Echarts/MapReact'));  //地图组件

class MapPage extends React.Component {

    state = {
        backgroundColor: '#404a59',
        tooltip : {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            top: 'bottom',
            left: 'right',
            textStyle: {
                color: '#fff'
            },
            selectedMode: 'single'
        },
        geo: {
            map: 'china',
            label: {
                emphasis: {
                    show: false
                }
            },
            roam: false,
            itemStyle: {
                normal: {
                    areaColor: '#323c48',
                    borderColor: '#404a59'
                },
                emphasis: {
                    areaColor: '#2a333d'
                }
            }
        },
        series: [],
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {
                    show:true,
                    excludeComponents :['toolbox'],
                    pixelRatio: 2,
                    title:'导出',
                }
            }
        }
    };

    componentDidMount(){

        const { currentKwd } = this.props;
        if (currentKwd !== undefined) {
            // post到服务器
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
            <div className="col-md-12">
                <div className="card mb-3">
                    <div className="card-header">
                        <i className="fa fa-pie-chart"/> 地域分布</div>
                    <div className="card-body">
                        <MapReact option={this.state}/>
                    </div>
                    <div className="card-body py-2 small">
                        <a className="mr-3 d-inline-block" href="javascript:void(0);" onClick={(event)=>this.collection(event, this.state, "region")}>
                            <i className="fa fa-star-o" id={"dataSource"}> 收藏</i>
                        </a>
                        <a className="d-inline-block" href="javascript:void(0);"><i className="fa fa-send-o"> 发送</i></a>
                    </div>
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

const connectedMapPage = connect(mapStateToProps)(MapPage);
export { connectedMapPage as MapPage };

