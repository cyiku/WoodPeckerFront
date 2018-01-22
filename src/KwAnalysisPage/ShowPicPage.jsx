import React from 'react';
import { Card } from 'antd';
import { connect } from 'react-redux';
import asyncComponent from '../_helpers/AsyncComponent';
import { collectionActions } from '../_actions';


const PieReact = asyncComponent(() => import(/* webpackChunkName: "PieReact" */'../Echarts/PieReact'));  //饼图组件
const MapReact = asyncComponent(() => import(/* webpackChunkName: "MapReact" */'../Echarts/MapReact'));  //地图组件
const LineReact = asyncComponent(() => import(/* webpackChunkName: "LineReact" */'../Echarts/LineReact')); //折线图组件

class ShowPicPage extends React.Component {


    collection = (event, data, type) => {
        const {user, dispatch} = this.props;

        let icon = document.getElementById("collection");
        if (icon.getAttribute("class") === "fa fa-star-o") {
            // 收藏
            icon.setAttribute("class", "fa fa-star");

            console.log(data);
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
        const {data, type, title} = this.props;
        let showChart;
        if (type === 'pie')
            showChart = <PieReact option={data}/>;
        else if (type === 'line')
            showChart = <LineReact option={data}/>;
        else if (type === 'map')
            showChart = <MapReact option={data}/>;
        else
            showChart = "暂无数据, 抱歉!";

        return (
        <Card title={title}>
            {showChart}
        </Card>
        );
    }
}


function mapStateToProps(state, ownProps) {
    const { data, type, title } = ownProps;
    const { authentication } = state;
    const { user } = authentication;
    return {
        user, data, type, title
    };
}

const connectedShowPicPage = connect(mapStateToProps)(ShowPicPage);
export { connectedShowPicPage as ShowPicPage };

