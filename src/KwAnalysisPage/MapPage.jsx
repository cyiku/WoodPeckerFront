import React from 'react';
import { connect } from 'react-redux';
import asyncComponent from '../_helpers/AsyncComponent';
import { collectionActions } from '../_actions';
import {ShowPicPage} from "./ShowPicPage";

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
                <ShowPicPage data={this.state} type={'map'} title={'地域分布'}/>
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

