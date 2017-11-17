import React from 'react';
import { CSVLink } from 'react-csv';
import { Table } from 'antd';
import { connect } from 'react-redux';
import { collectionActions } from '../_actions';

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
                    <a href=" " title="删除"><i className="fa fa-trash-o" onClick={this.deleteCollection(record.id)}/></a>
                </span>
            )},

        ],
        weiboData: [
            {'publisher': 'oyyw', 'content': '哈哈哈', 'likeNum': 20, 'commentNum': 30, 'transferNum': 40, 'publishTime':'2016-10-20', 'keyword': '成考', 'source': 'www.baidu.com','sentiment':'正'},
            {'publisher': 'oyyyw', 'content': '哈哈哈嗝', 'likeNum': 40, 'commentNum': 60, 'transferNum': 70, 'publishTime':'2016-10-20', 'keyword': '成考', 'source': 'www.baidu.com', 'sentiment':'负'}
        ],
        searchedWeibo: [
            {'publisher': 'oyyw', 'content': '哈哈哈', 'likeNum': 20, 'commentNum': 30, 'transferNum': 40, 'publishTime':'2016-10-20', 'keyword': '成考', 'source': 'www.baidu.com','sentiment':'正', 'id': 0},
            {'publisher': 'oyyyw', 'content': '哈哈哈哈嗝', 'likeNum': 40, 'commentNum': 60, 'transferNum': 70, 'publishTime':'2016-10-20', 'keyword': '成考', 'source': 'www.baidu.com', 'sentiment':'负', 'id': 1}
        ],
        searchWeiboContent: ""

    };

    objToJSON = (record) => {
        let str = JSON.stringify([record]); // object list to str
        return JSON.parse(str);   // str to json
    };

    searchWeibo = () => {
        let searchedWeibo = [];
        for (let i = 0; i < this.state.weiboData.length; ++i) {
            if (this.state.weiboData[i]['content'].indexOf(this.state.searchWeiboContent) !== -1) {
                searchedWeibo.push(this.state.weiboData[i]);
            }
        }
        console.log(searchedWeibo);
        this.setState(
            preState => ({
                ...preState,
                searchedWeibo: searchedWeibo
            })
        );
    };

    handlechange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    deleteCollection = (id) => {
        const {user} = this.props;
        collectionActions.delCollection(user, id);
    };

    render() {
        return (
            <div className="content-wrapper" style={{marginLeft:0}}>
                <div className="container-fluid">
                    <div className="row">
                        {/*具体微博展示*/}
                        <div className="card" style={{width:"100%"}}>
                            <div className="card-header">
                                <i className="fa fa-table"/>收藏的微博
                                <div style={{float:"right"}}>
                                    <div className="input-group">
                                        <input className="form-control" type="text" placeholder="搜正文..." onChange={this.handlechange} name={"searchWeiboContent"}/>
                                        <span className="input-group-btn">
                                            <button className="btn btn-primary" type="button" onClick={this.searchWeibo}>
                                                <i className="fa fa-search"/>
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <Table columns={this.state.weiboColumns} dataSource={this.state.searchedWeibo} />
                                </div>
                            </div>
                            <div className="card-body py-2 small">
                                <a className="mr-3 d-inline-block" href="  "><i className="fa fa-fw fa-send-o"/>发送</a>
                                <CSVLink data={this.state.searchedWeibo}
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


function mapStateToProps(state) {
    const { authentication } = state;
    const { user } = authentication;
    return {
        user
    };
}

const connectedCollectionNewsPage = connect(mapStateToProps)(CollectionNewsPage);
export { connectedCollectionNewsPage as CollectionNewsPage };

