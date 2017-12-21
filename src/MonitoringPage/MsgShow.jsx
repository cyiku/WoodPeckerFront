import React from 'react';
import { Link } from 'react-router-dom';
import { Collapse } from 'antd';
import { connect } from 'react-redux';
import {openNotificationWithIcon} from "../_helpers";
import {OneMsgPage} from "./OneMsgPage";
import {serverIP} from '../_helpers';
import { history } from '../_helpers';
import {userActions} from '../_actions';
import {alertActions} from "../_actions/alert.actions";
import VirtualList from 'react-virtual-list';
// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import './MonitoringPage.css';


const Panel = Collapse.Panel;


/*
const portalContent = {
    '_id': 0,
    'contentType': 'portal',
    'source': '网易网',
    'url': 'http://tech.163.com/17/1127/16/D48SJLQ900097U7H.html',
    'title': '顶级科技大佬高端闭门会议，你也有机会参加!_网易科技',
    'content': '近年来，随着电视制播技术的进步和电视终端产业的发展，部分机构经批准开展了4K超高清电视节目制播和传输出售。为促进超高清电视发展开展了有益的探索和实践，但也出现了管理不规范、技术质量不达标等问题。为规范和促进4K超高清电视健康有序发展，通知如下：',
    'time': '2017_11_27_15_53',
    'keyword': '出售',
};

const weiboContent = {
    '_id': 1,
    "attention": 0,
    "contentType": "weibo",
    'content': '近年来，随着电视制播技术的进步和电视终端产业的发展，部分机构经批准开展了4K超高清电视节目制播',
    "keyword": "出售",
    "n_comment": 0,
    "n_forword": 0,
    "n_like": 0,
    "authid": "oyyw",
    "source": "sina_weibo",
    "time": "2017_12_08_03_38_34",
    "url": "http://tech.163.com/17/1127/16/D48SJLQ900097U7H.html",
};

const agencyContent = {
    '_id': 2,
    'contentType': 'agency',
    'source': '海文考研',
    'url': 'http://tech.163.com/17/1127/16/D48SJLQ900097U7H.html',
    'title': '顶级科技大佬高端闭门会议，你也有机会参加!_网易科技',
    'content': '近年来，随着电视制播技术的进步和电视终端产业的发展，部分机构经批准开展了4K超高清电视节目制播和传输出售。为促进超高清电视发展开展了有益的探索和实践，但也出现了管理不规范、技术质量不达标等问题。为规范和促进4K超高清电视健康有序发展，通知如下：',
    'time': '2017_11_27_15_53',
    'keyword': '出售',
};

const forumContent = {
    '_id': 3,
    'contentType': 'forum',
    'source': '百度贴吧',
    'url': 'http://tech.163.com/17/1127/16/D48SJLQ900097U7H.html',
    'content': '近年来，随着电视制播技术的进步和电视终端产业的发展，部分机构经批准开展了4K超高清电视节目制播和传输出售。为促进超高清电视',
    'n_click': 10,
    'n_reply': 12,
    'authid': "oyyw",
    "time": "2017_12_08_03_38_34",
    'keyword': '出售',
};
*/

