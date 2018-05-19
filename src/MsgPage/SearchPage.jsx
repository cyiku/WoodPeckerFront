import React from 'react';
import {ShowTablePage} from "./ShowTablePage";
import { connect } from 'react-redux';
import {serverIP} from '../_helpers';
import { history } from '../_helpers';
import { Popover } from 'antd';
import { openNotificationWithIcon } from "../_helpers";
import { cmpTime } from '../_helpers';
import {errorProcess} from "../_helpers/error";

class SearchPage extends React.Component {

    state = {
        weiboColumns: [
            {title: '发布者', dataIndex: 'authid'} ,
            {title: '正文', className: 'content', width: "40%",render: (record) => (
                <Popover content={
                    <div style={{width: 400}}>
                        <p dangerouslySetInnerHTML={{__html: this.markSearch(record.content, record.keyword)}}/>
                    </div>
                } title="全文内容">
                    <p>{record.content}</p>
                </Popover>)},
            {title: '点赞量', dataIndex: 'n_like', sorter: (a, b) => a.n_like - b.n_like,},
            {title: '评论量', dataIndex: 'n_comment', sorter: (a, b) => a.n_comment - b.n_comment,},
            {title: '转发量', dataIndex: 'n_forward', sorter: (a, b) => a.n_forward - b.n_forward,},
            {title: '发表时间', dataIndex: 'time', sorter: (a, b) => cmpTime(a,b)},
            {title: '原文', key: 'url', render: (record) => (<a href={record.url} target={"_blank"}>原文</a>)},
        ],

        forumColumns: [
            {title: '发布者', dataIndex: 'authid'},
            {title: '正文', className: 'content', width: "40%", render: (record) => (
                <Popover content={
                    <div style={{width: 400}}>
                        <p dangerouslySetInnerHTML={{__html: this.markSearch(record.content, record.keyword)}}/>
                    </div>
                } title="全文内容">
                    <p>{record.content}</p>
                </Popover>)},
            {title: '点击量', dataIndex: 'n_click', sorter: (a, b) => a.n_click - b.n_click,},
            {title: '转发量', dataIndex: 'n_reply', sorter: (a, b) => a.n_reply - b.n_reply,},
            {title: '来源', dataIndex: 'source'},
            {title: '发表时间', dataIndex: 'time', sorter: (a, b) => cmpTime(a,b)},
            {title: '关键字', dataIndex: 'keyword'},
            {title: '原文', key: 'url', render: (record) => (<a href={record.url} target={"_blank"}>原文</a>)},
        ],

        portalColumns: [
            {title: '标题', dataIndex: 'title', width: "20%"},
            {title: '正文', className: 'content', width: "40%", render: (record) => (
                <Popover content={
                    <div style={{width: 400}}>
                        <p dangerouslySetInnerHTML={{__html: this.markSearch(record.content, record.keyword)}}/>
                    </div>
                } title="全文内容">
                    <p>{record.content}</p>
                </Popover>)},
            {title: '来源', dataIndex: 'source'},
            {title: '发表时间', dataIndex: 'time', sorter: (a, b) => cmpTime(a,b)},
            {title: '关键字', dataIndex: 'keyword'},
            {title: '原文', key: 'url', render: (record) => (<a href={record.url} target={"_blank"}>原文</a>)},
        ],

        agencyColumns: [
            {title: '标题', dataIndex: 'title', width: "20%"},
            {title: '正文', className: 'content', width: "40%", render: (record) => (
                <Popover content={
                    <div style={{width: 400}}>
                        <p dangerouslySetInnerHTML={{__html: this.markSearch(record.content, record.keyword)}}/>
                    </div>
                } title="全文内容">
                    <p>{record.content}</p>
                </Popover>)},
            {title: '来源', dataIndex: 'source'},
            {title: '发表时间', dataIndex: 'time', sorter: (a, b) => cmpTime(a,b)},
            {title: '关键字', dataIndex: 'keyword'},
            {title: '原文', key: 'url', render: (record) => (<a href={record.url} target={"_blank"}>原文</a>)},
        ],

        searchContent: undefined,
        lastSearch: '',
    };

    componentDidMount(){
        // window.alert('mount');
        const {user, dispatch} = this.props;
        let value;
        if (typeof(this.props.location.state) !== "undefined") {
            value = this.props.location.state.value;
        }
        this.setState(preState => ({
            ...preState,
            searchContent: value
        }));
    }

    componentDidUpdate(){
        let value;
        // window.alert('update');
        if (typeof(this.props.location.state) !== "undefined") {
            value = this.props.location.state.value;
        }
        if (value !== this.state.searchContent) {
            this.setState(preState => ({
                ...preState,
                searchContent: value,
            }));
        }
    }


    // 将消息中的searchContent标记为红色
    markSearch = (content, search) => {
        // 分割search
        const search_list = search.split('_');

        for (let i = 0; i < search_list.length; ++i) {
            //content.replace(search_list[i], '<span style="color: red">'+search_list[i]+'</span>')
            content = content.replace(new RegExp(search_list[i], "gm"), '<span style="color: red">'+search_list[i]+'</span>');
        }
        //console.log(content);
        return content;
    };


    render() {
        const searchContent = this.state.searchContent;
        if (searchContent === undefined)
            return <div>正在加载中</div>;

        return (
            <div style={{marginLeft:15, marginTop:15}}>
                <div style={{marginTop:15}}>
                    <ShowTablePage 
                                   columns={this.state.weiboColumns}
                                   type={"weibo"}
                                   title={" 相关微博"}
                                   collection={this.props.collection['weibo']}
                                   keyword={searchContent}
                                   />
                </div>
                <div style={{marginTop:15}}>
                    <ShowTablePage 
                                   columns={this.state.forumColumns}
                                   type={"forum"}
                                   title={" 相关论坛"}
                                   collection={this.props.collection['forum']}
                                   keyword={searchContent}/>
                </div>
                <div style={{marginTop:15}}>
                    <ShowTablePage 
                                   columns={this.state.portalColumns}
                                   type={"portal"}
                                   title={" 门户网站"}
                                   collection={this.props.collection['portal']}
                                   keyword={searchContent}/>
                </div>
                <div style={{marginTop:15}}>
                    <ShowTablePage 
                                   columns={this.state.agencyColumns}
                                   type={"agency"}
                                   title={" 培训机构"}
                                   collection={this.props.collection['agency']}
                                   keyword={searchContent}/>
                </div>
            </div>

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

const connectedSearchPage = connect(mapStateToProps)(SearchPage);
export { connectedSearchPage as SearchPage };

