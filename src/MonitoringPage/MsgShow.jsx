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

// import VirtualList from 'react-virtual-list';
// 导入css
import './MonitoringPage.css';


const Panel = Collapse.Panel;

// const portalContent = {
//     '_id': 0,
//     'contentType': 'portal',
//     'source': '网易网',
//     'url': 'http://tech.163.com/17/1127/16/D48SJLQ900097U7H.html',
//     'title': '顶级科技大佬高端闭门会议，你也有机会参加!_网易科技',
//     'content': '近年来，随着电视制播技术的进步和电视终端产业的发展，部分机构经批准开展了4K超高清电视节目制播和传输出售。为促进超高清电视发展开展了有益的探索和实践，但也出现了管理不规范、技术质量不达标等问题。为规范和促进4K超高清电视健康有序发展，通知如下：',
//     'time': '2017_11_27_15_53',
//     'keyword': '出售',
// };
//
// const weiboContent = {
//     '_id': 1,
//     "attention": 0,
//     "contentType": "weibo",
//     'content': '近年来，随着电视制播技术的进步和电视终端产业的发展，部分机构经批准开展了4K超高清电视节目制播',
//     "keyword": "出售",
//     "n_comment": 0,
//     "n_forward": 0,
//     "n_like": 0,
//     "authid": "oyyw",
//     "source": "新浪微博",
//     "time": "2017_12_08_03_38_34",
//     "url": "http://tech.163.com/17/1127/16/D48SJLQ900097U7H.html",
// };
//
// const agencyContent = {
//     '_id': 2,
//     'contentType': 'agency',
//     'source': '海文考研',
//     'url': 'http://tech.163.com/17/1127/16/D48SJLQ900097U7H.html',
//     'title': '顶级科技大佬高端闭门会议，你也有机会参加!_网易科技',
//     'content': '近年来，随着电视制播技术的进步和电视终端产业的发展，部分机构经批准开展了4K超高清电视节目制播和传输出售。为促进超高清电视发展开展了有益的探索和实践，但也出现了管理不规范、技术质量不达标等问题。为规范和促进4K超高清电视健康有序发展，通知如下：',
//     'time': '2017_11_27_15_53',
//     'keyword': '出售',
// };
//
// const forumContent = {
//     '_id': 3,
//     'contentType': 'forum',
//     'source': '百度贴吧',
//     'url': 'http://tech.163.com/17/1127/16/D48SJLQ900097U7H.html',
//     'content': '近年来，随着电视制播技术的进步和电视终端产业的发展，部分机构经批准开展了4K超高清电视节目制播和传输出售。为促进超高清电视',
//     'n_click': 10,
//     'n_reply': 12,
//     'authid': "oyyw",
//     "time": "2017_12_08_03_38_34",
//     'keyword': '出售',
// };
//
// const contents = [weiboContent, portalContent, forumContent, agencyContent];

class MsgShow extends React.Component {


    constructor(props) {
        super(props);

        const {user, keyword} = this.props;
        const {token} = user;

        //let message = JSON.parse(localStorage.getItem(token + '_' + keyword.name) || "[]") || []

        this.state = {
            message: [],
            //messageId: JSON.parse(localStorage.getItem(token + '_' + keyword.name + '_id') || "[]") || [],
            messageId:[],
            showMessage: [],
            containerHeight: 651,
            total: 0,
            defaultPage: 0,
            pageSize: 10,
        }
    }

    componentDidMount(){

        // this.connection = new WebSocket('ws://114.212.86.148:8080/websocket.ws');
        // this.connection = new WebSocket('ws://localhost:8080/websocket.ws');
        // this.connection = new WebSocket('ws://192.168.1.130:4321');
        // this.connection.onmessage = evt => {
        //
        //     let newContent = this.state.content;
        //
        //     let newWeiboContent = JSON.parse(JSON.stringify(weiboContent));
        //
        //     newWeiboContent.publisher += count;
        //     count += 1;
        //     newContent.unshift(newWeiboContent);
        //
        //     this.setState(
        //         preState => ({
        //             ...preState,
        //             content: newContent,
        //         })
        //     );
        // };
        //
        // this.connection.onopen = () => {
        //     console.log(keyword.name + " has been connected");
        //     this.connection.send(keyword.name + "\n");
        //     console.log(keyword.name + " has been started to get data");
        // };
        
        this.monitor(true);
        this.interval = setInterval(_ => {
             this.monitor(false)
        }, 20000 );

    }

