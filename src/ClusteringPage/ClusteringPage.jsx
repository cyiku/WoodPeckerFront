import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';
import { Card, Icon } from 'antd';
import { CSVLink } from 'react-csv';
import {serverIP} from '../_helpers';
import { history } from '../_helpers';
import { openNotificationWithIcon } from "../_helpers";
import {errorProcess} from "../_helpers/error";

class ClusteringPage extends React.Component {

    state = {
        columns : [
            {title: '话题ID', dataIndex: 'id', width: 200},
            {title: '相关词', dataIndex: 'word'},
        ],
        content: [
            {'id': 1, 'word': ""},
        ],
        time: ""
    };


    componentDidMount(){
        const {user} = this.props;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token },
            body: JSON.stringify({})
        };
        //console.log(requestOptions);
        console.log("getting clustering data...");
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
                    //console.log(ans.result);
                    this.setState(preState => ({
                        ...preState,
                        content: ans.result.topic,
                        time: ans.result.time
                    }));
                } else {
                    openNotificationWithIcon("error", ans.message);
                    if (ans.status === -1)
                        history.push("/login");
                }
            },
            error => errorProcess(error)
        )
    }

    render() {

        let { columns, content, time } = this.state;
        for (let i = 0; i < content.length; ++i)
            content[i]['word'] = content[i]['word'].replace(/'/g, '');
        return (
            <Card style={{marginTop: 15, marginLeft:15}} title={
                <span>话题聚类,更新于: {time.replace(/'/g, '')}</span>
            }>
                <Table columns={columns} dataSource={content} rowKey={'id'}/>
                <div>
                    <CSVLink data={content}
                             filename={new Date().toLocaleString()  + '.csv'}
                             target="_blank"
                             title="导出"
                    >
                        <Icon type="download" /> 导出
                    </CSVLink>
                </div>

            </Card>

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