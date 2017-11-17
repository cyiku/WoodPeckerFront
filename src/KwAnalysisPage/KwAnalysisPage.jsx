import React from 'react';
import { Table } from 'antd';
import { CSVLink } from 'react-csv';
import { collectionActions } from '../_actions';
import { connect } from 'react-redux';

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';


import asyncComponent from '../_helpers/AsyncComponent';


import { publishNumOption, emotionNumOption, pieOption, mapOption } from '../_helpers/options'

const LineReact = asyncComponent(() => import(/* webpackChunkName: "LineReact" */'../Echarts/LineReact')); //折线图组件
const PieReact = asyncComponent(() => import(/* webpackChunkName: "PieReact" */'../Echarts/PieReact'));  //饼图组件
const MapReact = asyncComponent(() => import(/* webpackChunkName: "MapReact" */'../Echarts/MapReact'));  //地图组件


class KwAnalysisPage extends React.Component {


    state = {
        weiboColumns: [
            {title: '发布者', dataIndex: 'publisher'},
            {title: '正文', dataIndex: 'content', sorter: (a, b) => a.content.length - b.content.length,},
            {title: '点赞量', dataIndex: 'likeNum', sorter: (a, b) => a.likeNum - b.likeNum,},
            {title: '评论量', dataIndex: 'commentNum', sorter: (a, b) => a.commentNum - b.commentNum,},
            {title: '转发量', dataIndex: 'transferNum', sorter: (a, b) => a.transferNum - b.transferNum,},
            {title: '发表时间', dataIndex: 'publishTime', sorter: (a, b) => a.publishTime.length - b.publishTime.length,},
            {title: '关键字', dataIndex: 'keyword'},
            {title: '源地址', dataIndex: 'source'},
            {title: '正负面', dataIndex: 'sentiment'},
            {title: '操作', key: 'action', render: (record) => (
                <span>
                    <a href="#" onClick={event => this.collection(event, this.objToJSON(record), record.id, "weibo")}><i className="fa fa-star-o" id={record.id}/></a>
                    <CSVLink data={this.objToJSON(record)}
                             filename={new Date().toLocaleString()}
                             target="_blank"
                             title="导出">
                        <i className="fa fa-fw fa-share-square-o"/>
                    </CSVLink>
                    <a href=" " title="发送"><i className="fa fa-fw fa-send-o"/></a>
                </span>
            )},

        ],
        weiboData: [
            {'publisher': 'oyyw', 'content': '哈哈哈', 'likeNum': 20, 'commentNum': 30, 'transferNum': 40, 'publishTime':'2016-10-20', 'keyword': '成考', 'source': 'www.baidu.com','sentiment':'正', 'id': 0},
            {'publisher': 'oyyyw', 'content': '哈哈哈嗝', 'likeNum': 40, 'commentNum': 60, 'transferNum': 70, 'publishTime':'2016-10-20', 'keyword': '成考', 'source': 'www.baidu.com', 'sentiment':'负', 'id': 1}
        ],
        searchedWeibo: [
            {'publisher': 'oyyw', 'content': '哈哈哈', 'likeNum': 20, 'commentNum': 30, 'transferNum': 40, 'publishTime':'2016-10-20', 'keyword': '成考', 'source': 'www.baidu.com','sentiment':'正', 'id': 0},
            {'publisher': 'oyyyw', 'content': '哈哈哈哈嗝', 'likeNum': 40, 'commentNum': 60, 'transferNum': 70, 'publishTime':'2016-10-20', 'keyword': '成考', 'source': 'www.baidu.com', 'sentiment':'负', 'id': 1}
        ],
        searchWeiboContent: ""

    };

    componentDidMount(){

    }

    objToJSON = (record) => {
        let str = JSON.stringify([record]); // object list to str
        return JSON.parse(str);   // str to json
    };

    clickKeyword = (event) => {
        let targets = document.getElementsByClassName("keyword");
        for (let i = 0; i < targets.length; ++i) {
            targets[i].setAttribute("class", "btn btn-secondary keyword");
        }
        event.target.setAttribute("class", "btn btn-primary keyword");
    };

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


    searchWeibo = () => {
        let searchedWeibo = [];
        for (let i = 0; i < this.state.weiboData.length; ++i) {
            if (this.state.weiboData[i]['content'].indexOf(this.state.searchWeiboContent) !== -1) {
                searchedWeibo.push(this.state.weiboData[i]);
            }
        }
        this.setState(
            preState => ({
                ...preState,
                searchedWeibo: searchedWeibo
            })
        );
    };

