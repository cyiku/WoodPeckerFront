import React from 'react';
import { connect } from 'react-redux';
import { Link, Switch, Route } from 'react-router-dom';
import { userActions } from '../_actions';
// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';


//主页不同模块
import {MonitoringPage} from '../MonitoringPage'
import {KwAnalysisPage} from '../KwAnalysisPage'
import {BlankPage} from '../BlankPage'
import {KeywordsPage} from '../KeywordsPage'
import {CollectionNewsPage} from '../CollectionNewsPage'
import {CollectionChartsPage} from '../CollectionChartsPage'

class HomePage extends React.Component {
    componentDidMount() {
        this.props.dispatch(userActions.getAll());
    }

    handleDeleteUser(id) {
        return (e) => this.props.dispatch(userActions.delete(id));
    }

    // 设置body样式
    componentWillMount() {
        document.body.className = "fixed-nav sticky-footer bg-dark";
        document.body.id = "page-top";
    }

    render() {

        const {user} = this.props;

        return (
            <div>
                {/*neg bar*/}
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">
                    <Link className="navbar-brand" to="/">啄木鸟</Link>

                    <div className="collapse navbar-collapse" id="navbarResponsive">
                        <ul className="navbar-nav navbar-sidenav" id="exampleAccordion">

                            {/*实时监控*/}
                            <li className="nav-item" data-toggle="tooltip" data-placement="right" title="Monitor">
                                <Link to="/" className="nav-link nav-link-collapse collapsed"  data-toggle="collapse"  data-parent="#exampleAccordion" style={{color: '#868e96'}}>
                                    <i className="fa fa-fw fa-dashboard"/>
                                     实时监控
                                </Link>
                            </li>

                            {/*话题分析*/}
                            <li className="nav-item" data-toggle="tooltip" data-placement="right" title="Analysis">
                                <a className="nav-link nav-link-collapse collapsed"  data-toggle="collapse" href="#collapseAnalysis" data-parent="#exampleAccordion">
                                    <i className="fa fa-fw fa-area-chart"/>
                                    <span className="nav-link-text">话题分析</span>
                                </a>
                                <ul className="sidenav-second-level collapse" id="collapseAnalysis">
                                    <li>
                                        <Link to="/kwAnalysis">关键词分析</Link>
                                    </li>
                                    <li>
                                        {/*根据西交系统加的*/}
                                        <Link to="/blank">话题预警</Link>
                                    </li>
                                </ul>
                            </li>

                            {/*个性化设置*/}
                            <li className="nav-item" data-toggle="tooltip" data-placement="right" title="personalized">
                                <a className="nav-link nav-link-collapse collapsed" data-toggle="collapse" href="#collapsePersonalized" data-parent="#exampleAccordion">
                                    <i className="fa fa-fw fa-file"/>
                                    <span className="nav-link-text">个性化设置</span>
                                </a>
                                <ul className="sidenav-second-level collapse" id="collapsePersonalized">
                                    <li>
                                        <Link to="/keywords">我的关键词</Link>
                                    </li>
                                    <li>
                                        <Link to="/blank">我的报告</Link>
                                    </li>
                                </ul>
                            </li>

                            {/*收藏设置*/}
                            <li className="nav-item" data-toggle="tooltip" data-placement="right" title="personalized">
                                <a className="nav-link nav-link-collapse collapsed" data-toggle="collapse" href="#collapseCollection" data-parent="#exampleAccordion">
                                    <i className="fa fa-fw fa-file"/>
                                    <span className="nav-link-text">我的收藏</span>
                                </a>
                                <ul className="sidenav-second-level collapse" id="collapseCollection">
                                    <li>
                                        <Link to="/collectionNews">收藏的消息</Link>
                                    </li>
                                    <li>
                                        <Link to="/collectionCharts">收藏的图表</Link>
                                    </li>
                                </ul>
                            </li>

                            {/*系统设置*/}
                            <li className="nav-item" data-toggle="tooltip" data-placement="right" title="System">
                                <a className="nav-link nav-link-collapse collapsed" data-toggle="collapse" href="#collapseSystem" data-parent="#exampleAccordion">
                                    <i className="fa fa-fw fa-wrench"/>
                                    <span className="nav-link-text">系统设置</span>
                                </a>
                                <ul className="sidenav-second-level collapse" id="collapseSystem">
                                    <li>
                                        <Link to="/blank">待定</Link>
                                    </li>
                                    <li>
                                        <Link to="/blank">待定</Link>
                                    </li>
                                </ul>
                            </li>
                        </ul>

                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item dropdown">
                                {/*邮件*/}
                                <a className="nav-link dropdown-toggle mr-lg-2" id="messagesDropdown" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {/*邮件图标*/}
                                    <i className="fa fa-fw fa-envelope"/>
                                    {/*右箭头*/}
                                    <span className="d-lg-none">消息
                                      <span className="badge badge-pill badge-primary">12 New</span>
                                    </span>
                                    <span className="indicator text-primary d-none d-lg-block">
                                      <i className="fa fa-fw fa-circle"/>
                                    </span>
                                </a>
                                <div className="dropdown-menu" aria-labelledby="messagesDropdown">
                                    <h6 className="dropdown-header">新消息:</h6>
                                    <div className="dropdown-divider"/>
                                    <a className="dropdown-item" href="#">
                                        <strong>小欧</strong>
                                        <span className="small float-right text-muted">11:21 AM</span>
                                        <div className="dropdown-message small">整理好图表的发你邮箱了</div>
                                    </a>
                                    <div className="dropdown-divider"/>
                                    <a className="dropdown-item" href="#">
                                        <strong>欧少</strong>
                                        <span className="small float-right text-muted">11:21 AM</span>
                                        <div className="dropdown-message small">回我电话</div>
                                    </a>
                                    <div className="dropdown-divider"/>
                                    <a className="dropdown-item small" href="#">查看所有消息</a>
                                </div>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle mr-lg-2" id="alertsDropdown" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fa fa-fw fa-bell"/>
                                    <span className="d-lg-none">系统提示
                                      <span className="badge badge-pill badge-warning">6 New</span>
                                    </span>
                                    <span className="indicator text-warning d-none d-lg-block">
                                      <i className="fa fa-fw fa-circle"/>
                                    </span>
                                </a>
                                <div className="dropdown-menu" aria-labelledby="alertsDropdown">
                                    <h6 className="dropdown-header">系统提示:</h6>
                                    <div className="dropdown-divider"/>
                                    <a className="dropdown-item" href="#">
                                          <span className="text-success">
                                            <strong>
                                              <i className="fa"/>关键词添加成功</strong>
                                          </span>
                                        <span className="small float-right text-muted">11:21 AM</span>
                                        <div className="dropdown-message small">您已成功添加了"高考"关键词</div>
                                    </a>
                                    <div className="dropdown-divider"/>
                                    <a className="dropdown-item" href="#">
                                          <span className="text-danger">
                                            <strong>
                                              <i className="fa"/>关键词删除成功</strong>
                                          </span>
                                        <span className="small float-right text-muted">11:21 AM</span>
                                        <div className="dropdown-message small">您已成功删除了"成考"关键词</div>
                                    </a>
                                    <div className="dropdown-divider"/>
                                    <a className="dropdown-item small" href="#">查看所有提示</a>
                                </div>
                            </li>
                            {/*搜索*/}
                            <li className="nav-item">
                                <form className="form-inline my-2 my-lg-0 mr-lg-2">
                                    <div className="input-group">
                                        <input className="form-control" type="text" placeholder="Search for..." />
                                          <span className="input-group-btn">
                                            <button className="btn btn-primary" type="button">
                                              <i className="fa fa-search"/>
                                            </button>
                                          </span>
                                    </div>
                                </form>
                            </li>
                            {/*登出*/}
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="modal" data-target="#exampleModal">
                                    <i className="fa fa-fw fa-sign-out"/>Logout</a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <Switch>
                    <Route path={this.props.match.path} exact component={MonitoringPage} />
                    <Route path={`${this.props.match.path}kwAnalysis`} exact component={KwAnalysisPage} />
                    <Route path={`${this.props.match.path}keywords`} exact component={KeywordsPage} />
                    <Route path={`${this.props.match.path}collectionNews`} exact component={CollectionNewsPage} />
                    <Route path={`${this.props.match.path}collectionCharts`} exact component={CollectionChartsPage} />
                    <Route path={`${this.props.match.path}blank`} exact component={BlankPage} />
                </Switch>

                <footer className="sticky-footer">
                    <div className="container">
                        <div className="text-center">
                            <small>Copyright © 啄木鸟 2017</small>
                        </div>
                    </div>
                </footer>

                <div className="modal fade" id="exampleModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                                <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                                <Link className="btn btn-primary" to="/login">Logout</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return {
        user,
        users
    };
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage };