import React from 'react';
import {CSVLink} from 'react-csv';
import { Table } from 'antd';

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';

class CollectionNewsPage extends React.Component {

    state = {
        weiboColumns: [
            {title: '发布者', dataIndex: 'publisher'} ,
            {title: '正文', dataIndex: 'content', sorter: (a, b) => a.content.length - b.content.length,},
            {title: '点赞量', dataIndex: 'likeNum', sorter: (a, b) => a.likeNum - b.likeNum,},
            {title: '评论量', dataIndex: 'commentNum', sorter: (a, b) => a.commentNum - b.commentNum,},
            {title: '转发量', dataIndex: 'transferNum', sorter: (a, b) => a.transferNum - b.transferNum,},
            {title: '发表时间', dataIndex: 'publishTime', sorter: (a, b) => a.publishTime.length - b.publishTime.length,},
            {title: '关键字', dataIndex: 'keyword'},
            {title: '源地址', dataIndex: 'source'},
            {title: '正负面', dataIndex: 'sentiment'},
            {title: '操作', key: 'action', render: (record) => (
                <span>
                    <a href=" " title="发送"><i className="fa fa-fw fa-send-o"/></a>
                    <CSVLink data={this.objToJSON(record)}
                             filename={new Date().toLocaleString()}
                             target="_blank"
                             title="导出">
                        <i className="fa fa-fw fa-share-square-o"/>
                    </CSVLink>
                    <a href=" " title="删除"><i className="fa fa-trash-o"/></a>
                </span>
            )},

        ],
        weiboData: [
            {'publisher': 'oyyw', 'content': '哈哈哈', 'likeNum': 20, 'commentNum': 30, 'transferNum': 40, 'publishTime':'2016-10-20', 'keyword': '成考', 'source': 'www.baidu.com','sentiment':'正'},
            {'publisher': 'oyyyw', 'content': '哈哈哈哈', 'likeNum': 40, 'commentNum': 60, 'transferNum': 70, 'publishTime':'2016-10-20', 'keyword': '成考', 'source': 'www.baidu.com', 'sentiment':'负'}
        ]

    };

    objToJSON = (record) => {
        let str = JSON.stringify([record]); // object list to str
        return JSON.parse(str);   // str to json
    };

    render() {
        return (
            <div className="content-wrapper" style={{marginLeft:0}}>
                <div className="container-fluid">
                    <div className="row">
                        {/*具体微博展示*/}
                        <div className="card" style={{width:"100%"}}>
                            <div className="card-header">
                                <i className="fa fa-table"/>收藏的微博</div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <Table columns={this.state.weiboColumns} dataSource={this.state.weiboData} />
                                </div>
                            </div>
                            <div className="card-body py-2 small">
                                <a className="mr-3 d-inline-block" href="  "><i className="fa fa-fw fa-send-o"/>发送</a>
                                <CSVLink data={this.state.weiboData}
                                         filename={new Date().toLocaleString()}
                                         target="_blank"
                                         title="导出"
                                         className="mr-3 d-inline-block"
                                >
                                    <i className="fa fa-fw fa-share-square-o"/>导出
                                </CSVLink>
                                <a className="mr-3 d-inline-block" href="  "><i className="fa fa-fw fa-trash-o"/>删除</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export { CollectionNewsPage };
