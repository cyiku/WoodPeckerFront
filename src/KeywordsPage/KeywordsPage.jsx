import React from 'react';

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';

class KeywordsPage extends React.Component {


    render() {
        return (
            <div className="content-wrapper" style={{marginLeft:0}}>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="email-btn-row hidden-xs f-s-15">
                                <a href="#myModal" className="btn btn-sm btn-primary" data-toggle="modal" data-backdrop="false"><i className="fa fa-plus m-r-5"/> 新加关键字 </a>
                            </div>
                            <div className="email-content">
                                <table className="table table-email f-s-14">
                                    <thead>
                                    <tr>
                                        <th>关键字名称</th>
                                        <th>爬取站点</th>
                                        <th>操作</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr className="ng-scope">
                                        <td style={{width: "15%"}} className="ng-binding">作弊</td>
                                        <td style={{width: "35%"}} className="ng-binding">人民网,新浪教育,搜狐教育,腾讯教育,网易教育,高考网 ,中国新闻网,新浪新闻,环球新闻,澎湃新闻,人民新闻,天涯论坛,大家论坛,家长帮论坛, 知乎,外贸圈论坛,新浪微博,答案贴吧,教育贴吧,考试贴吧,李毅贴吧,成人高考贴吧,成考吧吧,北京成考吧,微信公众号,百度搜一搜</td>
                                        <td style={{width: "10%"}}><a href="#myModal" title="修改话题"><i className="fa fa-edit"/></a> <a href="#myModal"><i className="fa fa-trash-o"/></a></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/*模态框（Modal*/}
                        <div className="modal fade" id="myModal" role="dialog" aria-labelledby="myModalLabel">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h4 className="modal-title" id="myModalLabel">操作</h4>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                    </div>
                                    <div className="modal-body">

                                        <div className="form-group">
                                            <label>关键字名称</label>
                                            <input type="text" name="txt_departmentname" data-bind="value:Name" className="form-control" id="txt_departmentname" placeholder="关键字名称"/>
                                        </div>
                                        <div className="form-group">
                                            <label>爬取站点</label>
                                            <div className="m-b-15">
                                                <div>
                                                    <ul className="nav nav-pills nav-stacked nav-sm panel-body">
                                                        <li>
                                                            <div>
                                                                <label className="checkbox inline">
                                                                    <input type="checkbox"  value="option1"/> <i className="fa fa-inbox fa-fw m-r-5"/><span className="text-muted ng-binding">贴吧</span>
                                                                </label>
                                                            </div>
                                                            <label className="checkbox inline">
                                                                <input type="checkbox" id="inlineCheckbox1" value="option1"/> <a href=" ">百度贴吧</a>
                                                            </label>
                                                            <label className="checkbox inline">
                                                                <input type="checkbox" id="inlineCheckbox2" value="option2"/> <a href=" ">十度贴吧</a>
                                                            </label>
                                                            <label className="checkbox inline">
                                                                <input type="checkbox" id="inlineCheckbox3" value="option3"/> <a href=" ">千度贴吧</a>
                                                            </label>
                                                        </li>

                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-default" data-dismiss="modal"><span className="glyphicon glyphicon-remove" aria-hidden="true"/>关闭</button>
                                        <button type="button" id="btn_submit" className="btn btn-primary" data-dismiss="modal"><span className="glyphicon glyphicon-floppy-disk" aria-hidden="true"/>保存</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export { KeywordsPage };