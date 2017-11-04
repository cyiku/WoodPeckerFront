import React from 'react';

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';

class CollectionNewsPage extends React.Component {


    render() {
        return (
            <div className="content-wrapper" style={{marginLeft:0}}>
                <div className="container-fluid">
                    <div className="row">
                        {/*具体微博展示*/}
                        <div className="card mb-3" style={{width: "100%"}}>
                            <div className="card-header">
                                <i className="fa fa-table"/>收藏的微博</div>
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
                                            <th>收藏时间</th>
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
                                            <th>收藏时间</th>
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
                                            <th>负面</th>
                                            <td>2017-10-29</td>
                                            <td>
                                                <a href=" " title="发送"><i className="fa fa-fw fa-send"/></a>
                                                <a href=" " title="导出"><i className="fa fa-fw fa-share"/></a>
                                                <a href=" " title="删除"><i className="fa fa-trash-o"/></a>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export { CollectionNewsPage };
