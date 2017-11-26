import React from 'react';
import {MyTablePage} from "./myTable";
import { connect } from 'react-redux';
import asyncComponent from '../_helpers/AsyncComponent';
import { collectionActions } from '../_actions';

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';

const PieReact = asyncComponent(() => import(/* webpackChunkName: "PieReact" */'../Echarts/PieReact'));  //饼图组件

class WordCloudPage extends React.Component {

    state = {

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
            <div className="card mb-3">
                <div className="card-header">
                    <i className="fa fa-pie-chart"/> 相关词分布(暂不可用)</div>
                <div className="card-body">
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

const connectedWordCloudPage = connect(mapStateToProps)(WordCloudPage);
export { connectedWordCloudPage as WordCloudPage };

