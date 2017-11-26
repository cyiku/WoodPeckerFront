import React from 'react';

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';
import {CollectionTablePage} from "./CollectionTablePage";

import asyncComponent from '../_helpers/AsyncComponent';
import { publishNumOption } from '../_helpers/options';
const LineReact = asyncComponent(() => import(/* webpackChunkName: "LineReact" */'../Echarts/LineReact')); //折线图组件

class CollectionChartsPage extends React.Component {



    clickChart = (event) => {
        /*
        let targets = document.getElementsByClassName("chart");
        for (let i = 0; i < targets.length; ++i) {
            targets[i].setAttribute("class", "btn btn-secondary chart");
        }
        event.target.setAttribute("class", "btn btn-primary chart");
        */
    };

    render() {
        return (
            <div className="content-wrapper" style={{marginLeft:0}}>
                <div className="container-fluid">
                    {/*关键词展示*/}
                    <div>
                        <a className={"btn btn-primary"} style={{marginLeft:10}} href={'#line'}>折线图</a>
                        <a className={"btn btn-primary"} style={{marginLeft:10}} href={'#pie'}>饼图</a>
                        <a className={"btn btn-primary"} style={{marginLeft:10}} href={'#region'}>地域图</a>
                        <a className={"btn btn-primary"} style={{marginLeft:10}} href={'#table'}>表格</a>
                    </div>

                    {/*折线图*/}
                    <div className="row" style={{marginTop:20}} id={'line'}>
                        <div className="col-md-6">
                            <div className="card mb-3">
                                <div className="card-header">
                                    <i className="fa fa-area-chart"/>折线图1, 收藏于: <i className="text-muted ng-binding">2017-10-29</i></div>
                                <div className="card-body">
                                    <LineReact option={publishNumOption}/>
                                </div>
                                <div className="card-body py-2 small">
                                    <a href=" " title="发送" className="mr-3 d-inline-block"><i className="fa fa-fw fa-send-o"/>发送</a>
                                    <a href=" " title="删除" className="d-inline-block"><i className="fa fa-trash-o"/>删除</a>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="card mb-3">
                                <div className="card-header">
                                    <i className="fa fa-area-chart"/>折线图1, 收藏于: <i className="text-muted ng-binding">2017-10-29</i></div>
                                <div className="card-body">
                                    <LineReact option={publishNumOption}/>
                                </div>
                                <div className="card-body py-2 small">
                                    <a href=" " title="发送" className="mr-3 d-inline-block"><i className="fa fa-fw fa-send-o"/>发送</a>
                                    <a href=" " title="删除" className="d-inline-block"><i className="fa fa-trash-o"/>删除</a>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="card mb-3">
                                <div className="card-header">
                                    <i className="fa fa-area-chart"/>折线图1, 收藏于: <i className="text-muted ng-binding">2017-10-29</i></div>
                                <div className="card-body">
                                    <LineReact option={publishNumOption}/>
                                </div>
                                <div className="card-body py-2 small">
                                    <a href=" " title="发送" className="mr-3 d-inline-block"><i className="fa fa-fw fa-send-o"/>发送</a>
                                    <a href=" " title="删除" className="d-inline-block"><i className="fa fa-trash-o"/>删除</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row" style={{marginTop:20}} id={'pie'}>
                    <div className="col-md-6">

                    </div>
                </div>

                <div className="row" style={{marginTop:20}} id={'region'}>
                    {/*数据源分布*/}
                    <div className="col-md-6">

                    </div>
                </div>


                <div className="row" style={{marginTop:20}} id={'table'}>
                    {/*数据源分布*/}
                    <CollectionTablePage/>
                </div>
            </div>
        );
    }
}

export { CollectionChartsPage };
