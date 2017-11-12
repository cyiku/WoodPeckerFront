import React from 'react';
import { Link } from 'react-router-dom';
import { Collapse } from 'antd';

// 添加store
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';
import './MonitoringPage.css';

const Panel = Collapse.Panel;

// 添加store功能
const loggerMiddleware = createLogger();

/*
const store = createStore(
    ,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
);
*/


class MsgShow extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            keyword: this.props.keyword,
        }
    }


    componentDidMount(){

        this.connection = new WebSocket('ws://localhost:8080/websocket.ws');

        this.connection.onmessage = evt => {
            console.log(evt.data)
        };

        /* 前端向后端发送定时请求
        this.interval = setInterval(_ => {
            this.connection.send(JSON.stringify({'token': user.token}))
        }, 2000 )
        */

    }

    componentWillUnmount(){
        // clearInterval(this.interval);
        this.connection.close();
    }


    render() {
        return (
            <div className="col-md-4">

                <Collapse defaultActiveKey={['1']} style={{marginTop:10}}>
                    <Panel header= {
                        <div>
                            <i className="fa fa-newspaper-o"><span>成考</span></i>
                            <div style={{float: 'right'}}>
                                <Link to="/" className="mr-3 d-inline-block"><i className="fa fa-refresh"/></Link>
                                <Link to="/kwAnalysis" className="mr-3 d-inline-block"><i className="fa fa-area-chart"/></Link>
                            </div>
                        </div>
                    } key="1">
                        <div>
                            {/*Example Social Card*/}
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
                        </div>
                    </Panel>
                </Collapse>

            </div>
        );
    }
}

export { MsgShow };
