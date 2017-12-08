import React from 'react';
import { connect } from 'react-redux';
import { Link, Switch, Route } from 'react-router-dom';
import {history} from '../_helpers';

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
import { ClusteringPage } from '../ClusteringPage'
import {RecommendationPage} from "../RecommendationPage";

const { SubMenu } = Menu;
const { Sider } = Layout;

class HomePage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            selectedKeys: ""
        }
    }

    componentWillMount(){
        history.listen((event)=>{
            let path = event.pathname.split("/");
            if(path !== null){
                let location = path[1];
                if (location === "") {
                    this.setState({
                        selectedKeys: 'monitoring'
                    });
                } else {
                    this.setState({
                        selectedKeys: location
                    })
                }
            }
        });
    }


    render() {

        return (
            <Layout style={{height:"100%"}}>
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
                            defaultSelectedKeys={['monitoring']}
                            defaultOpenKeys={['sub1']}
                            selectedKeys={[this.state.selectedKeys]}
                            style={{ height: '100%' }}
                        >
                            <SubMenu key="sub1" title={<span><i className="fa fa-fw fa-dashboard"/> 实时监控</span>}>
                                <Menu.Item key="monitoring"><Link to="/">关键字监控</Link></Menu.Item>
                            </SubMenu>

                            <SubMenu key="sub2" title={<span><i className="fa fa-fw fa-bar-chart"/> 话题分析</span>}>
                                <Menu.Item key="kwAnalysis"><Link to="/kwAnalysis">关键词分析</Link></Menu.Item>
                                <Menu.Item key="clustering"><Link to="/clustering">话题聚类</Link></Menu.Item>
                                <Menu.Item key="recommendation"><Link to="/recommendation">关键词推荐</Link></Menu.Item>
                            </SubMenu>

                            <SubMenu key="sub3" title={<span><i className="fa fa-fw fa-heart-o"/> 个性化设置</span>}>
                                <Menu.Item key="keywords"><Link to="/keywords">我的关键词</Link></Menu.Item>
                                <Menu.Item key="report"><Link to="/report">我的报告</Link></Menu.Item>
                                <Menu.Item key="brief"><Link to="/brief">我的简报夹</Link></Menu.Item>
                            </SubMenu>

                            <SubMenu key="sub4" title={<span><i className="fa fa-fw fa-star-o"/> 我的收藏</span>}>
                                <Menu.Item key="collectionNews"><Link to="/collectionNews">收藏的消息</Link></Menu.Item>
                                <Menu.Item key="collectionCharts"><Link to="/collectionCharts">收藏的图表</Link></Menu.Item>
                            </SubMenu>

                            <SubMenu key="sub5" title={<span><i className="fa fa-fw fa-wrench"/> 系统设置</span>}>
                                <Menu.Item key="announcement"><Link to="/announcement">系统公告</Link></Menu.Item>
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
                            <Route path={`${this.props.match.path}clustering`} exact component={ClusteringPage} />
                            <Route path={`${this.props.match.path}recommendation`} exact component={RecommendationPage} />
                            <Route path={`${this.props.match.path}`}  component={BlankPage} />
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