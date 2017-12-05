import React from 'react';
import { Link } from 'react-router-dom';
import { Collapse } from 'antd';
import {openNotificationWithIcon} from "../_helpers";
import {OneMsgPage} from "./OneMsgPage";

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import './MonitoringPage.css';


const Panel = Collapse.Panel;

const weiboContent = {
    '_id': 1,
    'contentType': 'weibo',
    'publisher': '你是小猪咯',
    'n_comment':0,
    'n_forward': 0,
    'n_like': 0,
    'content': '看完广告默默打开肯德基APP挑起了外卖，愉快的点了，等快晚饭的时候就可以麻溜的下单啦<span class="url-icon"><img src="//h5.sinaimg.cn/m/emoticon/icon/default/d_yunbei-c6964bf237.png" style="width:1em;height:1em;" alt="[允悲]"></span><span class="url-icon"><img src="//h5.sinaimg.cn/m/emoticon/icon/default/d_yunbei-c6964bf237.png" style="width:1em;height:1em;" alt="[允悲]"></span><span class="url-icon"><img src="//h5.sinaimg.cn/m/emoticon/icon/default/d_yunbei-c6964bf237.png" style="width:1em;height:1em;" alt="[允悲]"></span>话说我好想喝肯德基的粥啊<a href=https://m.weibo.cn/n/肯德基">@肯德基</a>  真的不可以考虑粥全天出售吗',
    'url': 'https://weibo.cn/appurl?scheme=sinaweibo%3A%2F%2Fdetail%3Fmblogid%3D4178732706656653%26luicode%3D20000061%26lfid%3D4178732706656653%26featurecode%3D20000320&luicode=20000061&lfid=4178732706656653&featurecode=20000320',
    'time': '2017_11_27_16_22_56',
    'source': 'sina_weibo',
    'keyword': '出售',
};
let count = 0;
const portalContent = {
    '_id': 0,
    'contentType': 'portal',
    'source': '网易网',
    'url': 'http://tech.163.com/17/1127/16/D48SJLQ900097U7H.html',
    'title': '顶级科技大佬高端闭门会议，你也有机会参加!_网易科技',
    'content': '近年来，随着电视制播技术的进步和电视终端产业的发展，部分机构经批准开展了4K超高清电视节目制播和传输出售。为促进超高清电视发展开展了有益的探索和实践，但也出现了管理不规范、技术质量不达标等问题。为规范和促进4K超高清电视健康有序发展，通知如下：',
    'time': '2017_11_27_15_53',
    'keyword': '出售',
    'publisher': '记者',
};

const array = [weiboContent, portalContent];
class MsgShow extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            content: [],
        }
    }


    componentDidMount(){

        const {user, keyword} = this.props;
        console.log(keyword);

        //this.connection = new WebSocket('ws://114.212.86.148:8080/websocket.ws');
        //this.connection = new WebSocket('ws://localhost:8080/websocket.ws');
        //this.connection = new WebSocket('ws://192.168.1.130:4321');

        /*
        this.connection.onmessage = evt => {

            let newContent = this.state.content;

            let newWeiboContent = JSON.parse(JSON.stringify(weiboContent));

            newWeiboContent.publisher += count;
            count += 1;
            newContent.unshift(newWeiboContent);

            this.setState(
                preState => ({
                    ...preState,
                    content: newContent,
                })
            );
        };

        this.connection.onopen = () => {
            console.log(keyword.name + " has been connected");
            this.connection.send(keyword.name + "\n");
            console.log(keyword.name + " has been started to get data");
        };

        */

        /* 前端向后端发送定时请求
        this.interval = setInterval(_ => {
            this.connection.send(JSON.stringify({'id': user.id, 'token': user.token}))
        }, 2000 )
        */

    }

    componentWillUnmount(){
        //clearInterval(this.interval);
        //this.connection.close();
    }

    play = (event) => {

        const {user, keyword} = this.props;

        let className = event.target.getAttribute("class");
        if (className === "fa fa-pause mr-3 d-inline-block") {
            event.target.setAttribute("class", "fa fa-play mr-3 d-inline-block");
            this.connection.send(JSON.stringify({'id': user.id, 'token': user.token, 'name': keyword.name, 'type': 'pause'}));
            openNotificationWithIcon('success', '暂停成功');
            console.log(keyword.name + " has been paused");
        } else {
            event.target.setAttribute("class", "fa fa-pause mr-3 d-inline-block");
            this.connection.send(JSON.stringify({'id': user.id, 'token': user.token, 'name': keyword.name, 'type': 'play'}));
            console.log(keyword.name + " has been started to get data");
        }

        event.stopPropagation();

    };

    fresh = (event) => {

        this.setState(
            preState => ({
                ...preState,
                content: [],
            })
        );
        openNotificationWithIcon('success', '刷新成功');
        event.stopPropagation();
    };


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

        console.log(newContent);

        this.setState(
            preState => ({
                ...preState,
                content: newContent,
            })
        );
        count += 1;
    };


    render() {
        const {keyword} = this.props;
        let path = {
            pathname:'/kwAnalysis',
            state:keyword['name'],
        };

        return (
            <div className="col-md-4" style={{height:"100% "}}>

                <button type="button" className="btn btn-primary" onClick={this.addMsg1}>添加消息_insertBefore</button>
                <button type="button" className="btn btn-primary" onClick={this.addMsg2}>添加消息_updateState</button>

                <Collapse defaultActiveKey={['1']} style={{marginTop:10}}>
                    <Panel header= {
                        <div>
                            <i className="fa fa-newspaper-o"> <span>{keyword.name}</span></i>
                            <div style={{float: 'right'}} onClick={event => event.stopPropagation()}>
                                <a href="javascript:void(0);"><i className="fa fa-pause mr-3 d-inline-block" onClick={this.play}/></a>
                                <a href="javascript:void(0);"><i className="fa fa-refresh mr-3 d-inline-block" onClick={this.fresh}/></a>
                                <Link to={path} className="mr-3 d-inline-block"><i className="fa fa-bar-chart"/></Link>
                            </div>
                        </div>
                    } key="1" >

                        <div style={{height:600, overflow: "auto"}} id={123}>

                            {
                                this.state.content.map((oneContent, index)=>
                                        <OneMsgPage content={oneContent} contentType={oneContent['contentType']} key={index}/>

                                )
                            }

                        </div>
                    </Panel>
                </Collapse>

            </div>
        );
    }
}

/*
function mapStateToProps(state) {
    const { authentication, keyword } = state;
    const { user } = authentication;
    return {
        user, keyword
    };
}

const connectedMsgShow = connect(mapStateToProps)(MsgShow);
export { connectedMsgShow as MsgShow };
*/

export {MsgShow};