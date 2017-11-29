import React from 'react';
import { connect } from 'react-redux';
import {serverIP} from '../_helpers';
import { history } from '../_helpers';


// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';


class DataSourcePage extends React.Component {

    state = {
        forum: 0,
        weibo: 0,
        portal: 0,
        agency: 0,
    }

    componentDidMount(){

        const { currentKwd } = this.props;
        /*
        if (currentKwd !== undefined) {
            const {user} = this.props;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'id': user.id, 'token': user.token, 'keyword': currentKwd })
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
                    if(ans.status) {
                        this.setState(preState => ({
                            ...preState,
                            forum: ans.num.forum,
                            weibo: ans.num.weibo,
                            portal: ans.num.portal,
                            agency: ans.num.agency,
                        }));
                    } else {
                        alert(ans.reason);
                        if (ans.logout)
                            history.push("/login");
                    }
                },
                error => {
                    alert("服务器内部错误,请联系管理员,抱歉！");
                    history.push("/login");
                }
            )
        }
        */
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

