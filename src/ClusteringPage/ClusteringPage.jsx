import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';
import { CSVLink } from 'react-csv';

import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';

class ClusteringPage extends React.Component {

    state = {
        columns : [
            {title: '话题ID', dataIndex: 'id'},
            {title: '相关词', dataIndex: 'words'},
        ],
        content: [
            {'id': 1, 'words': "成考: 40%, 考试: 30%, 十月: 20%, 答案: 10%"},
            {'id': 2, 'words': "购物: 40%, 双十一: 30%, 淘宝: 20%, 剁手: 10%"},
        ],
        time: "2017年12月6号"
    };
    constructor(props){
        super(props);
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