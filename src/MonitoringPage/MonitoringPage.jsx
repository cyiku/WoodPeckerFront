import React from 'react';

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';

class MonitoringPage extends React.Component {


    render() {
        return (
            <div className="content-wrapper" style={{marginLeft:0}}>
                <div className="container-fluid">
                    <div>
                        <button type="button" className="btn btn-primary" style={{marginLeft:10}}>成考</button>
                        <button type="button" className="btn btn-primary" style={{marginLeft:10}}>作弊</button>
                        <button type="button" className="btn btn-primary" style={{marginLeft:10}}>答案</button>
                        <button type="button" className="btn btn-danger"  style={{marginLeft:10}}><a href="keywords.html" style={{color:"white"}}>管理关键字</a></button>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <div>
                                {/*Card Columns Example Social Feed*/}
                                <div className="mb-0 mt-4">
                                    <i className="fa fa-newspaper-o">成考</i>
                                    <a href="navbar.html" style={{float: 'right'}}>话题分析</a>
                                </div>
                                <hr className="mt-2" />
                                    <div>
                                        {/*Example Social Card*/}
                                        <div className="card mb-3">
                                            <div className="card-body">
                                                <h6 className="card-title mb-1"><a href=" ">路人甲</a></h6>
                                                <a href=" " className="card-text small"><font color="red">成考</font>答案，加QQ: 550155036
                                                </a>
                                            </div>
                                            <hr className="my-0" />
                                                <div className="card-body py-2 small">
                                                    <a className="mr-3 d-inline-block" href=" ">评论(20)</a>
                                                    <a className="mr-3 d-inline-block" href=" ">转发(10)</a>
                                                    <a className="d-inline-block" href=" ">赞(100)</a>
                                                    <i className="text-muted ng-binding" style={{marginLeft:20}}>2017-10-29 23:50:00, 微博</i>
                                                </div>
                                                <hr className="my-0" />
                                                    <div className="card-body py-2 small">
                                                        <a className="mr-3 d-inline-block" href=" "><i className="fa fa-fw fa-star"/>收藏</a>
                                                        <a className="mr-3 d-inline-block" href=" "><i className="fa fa-fw fa-share"/>导出</a>
                                                        <a className="d-inline-block" href=" "><i className="fa fa-fw fa-send"/>发送</a>
                                                    </div>
                                        </div>
                                        {/*Example Social Card*/}
                                        <div className="card mb-3">
                                            <div className="card-body">
                                                <h6 className="card-title mb-1"><a href=" ">路人乙</a></h6>
                                                <a href=" " className="card-text small"><font color="red">成考</font>太难了，出题人买方便面没调料!!
                                                </a>
                                            </div>
                                            <a href=" ">
                                                <img className="card-img-top img-fluid w-100" src="https://unsplash.it/700/450?image=610" alt="" />
                                            </a>
                                            <hr className="my-0" />
                                                <div className="card-body py-2 small">
                                                    <a className="mr-3 d-inline-block" href=" ">评论(20)</a>
                                                    <a className="mr-3 d-inline-block" href=" ">转发(10)</a>
                                                    <a className="d-inline-block" href=" ">赞(100)</a>
                                                    <i className="text-muted ng-binding" style={{marginLeft:20}}>2017-10-29 23:50:00, 微博</i>
                                                </div>
                                                <hr className="my-0" />
                                                    <div className="card-body py-2 small">
                                                        <a className="mr-3 d-inline-block" href=" "><i className="fa fa-fw fa-star"/>收藏</a>
                                                        <a className="mr-3 d-inline-block" href=" "><i className="fa fa-fw fa-share"/>导出</a>
                                                        <a className="d-inline-block" href=" "><i className="fa fa-fw fa-send"/>发送</a>
                                                    </div>
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

export { MonitoringPage };