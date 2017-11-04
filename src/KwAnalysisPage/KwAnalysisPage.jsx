import React from 'react';

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';


import asyncComponent from '../_helpers/AsyncComponent';


import { publishNumOption, emotionNumOption, pieOption, mapOption } from '../_helpers/options'

const LineReact = asyncComponent(() => import(/* webpackChunkName: "LineReact" */'../Echarts/LineReact')); //折线图组件
const PieReact = asyncComponent(() => import(/* webpackChunkName: "PieReact" */'../Echarts/PieReact'));  //饼图组件
const MapReact = asyncComponent(() => import(/* webpackChunkName: "MapReact" */'../Echarts/MapReact'));  //地图组件



class KwAnalysisPage extends React.Component {


    render() {
        return (
            <div className="content-wrapper" style={{marginLeft:0}}>
                <div className="container-fluid">
                    {/*关键词展示*/}
                    <div>
                        <button type="button" className="btn btn-primary">成考</button>
                        <button type="button" className="btn btn-secondary">作弊</button>
                        <button type="button" className="btn btn-secondary">答案</button>
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
                        {/*数据源分布*/}
                        <div className="col-md-6">
                            <div className="card mb-3">
                                <div className="card-header">
                                    <i className="fa fa-area-chart"/> 发布量折线图</div>
                                <div className="card-body">
                                    <LineReact option={publishNumOption}/>
                                </div>
                                <div className="card-body py-2 small">
                                    <a className="mr-3 d-inline-block" href="  "><i className="fa fa-fw fa-star"/>收藏</a>
                                    <a className="mr-3 d-inline-block" href="  "><i className="fa fa-fw fa-share"/>导出</a>
                                    <a className="d-inline-block" href="  "><i className="fa fa-fw fa-send"/>发送</a>
                                </div>
                            </div>
                        </div>
                        {/*数据源分布*/}
                        <div className="col-md-6">
                            <div className="card mb-3">
                                <div className="card-header">
                                    <i className="fa fa-area-chart"/>情感分析图</div>
                                <div className="card-body">
                                    <LineReact option={emotionNumOption}/>
                                </div>
                                <div className="card-body py-2 small">
                                    <a className="mr-3 d-inline-block" href="  "><i className="fa fa-fw fa-star"/>收藏</a>
                                    <a className="mr-3 d-inline-block" href="  "><i className="fa fa-fw fa-share"/>导出</a>
                                    <a className="d-inline-block" href="  "><i className="fa fa-fw fa-send"/>发送</a>
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
                                    <i className="fa fa-area-chart"/>数据源分布</div>
                                <div className="card-body">
                                    <PieReact option={pieOption}/>
                                </div>
                                <div className="card-body py-2 small">
                                    <a className="mr-3 d-inline-block" href="  "><i className="fa fa-fw fa-star"/>收藏</a>
                                    <a className="mr-3 d-inline-block" href="  "><i className="fa fa-fw fa-share"/>导出</a>
                                    <a className="d-inline-block" href="  "><i className="fa fa-fw fa-send"/>发送</a>
                                </div>
                            </div>
                        </div>
                        {/*相关词分布*/}
                        <div className="col-md-6">
                            <div className="card mb-3">
                                <div className="card-header">
                                    <i className="fa fa-area-chart"/>相关词分布(暂不可用)</div>
                                <div className="card-body">
                                </div>
                                <div className="card-body py-2 small">
                                    <a className="mr-3 d-inline-block" href="  "><i className="fa fa-fw fa-star"/>收藏</a>
                                    <a className="mr-3 d-inline-block" href="  "><i className="fa fa-fw fa-share"/>导出</a>
                                    <a className="d-inline-block" href="  "><i className="fa fa-fw fa-send"/>发送</a>
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
                                    <a className="mr-3 d-inline-block" href="  "><i className="fa fa-fw fa-star"/>收藏</a>
                                    <a className="mr-3 d-inline-block" href="  "><i className="fa fa-fw fa-share"/>导出</a>
                                    <a className="d-inline-block" href="  "><i className="fa fa-fw fa-send"/>发送</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*具体微博展示*/}
                    <div className="card mb-3">
                        <div className="card-header">
                            <i className="fa fa-table"/>相关微博</div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered" id="dataTable" style={{width: "100%"}}>
                                    <thead>
                                    <tr>
                                        <th>发布者</th>
                                        <th>正文</th>
                                        <th>点赞量</th>
                                        <th>评论量</th>
                                        <th>转发量</th>
                                        <th>发表时间</th>
                                        <th>关键字</th>
                                        <th>源地址</th>
                                        <th>正负面</th>
                                        <th>操作</th>
                                    </tr>
                                    </thead>
                                    <tfoot>
                                    <tr>
                                        <th>发布者</th>
                                        <th>正文</th>
                                        <th>点赞量</th>
                                        <th>评论量</th>
                                        <th>转发量</th>
                                        <th>发表时间</th>
                                        <th>关键字</th>
                                        <th>源地址</th>
                                        <th>正负面</th>
                                        <th>操作</th>
                                    </tr>
                                    </tfoot>
                                    <tbody>
                                    <tr>
                                        <td>路人甲</td>
                                        <td>成考答案，加QQ: 550155036 </td>
                                        <td>100</td>
                                        <td>20</td>
                                        <td>10</td>
                                        <td>2017-10-29</td>
                                        <td>成考</td>
                                        <td>http://www.4399.com</td>
                                        <td>负面</td>
                                        <td>
                                            <a href="  " title="收藏"><i className="fa fa-fw fa-star"/></a>
                                            <a href="  " title="导出"><i className="fa fa-fw fa-share"/></a>
                                            <a href="  " title="发送"><i className="fa fa-fw fa-send"/></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>路人乙</td>
                                        <td>成考答案，加QQ: 550155036 </td>
                                        <td>200</td>
                                        <td>30</td>
                                        <td>20</td>
                                        <td>2017-10-29</td>
                                        <td>成考</td>
                                        <td>http://www.4399.com</td>
                                        <td>负面</td>
                                        <td>
                                            <a href="  " title="收藏"><i className="fa fa-fw fa-star"/></a>
                                            <a href="  " title="导出"><i className="fa fa-fw fa-share"/></a>
                                            <a href="  " title="发送"><i className="fa fa-fw fa-send"/></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>路人丙</td>
                                        <td>成考答案，加QQ: 550155036 </td>
                                        <td>300</td>
                                        <td>40</td>
                                        <td>30</td>
                                        <td>2017-10-29</td>
                                        <td>成考</td>
                                        <td>http://www.4399.com</td>
                                        <td>负面</td>
                                        <td>
                                            <a href="  " title="收藏"><i className="fa fa-fw fa-star"/></a>
                                            <a href="  " title="导出"><i className="fa fa-fw fa-share"/></a>
                                            <a href="  " title="发送"><i className="fa fa-fw fa-send"/></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>路人丁</td>
                                        <td>成考答案，加QQ: 550155036 </td>
                                        <td>400</td>
                                        <td>20</td>
                                        <td>50</td>
                                        <td>2017-10-29</td>
                                        <td>成考</td>
                                        <td>http://www.4399.com</td>
                                        <td>负面</td>
                                        <td>
                                            <a href="  " title="收藏"><i className="fa fa-fw fa-star"></i></a>
                                            <a href="  " title="导出"><i className="fa fa-fw fa-share"></i></a>
                                            <a href="  " title="发送"><i className="fa fa-fw fa-send"></i></a>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card-body py-2 small">
                            <a className="mr-3 d-inline-block" href="  "><i className="fa fa-fw fa-star"/>收藏</a>
                            <a className="mr-3 d-inline-block" href="  "><i className="fa fa-fw fa-share"/>导出</a>
                            <a className="d-inline-block" href="  "><i className="fa fa-fw fa-send"/>发送</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export { KwAnalysisPage };