import React from 'react';
import { connect } from 'react-redux';
import { Link, Switch, Route } from 'react-router-dom';
import {history} from '../_helpers';
import {WeiboTablePage} from "../MsgPage/WeiboTablePage";
import {PortalTablePage} from "../MsgPage/PortalTablePage";
import {AgencyTablePage} from "../MsgPage/AgencyTablePage";
import {ForumTablePage} from "../MsgPage/ForumTablePage";
import {SearchPage} from "../MsgPage/SearchPage";
import { Layout, Menu, Icon, Input} from 'antd';

import {serverIP} from "../_helpers/serverIP";
import { openNotificationWithIcon } from "../_helpers";

import elasticsearch from 'elasticsearch';
//主页不同模块
import {MonitoringPage} from '../MonitoringPage'
import {KwAnalysisPage} from '../KwAnalysisPage'
import {BlankPage} from '../BlankPage'
import {KeywordsPage} from '../KeywordsPage'
import {CollectionNewsPage} from '../CollectionNewsPage'
import { ClusteringPage } from '../ClusteringPage'
import {RecommendationPage} from "../RecommendationPage";
import {BriefReportPage} from "../BriefReportPage";

import './HomePage.css'

const Search = Input.Search;
const { SubMenu } = Menu;
const { Sider, Header } = Layout;

class HomePage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            selectedKeys: ""
        };
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

    componentDidMount() {
        // alert('did mount');
    }

    componentWillUnmount() {
        console.log('did unmount');
    }

    search(value){
        //console.log(value);
        // const {user} = this.props;

        // const requestOptions = {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token },
        //     body: JSON.stringify({ 'value': value })
        // };
        // fetch(serverIP + '/modifyPolarity', requestOptions).then(
        //     response => {
        //         if (!response.ok) {
        //             return Promise.reject(response.statusText);
        //         }
        //         return response.json();
        //     }
        // ).then(
        //     ans => {
        //         if (ans.status === 1) {
        //             openNotificationWithIcon("success", "感谢您的反馈:)");
        //         } else {
        //             openNotificationWithIcon("error", ans.message);
        //             if (ans.status === -1)
        //                 history.push("/login");
        //         }
        //     }
        // );
        history.push({pathname: '/searchMsg', state: {'value': value}})

    }


    render() {

        return (
            <Layout style={{height:"100%"}}>
                {/*<div style={{backgroundColor:"#ffffff"}}>*/}
                    {/*/!*<img src={require('./woodpecker.jpg')} height={50} alt={"logo"}/>*!/*/}
                    {/*<ul style={{position:"absolute", top:15, right:0}}>*/}
                        {/*<li>*/}
                        {/*</li>*/}
                    {/*</ul>*/}
                {/*</div>*/}

                <Header className="header">
                    {/*<span style={{fontFamily: "Poppins-Regular", fontSize:25, color: "#555555"}}>Woooodpecker</span>*/}
                    <img src={require('./woodpecker2.png')} height={50} width={40} alt={"logo"}/>
                    <Search placeholder="input search text" enterButton="Search" style={{width:"20%", marginLeft: 110}} onSearch={value=>this.search(value)}/>
                    <a href="/login" style={{float:"right"}}>
                        <span><i className="fa fa-fw fa-sign-out"/>Logout</span>
                    </a>
                </Header>


                <Layout>
                    <Sider width={200}>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['monitoring']}
                            defaultOpenKeys={['sub1']}
                            selectedKeys={[this.state.selectedKeys]}
                            style={{ height: '100%' }}
                        >
                            <SubMenu key="sub1" title={<span><Icon type="eye" />实时监控</span>}>
                                <Menu.Item key="monitoring"><Link to="/">关键字监控</Link></Menu.Item>
                            </SubMenu>

                            <SubMenu key="sub2" title={<span><Icon type="line-chart" />话题分析</span>}>
                                <Menu.Item key="kwAnalysis"><Link to="/kwAnalysis">关键字分析</Link></Menu.Item>
                                <Menu.Item key="clustering"><Link to="/clustering">话题聚类</Link></Menu.Item>
                                <Menu.Item key="recommendation"><Link to="/recommendation">关键字推荐</Link></Menu.Item>
                            </SubMenu>

                            <SubMenu key="sub6" title={<span><Icon type="table" />消息展示</span>}>
                                <Menu.Item key="weiboMsg"><Link to="/weiboMsg">微博消息</Link></Menu.Item>
                                <Menu.Item key="forumMsg"><Link to="/forumMsg">相关论坛</Link></Menu.Item>
                                <Menu.Item key="portalMsg"><Link to="/portalMsg">门户网站</Link></Menu.Item>
                                <Menu.Item key="agencyMsg"><Link to="/agencyMsg">培训机构</Link></Menu.Item>
                                <Menu.Item key="searchMsg"><Link to="/searchMsg">全局搜索</Link></Menu.Item>
                            </SubMenu>

                            <SubMenu key="sub3" title={<span><Icon type="user" />个性化设置</span>}>
                                <Menu.Item key="keywords"><Link to="/keywords">我的关键字</Link></Menu.Item>
                                {/*<Menu.Item key="report"><Link to="/report">我的报告</Link></Menu.Item>*/}
                                <Menu.Item key="brief"><Link to="/brief">我的简报夹</Link></Menu.Item>
                            </SubMenu>

                            <SubMenu key="sub4" title={<span><Icon type="star-o" />我的收藏</span>}>
                                <Menu.Item key="collectionNews"><Link to="/collectionNews">收藏的消息</Link></Menu.Item>
                                {/*<Menu.Item key="collectionCharts"><Link to="/collectionCharts">收藏的图表</Link></Menu.Item>*/}
                            </SubMenu>

                            <SubMenu key="sub5" title={<span><Icon type="tool" />系统设置</span>}>
                                <Menu.Item key="announcement"><Link to="/announcement">系统公告</Link></Menu.Item>
                            </SubMenu>

                        </Menu>
                    </Sider>
                    <Layout style={{backgroundColor:"white"}}>
                        <Switch>
                            <Route path={this.props.match.path} exact component={MonitoringPage} />
                            <Route path={`${this.props.match.path}kwAnalysis`} exact component={KwAnalysisPage} />
                            <Route path={`${this.props.match.path}keywords`} exact component={KeywordsPage} />
                            <Route path={`${this.props.match.path}collectionNews`} exact component={CollectionNewsPage} />
                            {/*<Route path={`${this.props.match.path}collectionCharts`} exact component={CollectionChartsPage} />*/}
                            <Route path={`${this.props.match.path}clustering`} exact component={ClusteringPage} />
                            <Route path={`${this.props.match.path}recommendation`} exact component={RecommendationPage} />
                            <Route path={`${this.props.match.path}weiboMsg`} exact component={WeiboTablePage} />
                            <Route path={`${this.props.match.path}portalMsg`} exact component={PortalTablePage} />
                            <Route path={`${this.props.match.path}agencyMsg`} exact component={AgencyTablePage} />
                            <Route path={`${this.props.match.path}forumMsg`} exact component={ForumTablePage} />
                            <Route path={`${this.props.match.path}searchMsg`} exact component={SearchPage} />
                            <Route path={`${this.props.match.path}brief`} exact component={BriefReportPage} />
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