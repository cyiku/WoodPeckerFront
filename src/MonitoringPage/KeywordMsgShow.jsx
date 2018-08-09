import React from 'react';
import { Link } from 'react-router-dom';
import { Collapse, Icon, Popover, List } from 'antd';
import { connect } from 'react-redux';
import {openNotificationWithIcon} from "../_helpers";
import {OneMsgPage} from "./OneMsgPage";
import {serverIP} from '../_helpers';
import {errorProcess} from "../_helpers/error";
import { Pagination } from 'antd';
import { MsgActions } from '../_actions';
// 导入css
import './MonitoringPage.css';

const Panel = Collapse.Panel;  // 消息换页的组件，参考ant design，换页的目的是为了不那么卡
const pageSize = 5;  // 每页的数量
const intervalTime = 20 * 1000;  // 每次请求间隔时间
const containerHeight = 651;  // 每个消息框的高度
const maxDisplay = 25;  // 每个关键字最多显示的消息的数目
const keywordIntervalTime = 5 * 1000; // 关键字之间间隔时间

class KeywordMsgShow extends React.Component {
    // 负责展示特定关键字下的所有消息
    constructor(props) {
        super(props);
        this.state = {
            message: [],   // 存储所有的消息
            messageIsNew: {}, // 记录哪些消息用户还没有看过，key: id, value: true or false，可能会存在数目不断增大问题，但好像也没别的办法
            newMessageNum: 0, // 记录没有看过的消息的数目
            showMessage: [],  // 当前页要展示的消息
            total: 0,  // 为分页服务
            currentPage: 1,  // 为分页服务
            isLoading: false,
        }
    }

    componentDidMount(){
        // 打开监控页面时有两种情况，一是用户刚进网站跳转到监控页面，二是用户从其他页面跳回监控页面。
        // 如果是情况二，由于用户首次离开监控页面时，网站已经存储了该关键字的一些消息，\
        // 则加载该关键字的预存的消息到全局state里的消息。
        const {keyword, msg} = this.props;
        let message = msg[keyword.name]; // 看全局state里有没有存该消息
        let isFirst = true;
        if (message !== undefined && message.length !== 0) {
            isFirst = false;  // 存了，则显示该消息
            let messageIsNew = {};
            for (let i = 0; i < message.length; ++i) {
                messageIsNew[message[i]._id] = false; // 原本有的就不是新的
            }
            this.setState(preState => ({
                ...preState,
                message: message,
                showMessage: message.slice(0, pageSize),
                messageIsNew: messageIsNew,
                total: message.length,
            }));
        }
        // 为每个关键字添加定时任务，并且每个关键字请求错开时间
        const { index } = this.props;
        this.timeout = setTimeout(_=>{this.StartTimingTask(isFirst)}, index * keywordIntervalTime);
    }

    componentWillUnmount(){
        // 用户离开监控页面时，保留打开页面期间收到的消息。
        const {user, keyword, dispatch} = this.props;
        dispatch(MsgActions.updMsg(user, keyword.name, this.state.message));
        // 清除定时任务
        clearInterval(this.interval);
        clearTimeout(this.timeout);
    }

    StartTimingTask = (isFirst) => {
        // 开启定时任务，定时任务声明后并不是立即执行，而是要等时间间隔之后才第一次执行
        // 所以要是第一次打开该页面，为了防止一直没消息看的尴尬，先执行一次任务，再声明定时任务
        if (isFirst === true)
            this.monitor(true); // 第一次登陆
        this.interval = setInterval(_ => {
            this.monitor(false);
        }, intervalTime);
    }

