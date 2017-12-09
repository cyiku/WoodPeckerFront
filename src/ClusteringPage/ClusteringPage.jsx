import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';
import { CSVLink } from 'react-csv';
import {serverIP} from '../_helpers';
import { history } from '../_helpers';

import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';

class ClusteringPage extends React.Component {

    state = {
        columns : [
            {title: '话题ID', dataIndex: 'id'},
            {title: '相关词', dataIndex: 'word'},
        ],
        content: [
            {'id': 1, 'word': ""},
        ],
        time: "2017年12月6号"
    };
    constructor(props){
        super(props);
    }

    componentDidMount(){
        const {user} = this.props;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token },
            body: JSON.stringify({})
        };
        console.log(requestOptions);

        fetch(serverIP + '/getClustering', requestOptions).then(
            response => {
                if (!response.ok) {
                    return Promise.reject(response.statusText);
                }
                return response.json();
            }
        ).then(
            ans => {
                if(ans.status === 1) {
                    console.log(ans.result);
                    this.setState(preState => ({
                        ...preState,
                        content: ans.result.topic
                    }));
                } else {
                    alert(ans.message);
                    if (ans.status === -1)
                        history.push("/login");
                }
            },
            error => {
                if (error.message === "Failed to fetch") {
                    alert("登录过期, 请重新登录");
                } else {
                    alert("服务器内部错误,请联系管理员,抱歉！");
                }
                history.push("/login");
            }
        )
    }

    render() {

        let { columns, content, time } = this.state;

        return (
            <div className="card mb-3">
                <div className="card-header">
                    <i className="fa fa-table">话题聚类, 更新于: {time}</i>

                </div>


                <div className="card-body">
                    <div className="table-responsive">
                        <Table columns={columns} dataSource={content} rowKey={'id'}/>
                    </div>
                </div>


                <div className="card-body py-2 small">

                    <CSVLink data={content}
                             filename={new Date().toLocaleString()}
                             target="_blank"
                             title="导出"
                             className="mr-3 d-inline-block"
                    >
                        <i className="fa fa-fw fa-share-square-o"/>导出
                    </CSVLink>
                    <a className="d-inline-block" href="  "><i className="fa fa-fw fa-send-o"/>发送</a>
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

const connectedClusteringPage = connect(mapStateToProps)(ClusteringPage);
export { connectedClusteringPage as ClusteringPage };