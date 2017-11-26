import React from 'react';
import {MyTablePage} from "./myTable";
import { connect } from 'react-redux';

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';


class DetailedWeiboPage extends React.Component {

    state = {
        weiboColumns: [
            {title: '发布者', dataIndex: 'publisher'},
            {title: '正文', dataIndex: 'content', sorter: (a, b) => a.content.length - b.content.length,},
            {title: '点赞量', dataIndex: 'likeNum', sorter: (a, b) => a.likeNum - b.likeNum,},
            {title: '评论量', dataIndex: 'commentNum', sorter: (a, b) => a.commentNum - b.commentNum,},
            {title: '转发量', dataIndex: 'transferNum', sorter: (a, b) => a.transferNum - b.transferNum,},
            {title: '发表时间', dataIndex: 'publishTime', sorter: (a, b) => a.publishTime.length - b.publishTime.length,},
            {title: '关键字', dataIndex: 'keyword'},
            {title: '源地址', dataIndex: 'source'},
            {title: '正负面', dataIndex: 'sentiment'},

        ],
        weiboData: [
            {'publisher': 'oyyw', 'content': '哈哈哈', 'likeNum': 20, 'commentNum': 30, 'transferNum': 40, 'publishTime':'2016-10-20', 'keyword': '成考', 'source': 'www.baidu.com','sentiment':'正', 'id': 0},
            {'publisher': 'oyyyw', 'content': '哈哈哈嗝', 'likeNum': 40, 'commentNum': 60, 'transferNum': 70, 'publishTime':'2016-10-20', 'keyword': '成考', 'source': 'www.baidu.com', 'sentiment':'负', 'id': 1},
        ],
    };

    componentDidMount(){
        //这里应该获取关键字对应的全部的微博数据
    }


    render() {
        const type = "weibo";
        const content = this.state.weiboData;
        const columns = this.state.weiboColumns;
        const title = "相关微博";
        const typeCollection = this.props.collection['weibo'];
        return (
            <MyTablePage content={content} columns={columns} type={type} title={title} typeCollection={typeCollection}/>
        );
    }
}


function mapStateToProps(state) {
    const { authentication, collection } = state;
    const { user } = authentication;
    return {
        user, collection
    };
}

const connectedDetailedWeiboPage= connect(mapStateToProps)(DetailedWeiboPage);
export { connectedDetailedWeiboPage as DetailedWeiboPage };