    monitor = (isFirst) => {
        // 获取监控的消息，isFirst为true时为第一次登陆，此时获取最新的前20条消息
        // isFirst为false时则获取最新20s内的消息。
        this.setState(preState => ({
            ...preState,
            isLoading: true,
        }));

        const {user,keyword} = this.props;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token },
            body: JSON.stringify({ 'name': keyword.name})
        };

        let requestIP;

        if (isFirst === true) {
            // 第一次请求则请求最新的20条，后因太慢改成了5条
            requestIP = serverIP + '/last20';
        } else {
            // 以后则请求近20s内的新消息
            requestIP = serverIP + '/monitor';
        }

        console.log(keyword.name + ' post monitor request');

        fetch(requestIP, requestOptions).then(
            response => {
                if (!response.ok) {
                    return Promise.reject(response.statusText);
                }
                return response.json();
            }
        ).then(
            ans => {
                if(ans.status === 1) {

                    // 为了更新state
                    let newMessage = JSON.parse(JSON.stringify(this.state.message));
                    console.log(ans.result.data);
                    // let newMessageIsNew = JSON.parse(JSON.stringify(this.state.messageIsNew));

                    //let newMessage = this.state.message;
                    newMessage.reverse();  // 从小到大排
                    let newMessageIsNew = this.state.messageIsNew;

                    let count = 0;
                    for (let i = 0; i < ans.result.data.length; ++i) {
                        // 遍历所有刚接受的消息，看是否在原来的message里,判断消息的来源是否在用户关注的来源里
                        if (newMessageIsNew[ans.result.data[i]._id] === undefined && keyword.sites.indexOf(ans.result.data[i].source) !== -1) {
                            newMessage.push(ans.result.data[i]);
                            newMessageIsNew[ans.result.data[i]._id] = true; 
                            count += 1;
                        }
                    }

                    if (count > 0) {
                        openNotificationWithIcon("success", keyword.name + " 成功获取新消息" + count + "条");
                    } else {
                        this.setState(preState => ({
                            isLoading: false,
                        }));
                        return;
                    }

                    if (newMessage.length > maxDisplay) {
                        let length = newMessage.length;
                        newMessage = newMessage.slice(length - maxDisplay, length);  // 保证最近更新的消息都能看到
                    }

                    let newMessageNum = 0;
                    for (let i = 0; i < newMessage.length; ++i) {
                        if (newMessageIsNew[newMessage[i]._id] === true)
                            newMessageNum += 1;
                    }

                    newMessage.sort(function(a,b){
                        if (a.time === b.time)
                            return 0;
                        if (a.time < b.time)
                            return 1;
                        return -1;
                    });

                    this.setState(preState => ({
                        ...preState,
                        message: newMessage,
                        showMessage: newMessage.slice(0, pageSize),
                        messageIsNew: newMessageIsNew,
                        newMessageNum: newMessageNum,
                        //time: this.getNowFormatDate(),
                        total: newMessage.length,
                        currentPage: 1,
                        isLoading: false,
                    }));
                } else {
                    openNotificationWithIcon("error", ans.message);
                }
            },
            error => errorProcess(error)
        )
    };

    play = (event) => {
        // 暂停接受或重新接受
        const {keyword} = this.props;

        let type = event.target.getAttribute("class");

        if (type === "anticon anticon-pause-circle-o") {
            event.target.setAttribute("class", "anticon anticon-play-circle-o");
            clearInterval(this.interval);
            openNotificationWithIcon('success', '暂停成功');
            console.log(keyword.name + " has been paused");
        } else {
            event.target.setAttribute("class", "anticon anticon-pause-circle-o");
            this.interval = setInterval(_ => {
                this.monitor(false)
            }, intervalTime);
            openNotificationWithIcon('success', '开始监控');
            console.log(keyword.name + " has been started to get data");
        }
        event.stopPropagation();
    };

    // 清除功能，体验不好就删了
    // fresh = (event) => {
    //     this.setState(
    //         preState => ({
    //             ...preState,
    //             message: [],
    //             messageId: [],
    //         })
    //     );
    //     this.monitor(false);
    //     event.stopPropagation();
    // };

    pageChange = (page) => {
        // 换页
        this.setState(preState => ({
            ...preState,
            showMessage: this.state.message.slice((page - 1) * pageSize, page * pageSize),
            currentPage: page
        }));
    };

    newToOld = (event, id) => {
        // 如果鼠标放在某个消息上, 则把new置位old
        if (this.state.newMessageNum > 0 && this.state.messageIsNew[id] === true) {
            let newMessageNum = this.state.newMessageNum;
            let newMessageIsNew = JSON.parse(JSON.stringify(this.state.messageIsNew));
            newMessageNum -= 1;
            newMessageIsNew[id] = false;
            this.setState(preState => ({
                ...preState,
                messageIsNew: newMessageIsNew,
                newMessageNum: newMessageNum,
            }));
        }
        
    }

    render() {
        // 关键字分析Icon
        const {keyword} = this.props;
        let path = {
            pathname:'/kwAnalysis',
            state:keyword['name'],
        };
        
        // 排序Icon
        const sortData = ['按重要度排序', '按负面影响排序', '按关注度排序', '按情感排序', '默认排序'];
        const sortContent = (
            <List
                bordered
                dataSource={sortData}
                renderItem={item => (<List.Item><a onClick={event => alert('后续推出, 敬请期待')}>{item}</a></List.Item>)}
            />
        );

        // 消息展示
        const {showMessage} = this.state;

        // 待读消息数目提示
        let remindMsg;
        if (this.state.isLoading) {
            remindMsg = '(正在加载中)';
        } else {
            if (this.state.newMessageNum > 0) {
                remindMsg = '(未读消息数: ' + this.state.newMessageNum + ')';
            } else {
                remindMsg = '(无待读消息)';
            }
        }

        return (
            <div style={{height:"100% "}} name={keyword.name} id={keyword.name}>

                <Collapse defaultActiveKey={['1']} style={{marginTop:10, backgroundColor:"white"}}>
                    <Panel header= {
                        <div>
                            <div style={{float: 'right'}} onClick={event => event.stopPropagation()}>
                                <Popover content={sortContent} placement="bottom" >
                                    <Icon type="database" style={{fontSize:15, marginRight:10}}/>
                                </Popover>
                                <Icon type="pause-circle-o" onClick={this.play} style={{fontSize:15, marginRight:10}} title={"暂停或启动"}/>
                                {/* <Icon type="reload" onClick={this.fresh} style={{fontSize:15, marginRight:10}}/> */}
                                <Link to={path} style={{color:"black"}}><Icon type="line-chart" style={{fontSize:15, marginRight:10}} title={"关键字分析"}/></Link>
                            </div>
                            <span> {keyword.name}</span>
                            <span style={{marginLeft:15,fontSize: 14}}>{remindMsg}</span>
                        </div>
                    } key="1" >

                        <div ref={this.props.keyword} style={{ overflow: 'auto', height: containerHeight}}>
                            <div>
                                {
                                    showMessage.map((item, index) => <div onMouseOver={event=>this.newToOld(event, item._id)}><OneMsgPage content={item} contentType={item['contentType']} isNew = {this.state.messageIsNew[item._id]}/></div>)
                                }
                            </div>
                        </div>
                        <Pagination current={this.state.currentPage} pageSize={pageSize} total={this.state.total} onChange={this.pageChange}/>
                    </Panel>
                </Collapse>

            </div>
        );
    }
}


function mapStateToProps(state, ownProps) {
    const {authentication, msg} = state;
    const {user} = authentication;
    const {keyword, index} = ownProps;
    return {user, keyword, index, msg};
}

const connectedKeywordMsgShow = connect(mapStateToProps)(KeywordMsgShow);
export { connectedKeywordMsgShow as KeywordMsgShow };
