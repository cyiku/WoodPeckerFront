import React from 'react';
import { connect } from 'react-redux';
import { history } from '../_helpers';
import { Link } from 'react-router-dom';


// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';

class MonitoringPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            keyword: [],
        }
    }

    getKws = user => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'id': user.id, 'token': user.token })
        };
        return fetch('http://localhost:8080/getKws', requestOptions).then(response => {
            if (!response.ok) {
                return Promise.reject(response.statusText);
            }
            return response.json();
        }).then(
            ans => {
                if(!ans.status) {
                    alert(ans.reason);
                    history.push("/login");
                }
                this.setState({...this.state, keyword:ans.keyword});
            },
            error => {
                alert("服务器内部错误,请联系管理员,抱歉！");
                history.push("/login");
            }
        );
    };

    componentDidMount(){
        const { user } = this.props;

        // websocket
        this.getKws(user);

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
            <div className="content-wrapper" style={{marginLeft:0}}>
                <div className="container-fluid">
                    <div>
                        {
                            this.state.keyword.map( keyword=>
                                <button type="button" className="btn btn-primary" style={{marginLeft:10}}>{keyword}</button>
                            )
                        }
                        <button type="button" className="btn btn-danger"  style={{marginLeft:10}}><Link to="/keywords" style={{color:"white"}}>管理关键字</Link></button>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <div>
                                {/*Card Columns Example Social Feed*/}
                                <div className="mb-0 mt-4">
                                    <i className="fa fa-newspaper-o">成考</i>
                                    <Link to="/kwAnalysis" style={{float: 'right'}}>话题分析</Link>
                                </div>
                                <hr className="mt-2" />
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
                                        {/*Example Social Card*/}
                                        <div className="card mb-3">
                                            <div className="card-body">
                                                <h6 className="card-title mb-1"><a href=" ">路人乙</a></h6>
                                                <a href=" " className="card-text small"><font color="red">成考</font>太难了，出题人买方便面没调料!!
                                                </a>
                                            </div>
                                            <a href=" ">
                                                <img className="card-img-top img-fluid w-100" src="https://unsplash.it/700/450?image=610" alt="" />
                                            </a>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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

const connectedMonitoringPage= connect(mapStateToProps)(MonitoringPage);
export { connectedMonitoringPage as MonitoringPage };
