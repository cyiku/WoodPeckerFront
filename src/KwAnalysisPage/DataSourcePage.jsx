import React from 'react';
import { connect } from 'react-redux';
import {serverIP} from '../_helpers';
import { history } from '../_helpers';
import {userActions} from "../_actions/user.actions";
import {alertActions} from "../_actions/alert.actions";
import { openNotificationWithIcon } from "../_helpers";

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';


class DataSourcePage extends React.Component {

    state = {
        keyword: '',
        forum: 0,
        weibo: 0,
        portal: 0,
        agency: 0,
    };

    getData = () => {
        const { currentKwd, dispatch } = this.props;

        console.log(currentKwd + ' getting source data...');

        if (currentKwd !== undefined) {
            const {user} = this.props;
            //openNotificationWithIcon('info', '获取数据源分布');
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token },
                body: JSON.stringify({ 'keyword': currentKwd })
            };

            fetch(serverIP + '/getDataSourceNum', requestOptions).then(
                response => {
                    if (!response.ok) {
                        return Promise.reject(response.statusText);
                    }
                    return response.json();
                }
            ).then(
                ans => {
                    if(ans.status === 1) {
                        openNotificationWithIcon('success', currentKwd + '获取发布量折线图成功');
                        this.setState(preState => ({
                            ...preState,
                            keyword: currentKwd,
                            forum: ans.result.num.forum,
                            weibo: ans.result.num.weibo,
                            portal: ans.result.num.portal,
                            agency: ans.result.num.agency,
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
        }
    };


    componentDidMount(){
        this.getData();
    }
    componentDidUpdate() {
        const { currentKwd } = this.props;
        if (currentKwd === this.state.keyword){

        } else {
            this.getData();
        }
    }


    render() {
        return (

            <div className="row" style={{marginTop:15}}>
                <div className="col-xl-3 col-sm-6 mb-3" >
                    <div className="card text-white bg-warning o-hidden h-100">
                        <div className="card-body">
                            <div className="card-body-icon">
                                <i className="fa fa-fw fa-file"/>
                            </div>
                            <div className="mr-5">论坛类：{this.state.forum}条</div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-sm-6 mb-3" >
                    <div className="card text-white bg-primary o-hidden h-100">
                        <div className="card-body">
                            <div className="card-body-icon">
                                <i className="fa fa-fw fa-weibo"/>
                            </div>
                            <div className="mr-5">微博类：{this.state.weibo}条</div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-sm-6 mb-3" >
                    <div className="card text-white bg-secondary o-hidden h-100">
                        <div className="card-body">
                            <div className="card-body-icon">
                                <i className="fa fa-fw fa-comments-o"/>
                            </div>
                            <div className="mr-5">门户网站类：{this.state.portal}条</div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-sm-6 mb-3" >
                    <div className="card text-white bg-success o-hidden h-100">
                        <div className="card-body">
                            <div className="card-body-icon">
                                <i className="fa fa-fw fa-child"/>
                            </div>
                            <div className="mr-5">培训机构类：{this.state.agency}条</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state, ownProps) {
    const { authentication } = state;
    const { user } = authentication;
    const { currentKwd } = ownProps;
    return {
        user, currentKwd
    };
}

const connectedDataSourcePage= connect(mapStateToProps)(DataSourcePage);
export { connectedDataSourcePage as DataSourcePage };

