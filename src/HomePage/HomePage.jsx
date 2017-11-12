import React from 'react';
import { connect } from 'react-redux';
import { Link, Switch, Route } from 'react-router-dom';

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';
import './HomePage.css'

import { Layout, Menu} from 'antd';

//主页不同模块
import {MonitoringPage} from '../MonitoringPage'
import {KwAnalysisPage} from '../KwAnalysisPage'
import {BlankPage} from '../BlankPage'
import {KeywordsPage} from '../KeywordsPage'
import {CollectionNewsPage} from '../CollectionNewsPage'
import {CollectionChartsPage} from '../CollectionChartsPage'

const { SubMenu } = Menu;
const { Sider } = Layout;

class HomePage extends React.Component {

    render() {


        return (
            <Layout style={{height:"100%"}}>
                {/*
                <Header width={"100%"}>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                    >
                        <div style={{float:"left"}}>
                            <img src={require('./woodpecker3.jpg')} height={64}/>
                        </div>

                        <div style={{float:"right", height:"100%"}}>
                            <Link className="nav-link" data-toggle="modal" to="/login" style={{color: '#868e96'}}>
                                <span> <i className="fa fa-fw fa-sign-out"/>Logout </span>
                            </Link>
                        </div>
                    </Menu>
                </Header>
                */}
                {/*websocket 官网demo
                <div>
                    <Websocket url='ws://localhost:8080/websocket.ws'
                               onMessage={this.handleData}/>
                </div>
                */}
                <div style={{backgroundColor:"#404040"}}>
                    <img src={require('./woodpecker.jpg')} height={50} alt={"logo"}/>
                    <ul style={{position:"absolute", top:15, right:0}}>
                        <li>
                            <Link to="/login" style={{color: '#868e96'}}>
                                <span><i className="fa fa-fw fa-sign-out"/>Logout</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                <Layout>
                    <Sider width={200} style={{ background: '#fff'}}>
                        <Menu
                            mode="inline"
                            theme="dark"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{ height: '100%' }}
                        >
                            <SubMenu key="sub1" title={<span><i className="fa fa-fw fa-dashboard"/>实时监控</span>}>
                                <Menu.Item key="0"><Link to="/">关键字监控</Link></Menu.Item>
                            </SubMenu>

                            <SubMenu key="sub2" title={<span><i className="fa fa-fw fa-area-chart"/>话题分析</span>}>
                                <Menu.Item key="1"><Link to="/kwAnalysis">关键词分析</Link></Menu.Item>
                                <Menu.Item key="2"><Link to="/blank">话题预警</Link></Menu.Item>
                            </SubMenu>

                            <SubMenu key="sub3" title={<span><i className="fa fa-fw fa-star-half-empty"/>个性化设置</span>}>
                                <Menu.Item key="3"><Link to="/keywords">我的关键词</Link></Menu.Item>
                                <Menu.Item key="4"><Link to="/blank">我的报告</Link></Menu.Item>
                            </SubMenu>

                            <SubMenu key="sub4" title={<span><i className="fa fa-fw fa-bookmark-o"/>我的收藏</span>}>
                                <Menu.Item key="5"><Link to="/collectionNews">收藏的消息</Link></Menu.Item>
                                <Menu.Item key="6"><Link to="/collectionCharts">收藏的图表</Link></Menu.Item>
                            </SubMenu>

                            <SubMenu key="sub5" title={<span><i className="fa fa-fw fa-wrench"/>系统设置</span>}>
                                <Menu.Item key="7"><Link to="/blank">待定</Link></Menu.Item>
                            </SubMenu>

                        </Menu>
                    </Sider>
                    <Layout>
                        <Switch>
                            <Route path={this.props.match.path} exact component={MonitoringPage} />
                            <Route path={`${this.props.match.path}kwAnalysis`} exact component={KwAnalysisPage} />
                            <Route path={`${this.props.match.path}keywords`} exact component={KeywordsPage} />
                            <Route path={`${this.props.match.path}collectionNews`} exact component={CollectionNewsPage} />
                            <Route path={`${this.props.match.path}collectionCharts`} exact component={CollectionChartsPage} />
                            <Route path={`${this.props.match.path}blank`} exact component={BlankPage} />
                        </Switch>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { authentication } = state;
    const { user } = authentication;
    return {
        user
    };
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage };