import React from 'react';
import { Link } from 'react-router-dom';
import { Collapse, Icon, Popover, Button, List } from 'antd';
import { connect } from 'react-redux';
import {openNotificationWithIcon} from "../_helpers";
import {OneMsgPage} from "./OneMsgPage";
import {serverIP} from '../_helpers';
import { history } from '../_helpers';
import {errorProcess} from "../_helpers/error";
import { Pagination } from 'antd';
import { MsgActions } from '../_actions';
// 导入css
import './MonitoringPage.css';


const Panel = Collapse.Panel;


class MsgShow extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            message: [],
            messageId:[],
            messageIsNew: {}, // key: id, value: true or false
            newMessageNum: 0,
            showMessage: [],
            containerHeight: 651,
            total: 0,
            defaultPage: 0,
            pageSize: 10,
        }
    }

    componentDidMount(){

        // 加载存储到全局state里的msg
        const {user, keyword, msg} = this.props;
        const {token} = user;
        let message = msg[keyword.name];
        if (message !== undefined && message !== []) {
            let messageId = [];
            let messageIsNew = {};
            for (let i = 0; i < message.length; ++i) {
                messageId.unshift(message[i]._id);
                messageIsNew[message[i]._id] = false; // 原本有的就不是新的
            }
            this.setState(preState => ({
                ...preState,
                message: message,
                showMessage: message,
                messageId: messageId,
                messageIsNew: messageIsNew,
                time: this.getNowFormatDate(),
                total: message.length,
            }));
        }
        // 每个关键字请求错开时间
        const { index } = this.props;
        this.timeout = setTimeout(_=>{this.StartTimingTask()}, index * 10 * 1000);
    }

    StartTimingTask = () => {
        this.monitor(true);
        this.interval = setInterval(_ => {
            this.monitor(false);
        }, 30 * 1000 );
    }

    componentWillUnmount(){
        const {user, keyword, dispatch} = this.props;
        
        // 该方法因速度慢而废弃
        // message数组里存的都是object,需要转成string存储
        // const {token} = user;
        // localStorage.setItem(token + '_' + keyword.name, JSON.stringify(this.state.message.slice(0, 10)));
        // localStorage.setItem(token + '_' + keyword.name + '_id', JSON.stringify(this.state.messageId.slice(0, 10)));
        
        // 将msg存到全局的state里
        dispatch(MsgActions.updMsg(user, keyword.name, this.state.message.slice(0, 10)));
        clearInterval(this.interval);
        clearTimeout(this.timeout);
    }

    getNowFormatDate = () => {
        let date = new Date();
        let seperator1 = "-";
        let seperator2 = ":";
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        let hour = date.getHours();
        if (hour >= 0 && hour <= 9) {
            hour = "0" + hour;
        }
        let minute = date.getMinutes();
        if (minute >= 0 && minute <= 9) {
            minute = "0" + minute;
        }
        let second = date.getSeconds();
        if (second >=0 && second <= 9) {
            second = "0" + second;
        }

        let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + hour + seperator2 + minute
            + seperator2 + second;
        return currentdate;
    };

    monitor = (isFirst) => {

        const {user,keyword,dispatch} = this.props;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token },
            body: JSON.stringify({ 'name': keyword.name})
        };

        let requestIP;

        if (isFirst === true) {
            // 第一次请求则请求最新的20条，后因渲染问题改成了5条
            requestIP = serverIP + '/last20';
        } else {
            // 以后则请求近20s内的新消息
            requestIP = serverIP + '/monitor';
        }

        console.log(keyword.name + ' monitor request...');

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

                    let newMessage = JSON.parse(JSON.stringify(this.state.message));
                    let newMessageId = JSON.parse(JSON.stringify(this.state.messageId));
                    let newMessageIsNew = JSON.parse(JSON.stringify(this.state.messageIsNew));
                    let newMessageNum = this.state.newMessageNum;

                    let count = 0;
                    for (let i = 0; i < ans.result.data.length; ++i) {
                        if (newMessageId.indexOf(ans.result.data[i]._id) === -1 && keyword.sites.indexOf(ans.result.data[i].source) !== -1) {
                        
                            ans.result.data[i].isNew = true;
                            newMessage.unshift(ans.result.data[i]);
                            newMessageId.unshift(ans.result.data[i]._id);
                            newMessageIsNew[ans.result.data[i]._id] = true;  //新来一个消息肯定为true
                            count += 1;
                        }
                    }


                    if (count > 0) {
                        openNotificationWithIcon("success", keyword.name + " 成功获取新消息" + count + "条");
                    } else {
                        return;
                    }

                    newMessage.sort(function(a,b){
                        if (a.time === b.time)
                            return 0;
                        if (a.time < b.time)
                            return 1;
                        return -1;
                    });

                    newMessage = newMessage.slice(0, 50);


                    this.setState(preState => ({
                        ...preState,
                        message: newMessage,
                        showMessage: newMessage.slice(0, 10),
                        messageId: newMessageId,
                        messageIsNew: newMessageIsNew,
                        newMessageNum: newMessageNum + count,
                        time: this.getNowFormatDate(),
                        total: newMessage.length,
                    }));
                } else {
                    openNotificationWithIcon("error", ans.message);
                }
            },
            error => errorProcess(error)
        )
    };

    play = (event) => {

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
            }, 10000 );
            openNotificationWithIcon('success', '开始监控');
            console.log(keyword.name + " has been started to get data");
        }

        event.stopPropagation();

    };

    fresh = (event) => {

        this.setState(
            preState => ({
                ...preState,
                message: [],
                messageId: [],
            })
        );
        this.monitor(false);
        event.stopPropagation();
    };

    pageChange = (page, pageSize) => {
        this.setState(preState => ({
            ...preState,
            showMessage: this.state.message.slice((page - 1) * 10, page * 10),
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
        let remindMsg = '(无待读消息)';
        if (this.state.newMessageNum > 0) {
            remindMsg = '(未读消息数: ' + this.state.newMessageNum + ')';
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
                            <Icon type="file-text"/><span> {keyword.name}</span>
                            <span style={{marginLeft:15,fontSize: 14}}>{remindMsg}</span>
                        </div>
                    } key="1" >

                        <div ref={this.props.keyword} style={{ overflow: 'auto', height: this.state.containerHeight }}>
                            <div>
                                {
                                    showMessage.map((item, index) => <div onMouseOver={event=>this.newToOld(event, item._id)}><OneMsgPage content={item} contentType={item['contentType']} isNew = {this.state.messageIsNew[item._id]}/></div>)
                                }

                            </div>
                        </div>
                        <Pagination defaultCurrent={this.state.defaultPage} pageSize={this.state.pageSize} total={this.state.total} onChange={(page, pageSize)=> this.pageChange(page, pageSize)}/>
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

const connectedMsgShow = connect(mapStateToProps)(MsgShow);
export { connectedMsgShow as MsgShow };
