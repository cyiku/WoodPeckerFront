import React from 'react';
import { Link } from 'react-router-dom';
import { Collapse } from 'antd';
//import { connect } from 'react-redux';
// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import './MonitoringPage.css';

/*
// 添加store功能
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import {myWebsocket} from "../_reducers/websocket.reducer";

const loggerMiddleware = createLogger();
const store = createStore(
    myWebsocket,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
);
*/

const Panel = Collapse.Panel;


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
        this.connection = new WebSocket('ws://localhost:8080/websocket.ws');

        this.connection.onmessage = evt => {

            let newContent = this.state.content;
            newContent.unshift(evt.data);

            this.setState(
                preState => ({
                    ...preState,
                    content: newContent,
                })
            );
            //console.log(newContent);
        };

        this.connection.onopen = () => {
            console.log(keyword.name + " has been connected");
            this.connection.send(JSON.stringify({'id': user.id, 'token': user.token, 'name': keyword.name, 'type': 'play'}));
            console.log(keyword.name + " has been started to get data");
        };



        /* 前端向后端发送定时请求
        this.interval = setInterval(_ => {
            this.connection.send(JSON.stringify({'id': user.id, 'token': user.token}))
        }, 2000 )
        */

    }

    componentWillUnmount(){
        //clearInterval(this.interval);
        this.connection.close();
    }

    play = (event) => {

        const {user, keyword} = this.props;

        let className = event.target.getAttribute("class");
        if (className === "fa fa-pause mr-3 d-inline-block") {
            event.target.setAttribute("class", "fa fa-play mr-3 d-inline-block");
            this.connection.send(JSON.stringify({'id': user.id, 'token': user.token, 'name': keyword.name, 'type': 'pause'}));
            console.log(keyword.name + " has been paused");
        } else {
            event.target.setAttribute("class", "fa fa-pause mr-3 d-inline-block");
            this.connection.send(JSON.stringify({'id': user.id, 'token': user.token, 'name': keyword.name, 'type': 'play'}));
            console.log(keyword.name + " has been started to get data");
        }

        event.stopPropagation();

    };


    render() {
        const {keyword} = this.props;
        return (
            <div className="col-md-3">

                <Collapse defaultActiveKey={['1']} style={{marginTop:10}}>
                    <Panel header= {
                        <div>
                            <i className="fa fa-newspaper-o"> <span>{keyword.name}</span></i>
                            <div style={{float: 'right'}} onClick={event => event.stopPropagation()}>
                                <a href="#"><i className="fa fa-pause mr-3 d-inline-block" onClick={this.play}/></a>
                                <Link to="/" className="mr-3 d-inline-block"><i className="fa fa-refresh"/></Link>
                                <Link to="/kwAnalysis" className="mr-3 d-inline-block"><i className="fa fa-bar-chart"/></Link>
                            </div>
                        </div>
                    } key="1" >

                        <div style={{height:500, overflow: "auto"}}>
                            {
                                this.state.content.map((oneContent, index)=>
                                    <p key={index}>
                                        {oneContent}
                                    </p>
                                )
                            }


                            {/*Example Social Card
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
                            */}
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