    handlechange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    render() {
        return (
            <div className="content-wrapper" style={{marginLeft:0}}>
                <div className="container-fluid">
                    {/*关键词展示*/}
                    <div>
                        <button type="button" className="btn btn-primary keyword" onClick={this.clickKeyword}>成考</button>
                        <button type="button" className="btn btn-secondary keyword" onClick={this.clickKeyword}>作弊</button>
                        <button type="button" className="btn btn-secondary keyword" onClick={this.clickKeyword}>答案</button>
                    </div>
                    {/*不同来源数量展示*/}
                    <div className="row" style={{marginTop:15}}>

                        <div className="col-xl-3 col-sm-6 mb-3" >
                            <div className="card text-white bg-warning o-hidden h-100">
                                <div className="card-body">
                                    <div className="card-body-icon">
                                        <i className="fa fa-fw fa-file"/>
                                    </div>
                                    <div className="mr-5">新闻类：26条</div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-3 col-sm-6 mb-3" >
                            <div className="card text-white bg-primary o-hidden h-100">
                                <div className="card-body">
                                    <div className="card-body-icon">
                                        <i className="fa fa-fw fa-weibo"/>
                                    </div>
                                    <div className="mr-5">微博类：26条</div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-3 col-sm-6 mb-3" >
                            <div className="card text-white bg-secondary o-hidden h-100">
                                <div className="card-body">
                                    <div className="card-body-icon">
                                        <i className="fa fa-fw fa-comments-o"/>
                                    </div>
                                    <div className="mr-5">论坛类：26条</div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-3 col-sm-6 mb-3" >
                            <div className="card text-white bg-success o-hidden h-100">
                                <div className="card-body">
                                    <div className="card-body-icon">
                                        <i className="fa fa-fw fa-child"/>
                                    </div>
                                    <div className="mr-5">贴吧类：26条</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*两个折线图*/}
                    <div className="row">

                        <div className="col-md-6">
                            <div className="card mb-3">
                                <div className="card-header">
                                    <i className="fa fa-line-chart"/> 发布量折线图</div>
                                <div className="card-body">
                                    <LineReact option={publishNumOption}/>
                                </div>
                                <div className="card-body py-2 small">
                                    <a className="mr-3 d-inline-block" href="#" onClick={(event)=>this.collection(event, publishNumOption, "publish")}>
                                        <i className="fa fa-star-o" id={"publish"}> 收藏</i>
                                    </a>
                                    <a className="d-inline-block" href="#"><i className="fa fa-send-o"> 发送</i></a>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="card mb-3">
                                <div className="card-header">
                                    <i className="fa fa-line-chart"/> 情感分析图</div>
                                <div className="card-body">
                                    <LineReact option={emotionNumOption}/>
                                </div>
                                <div className="card-body py-2 small">
                                    <a className="mr-3 d-inline-block" href="#" onClick={(event)=>this.collection(event, emotionNumOption, "emotion")}>
                                        <i className="fa fa-star-o" id={"emotion"}> 收藏</i>
                                    </a>
                                    <a className="d-inline-block" href="#"><i className="fa fa-send-o"> 发送</i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*数据源分布与相关词分布*/}
                    <div className="row">
                        {/*数据源分布*/}
                        <div className="col-md-6">
                            <div className="card mb-3">
                                <div className="card-header">
                                    <i className="fa fa-pie-chart"/> 数据源分布</div>
                                <div className="card-body">
                                    <PieReact option={pieOption}/>
                                </div>
                                <div className="card-body py-2 small">
                                    <a className="mr-3 d-inline-block" href="#" onClick={(event)=>this.collection(event, pieOption, "dataSource")}>
                                        <i className="fa fa-star-o" id={"dataSource"}> 收藏</i>
                                    </a>
                                    <a className="d-inline-block" href="#"><i className="fa fa-send-o"> 发送</i></a>
                                </div>
                            </div>
                        </div>
                        {/*相关词分布*/}
                        <div className="col-md-6">
                            <div className="card mb-3">
                                <div className="card-header">
                                    <i className="fa fa-area-chart"/> 相关词分布(暂不可用)</div>
                                <div className="card-body">
                                </div>
                                <div className="card-body py-2 small">
                                    <a className="mr-3 d-inline-block" href="#" onClick={(event)=>this.collection(event, null, "relatedWord")}>
                                        <i className="fa fa-star-o" id={"relatedWord"}> 收藏</i>
                                    </a>
                                    <a className="d-inline-block" href="#"><i className="fa fa-send-o"> 发送</i></a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*地域分布*/}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card mb-3">
                                <div className="card-header">
                                    <i className="fa fa-area-chart"/>地域分布</div>
                                <div className="card-body">
                                    <MapReact option={mapOption}/>
                                </div>
                                <div className="card-body py-2 small">
                                    <a className="mr-3 d-inline-block" href="#" onClick={(event)=>this.collection(event, mapOption, "region")}>
                                        <i className="fa fa-star-o" id={"region"}> 收藏</i>
                                    </a>
                                    <a className="d-inline-block" href="#"><i className="fa fa-send-o"> 发送</i></a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*具体微博展示*/}
                    <div className="card mb-3">
                        <div className="card-header">
                            <i className="fa fa-table"> 相关微博</i>
                            <div style={{float:"right"}}>
                                <div className="input-group">
                                    <input className="form-control" type="text" placeholder="搜正文..." onChange={this.handlechange} name={"searchWeiboContent"}/>
                                    <span className="input-group-btn">
                                        <button className="btn btn-primary" type="button" onClick={this.searchWeibo}>
                                            <i className="fa fa-search"/>
                                        </button>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <Table columns={this.state.weiboColumns} dataSource={this.state.searchedWeibo} rowKey={'id'}/>
                            </div>
                        </div>
                        <div className="card-body py-2 small">
                            <a className="mr-3 d-inline-block" href="#" onClick={(event)=>this.collection(event, this.state.searchedWeibo, "weibo")}>
                                <i className="fa fa-star-o" id={"weibo"}> 收藏</i>
                            </a>
                            <CSVLink data={this.state.searchedWeibo}
                                     filename={new Date().toLocaleString()}
                                     target="_blank"
                                     title="导出"
                                     className="mr-3 d-inline-block"
                            >
                                <i className="fa fa-fw fa-share-square-o"/>导出
                            </CSVLink>
                            <a className="d-inline-block" href="  "><i className="fa fa-fw fa-send-o"/>发送</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { authentication } = state;
    const { user } = authentication;
    return {
        user,
    };
}

const connectedKwAnalysisPage= connect(mapStateToProps)(KwAnalysisPage);
export { connectedKwAnalysisPage as KwAnalysisPage };