class MsgShow extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            message: [],
            containerHeight: 651,
            virtualList: null
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

    MyList = ({virtual, itemHeight}) => {
        // console.log(virtual);
        return <ul style={virtual.style}>
            {
                virtual.items.map((item) => (
                        <li><OneMsgPage content={item} contentType={item['contentType']}/></li>
                    )
                )
            }
        </ul>;
    };

    componentWillUnmount(){
        clearInterval(this.interval);
        //this.connection.close();
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
        let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        return currentdate;
    };

    monitor = (isFirst) => {

        const {user,keyword,dispatch} = this.props;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token },
            body: JSON.stringify({ 'name': keyword.name, 'first': isFirst })
        };

        console.log(keyword.name + ' monitor request...');
        fetch(serverIP + '/monitor', requestOptions).then(
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
                    if (ans.result.data.length > 0) {
                        openNotificationWithIcon("success", keyword.name + " 成功获取新消息" + ans.result.data.length + "条");
                    }
                    for (let i = ans.result.data.length - 1; i >= 0; --i) {
                        newMessage.unshift(ans.result.data[i]);
                    }
                    //console.log(ans.result.data[0]);
                    newMessage = newMessage.slice(0, 1000);
                    //newMessage.unshift(ans.result.data);
                    //newMessage.unshift({content: ans.result.data, updateTime: this.getNowFormatDate()});
                    //newUpdateTime.unshift(this.getNowFormatDate());
                    //console.log(newMessage);
                    const options = {
                        container: this.refs[keyword],
                    };
                    const MyVirtualList = VirtualList(options)(this.MyList);
                    this.setState(preState => ({
                        ...preState,
                        message: newMessage,
                        time: this.getNowFormatDate(),
                        virtualList: newMessage.length === 0 ? null : <MyVirtualList items={newMessage} itemHeight={217}/>
                    }));
                } else {
                    alert(ans.message);
                    if (ans.status === -1)
                        history.push("/login");
                }
            },
            error => {
                if (localStorage.getItem('user') !== null) {
                    dispatch(userActions.logout());
                    dispatch(alertActions.error(error));
                    if (error.message === "Failed to fetch") {
                        alert("登录过期, 请重新登录");
                    } else {
                        alert("服务器内部错误,请联系管理员,抱歉！");
                    }
                }
            }
        )
    };

    play = (event) => {

        const {keyword} = this.props;

        let className = event.target.getAttribute("class");
        if (className === "fa fa-pause mr-3 d-inline-block") {
            event.target.setAttribute("class", "fa fa-play mr-3 d-inline-block");
            clearInterval(this.interval);
            openNotificationWithIcon('success', '暂停成功');
            console.log(keyword.name + " has been paused");
        } else {
            event.target.setAttribute("class", "fa fa-pause mr-3 d-inline-block");
            this.interval = setInterval(_ => {
                this.monitor(false)
            }, 20000 );
            openNotificationWithIcon('success', '开始监控');
            console.log(keyword.name + " has been started to get data");
        }

        event.stopPropagation();

    };

    fresh = (event) => {

        this.setState(
            preState => ({
                ...preState,
                virtualList: null,
            })
        );
        this.monitor(false);
        openNotificationWithIcon('success', '刷新成功');
        event.stopPropagation();
    };

    /*
    addMsg1 = () => {
        let dom=document.getElementById(123);
        let newMsg = array[count % 2];
        newMsg._id = count;

        //div.setAttribute("value", <OneMsgPage content={newMsg} contentType={newMsg['contentType']}/>);
        let div = <OneMsgPage content={newMsg} contentType={newMsg['contentType']}/>;
        dom.insertBefore(div, dom.firstChild);
        count += 1;
    };


    addMsg2 = () => {
        let newContent = JSON.parse(JSON.stringify(this.state.content));

        let newMsg = array[count % 2];
        newMsg._id = count;

        newContent.unshift(newMsg);

        //console.log(newContent);

        this.setState(
            preState => ({
                ...preState,
                content: newContent,
            })
        );
        count += 1;
    };
    */


    render() {
        const {keyword} = this.props;
        let path = {
            pathname:'/kwAnalysis',
            state:keyword['name'],
        };

        // const MyList = ({virtual, itemHeight}) => {
        //
        //     console.log(virtual);
        //     return <ul>
        //         {
        //             /*
        //             virtual.items.map((item) => (
        //                     <li><OneMsgPage content={item} contentType={item['contentType']}/></li>
        //                 )
        //             )
        //             */
        //             [1,2,3,4,5,6,7,8,9,10].map((item) => (
        //                 <li style={{height: itemHeight}}>{'item' + item}</li>
        //             ))
        //         }
        //     </ul>;};
        //
        //
        // /*
        // const options = {
        //     initialState: {
        //         firstItemIndex: 0, // show first ten items
        //         lastItemIndex: 100,  // during initial render
        //     },
        // };
        // */
        //
        // const options = {
        //     container: this.refs.container,
        // };
        // const MyVirtualList = VirtualList(options)(MyList);
        //console.log(this.state.message.length);


        return (
            <div className="col-md-4" style={{height:"100% "}} name={keyword.name} id={keyword.name}>

                {/*<button type="button" className="btn btn-primary" onClick={this.addMsg1}>添加消息_insertBefore</button>
                <button type="button" className="btn btn-primary" onClick={this.addMsg2}>添加消息_updateState</button>*/}

                <Collapse defaultActiveKey={['1']} style={{marginTop:10}}>
                    <Panel header= {
                        <div>
                            <div style={{float: 'right'}} onClick={event => event.stopPropagation()}>
                                <a href="javascript:void(0);"><i className="fa fa-pause mr-3 d-inline-block" onClick={this.play}/></a>
                                <a href="javascript:void(0);"><i className="fa fa-refresh mr-3 d-inline-block" onClick={this.fresh}/></a>
                                <Link to={path} className="mr-3 d-inline-block"><i className="fa fa-bar-chart"/></Link>
                            </div>
                            <i className="fa fa-newspaper-o"> <span>{keyword.name}</span></i>
                            <i style={{marginLeft:10}}>更新于: {this.state.time}</i>
                        </div>
                    } key="1" >

                        <div id="container" ref={this.props.keyword} style={{ overflow: 'auto', height: this.state.containerHeight }}>

                            {/*{
                                this.state.content.map((oneContentList, index)=> (
                                    <div key={index}>
                                        <div style={{textAlign:"center", marginBottom: "5px"}} className={"card mb4"}>
                                            <span>更新于: {this.state.updateTime[index]}</span>
                                        </div>
                                        {
                                            oneContentList.map((oneContent, index2) => <OneMsgPage content={oneContent} contentType={oneContent['contentType']} key={index2} time={this.state.updateTime[index]}/>)
                                        }
                                    </div>
                                    )
                                )
                            }*/}
                            { this.state.virtualList }
                        </div>
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
