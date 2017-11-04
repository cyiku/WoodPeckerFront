import React from 'react';

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';

import asyncComponent from '../_helpers/AsyncComponent';
import { publishNumOption } from '../_helpers/options';
const LineReact = asyncComponent(() => import(/* webpackChunkName: "LineReact" */'../Echarts/LineReact')); //折线图组件

class CollectionChartsPage extends React.Component {


    render() {
        return (
            <div className="content-wrapper" style={{marginLeft:0}}>
                <div className="container-fluid">
                    {/*关键词展示*/}
                    <div>
                        <button type="button" className="btn btn-primary" style={{marginLeft:10}}>折线图</button>
                        <button type="button" className="btn btn-secondary" style={{marginLeft:10}}>饼图</button>
                        <button type="button" className="btn btn-secondary" style={{marginLeft:10}}>地域图</button>
                        <button type="button" className="btn btn-secondary" style={{marginLeft:10}}>表格</button>
                    </div>
                    {/*两个折线图*/}
                    <div className="row" style={{marginTop:20}}>
                        {/*数据源分布*/}
                        <div className="col-md-6">
                            <div className="card mb-3">
                                <div className="card-header">
                                    <i className="fa fa-area-chart"/>折线图1, 收藏于: <i className="text-muted ng-binding">2017-10-29</i></div>
                                <div className="card-body">
                                    <LineReact option={publishNumOption}/>
                                </div>
                                <div className="card-body py-2 small">
                                    <a href=" " title="发送"><i className="fa fa-fw fa-send"/>发送</a>
                                    <a href=" " title="导出" style={{marginLeft:10}}><i className="fa fa-fw fa-share"/>导出</a>
                                    <a href=" " title="删除" style={{marginLeft:10}}><i className="fa fa-trash-o"/>删除</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export { CollectionChartsPage };