    // MyList = ({virtual, itemHeight}) => {
    //     return <ul style={virtual.style}>
    //         {
    //             virtual.items.map((item) => (
    //                     <li><OneMsgPage content={item} contentType={item['contentType']}/></li>
    //                 )
    //             )
    //         }
    //     </ul>;
    // };

    componentWillUnmount(){
        // const {user, keyword} = this.props;
        // const {token} = user;
        
        // // message数组里存的都是object,需要转成string存储
        // localStorage.setItem(token + '_' + keyword.name, JSON.stringify(this.state.message.slice(0, 10)));
        // localStorage.setItem(token + '_' + keyword.name + '_id', JSON.stringify(this.state.messageId.slice(0, 10)));
        clearInterval(this.interval);
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

        // isFirst变量是为了让用户新进入网站的时候有信息可看，还没实现
        const {user,keyword,dispatch} = this.props;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token },
            body: JSON.stringify({ 'name': keyword.name})
        };

        let requestIP;
        if (isFirst === true) {
            requestIP = serverIP + '/last20';
        } else {
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
                    let count = 0;
                    for (let i = 0; i < ans.result.data.length; ++i) {
                        if (newMessageId.indexOf(ans.result.data[i]._id) === -1 && keyword.sites.indexOf(ans.result.data[i].source) !== -1) {
                            newMessage.unshift(ans.result.data[i]);
                            newMessageId.unshift(ans.result.data[i]._id);
                            count += 1;
                        }
                    }

                    // test
                    // for (let j = 0; j < 5; ++j) {
                    //     for (let i = 0; i < contents.length; ++i) {
                    //             newMessage.unshift(contents[i]);
                    //             newMessageId.unshift(contents[i]._id);
                    //             count += 1;
                    //     }
                    // }


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

                    // const options = {
                    //     container: this.refs[keyword],
                    // };

                    this.setState(preState => ({
                        ...preState,
                        message: newMessage,
                        showMessage: newMessage.slice(0, 10),
                        messageId: newMessageId,
                        time: this.getNowFormatDate(),
                        total: newMessage.length,
                    }));
                } else {
                    openNotificationWithIcon("error", ans.message);
                    //if (ans.status === -1)
                    //    history.push("/login");
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


    render() {
        const {keyword} = this.props;
        let path = {
            pathname:'/kwAnalysis',
            state:keyword['name'],
        };
        const {showMessage} = this.state;
        const sortData = ['按重要度排序', '按负面影响排序', '按关注度排序', '按情感排序', '默认排序'];
        const sortContent = (
            <List
                bordered
                dataSource={sortData}
                renderItem={item => (<List.Item><a onClick={event => alert('后续推出, 敬请期待')}>{item}</a></List.Item>)}
            />
        );
        return (
            <div style={{height:"100% "}} name={keyword.name} id={keyword.name}>

                <Collapse defaultActiveKey={['1']} style={{marginTop:10, backgroundColor:"white"}}>
                    <Panel header= {
                        <div>
                            <div style={{float: 'right'}} onClick={event => event.stopPropagation()}>
                                <Popover content={sortContent} placement="bottom" >
                                    <Icon type="database" style={{fontSize:15, marginRight:10}}/>
                                </Popover>
                                <Icon type="pause-circle-o" onClick={this.play} style={{fontSize:15, marginRight:10}}/>
                                <Icon type="reload" onClick={this.fresh} style={{fontSize:15, marginRight:10}}/>
                                <Link to={path} style={{color:"black"}}><Icon type="line-chart" style={{fontSize:15, marginRight:10}}/></Link>
                            </div>
                            <Icon type="file-text"/><span> {keyword.name}</span>
                            {/*<span style={{marginLeft:10}}>更新于: {this.state.time}</span>*/}
                        </div>
                    } key="1" >

                        <div ref={this.props.keyword} style={{ overflow: 'auto', height: this.state.containerHeight }}>
                            <div>
                                {
                                    showMessage.map((item, index) => <OneMsgPage content={item} contentType={item['contentType']}/>)
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
    const {authentication} = state;
    const {user} = authentication;
    const {keyword} = ownProps;
    return {user, keyword};
}

const connectedMsgShow = connect(mapStateToProps)(MsgShow);
export { connectedMsgShow as MsgShow };
