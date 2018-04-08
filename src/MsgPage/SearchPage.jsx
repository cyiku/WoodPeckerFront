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
            {title: '链接', key: 'url', render: (record) => (<a href={record.url} target={"_blank"}>url</a>)},
        ],
        weiboData: null,

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
            {title: '原文地址', key: 'url', render: (record) => (<a href={record.url} target={"_blank"}>原文地址</a>)},
        ],
        forumData: null,

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
        ],
        portalData: null,

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
            {title: '原文地址', key: 'url', render: (record) => (<a href={record.url} target={"_blank"}>原文地址</a>)},
        ],
        agencyData: null,

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

    getAgencyData = (searchContent) => {
        const { dispatch } = this.props;
        if (searchContent !== undefined && searchContent !== '') {
            console.log(searchContent + ' getting agency data...');
            const {user} = this.props;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token },
                body: JSON.stringify({ 'keyword': searchContent, 'search':1 })
            };

            if (searchContent !== this.state.lastSearch) {
                fetch(serverIP + '/getAgency', requestOptions).then(
                    response => {
                        if (!response.ok) {
                            return Promise.reject(response.statusText);
                        }
                        return response.json();
                    }
                ).then(
                    ans => {
                        //console.log(ans.result);
                        if(ans.status === 1) {
                            this.setState(preState => ({
                                ...preState,
                                agencyData: ans.result,
                                lastSearch:searchContent,
                            }));
                            openNotificationWithIcon("success", "培训机构搜索成功");
                        } else {
                            openNotificationWithIcon("error", ans.message);
                            if (ans.status === -1)
                                history.push("/login");
                        }
                    },
                    error => errorProcess(error)
                );
            }
        }
    };


    getForumData = (searchContent) => {
        const { dispatch } = this.props;
        if (searchContent !== undefined && searchContent !== '') {
            console.log(searchContent + ' getting forum data...');
            const {user} = this.props;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token },
                body: JSON.stringify({ 'keyword': searchContent, 'search':1 })
            };

            if (searchContent !== this.state.lastSearch) {
                fetch(serverIP + '/getForum', requestOptions).then(
                    response => {
                        if (!response.ok) {
                            return Promise.reject(response.statusText);
                        }
                        return response.json();
                    }
                ).then(
                    ans => {
                        //console.log(ans.result);
                        if(ans.status === 1) {
                            this.setState(preState => ({
                                ...preState,
                                forumData: ans.result,
                                lastSearch: searchContent,
                            }));
                            openNotificationWithIcon("success", "论坛搜索成功");
                        } else {
                            openNotificationWithIcon("error", ans.message);
                            if (ans.status === -1)
                                history.push("/login");
                        }
                    },
                    error => errorProcess(error)
                );
            }
        }
    };

    getPortalData = (searchContent) => {
        const { dispatch } = this.props;
        if (searchContent !== undefined && searchContent !== '') {
            console.log(searchContent + ' getting portal data...');
            const {user} = this.props;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token },
                body: JSON.stringify({ 'keyword': searchContent, 'search':1 })
            };

            if (searchContent !== this.state.lastSearch) {
                fetch(serverIP + '/getPortal', requestOptions).then(
                    response => {
                        if (!response.ok) {
                            return Promise.reject(response.statusText);
                        }
                        return response.json();
                    }
                ).then(
                    ans => {
                        //console.log(ans.result);
                        if(ans.status === 1) {
                            this.setState(preState => ({
                                ...preState,
                                portalData: ans.result,
                                lastSearch:searchContent,
                            }));
                            openNotificationWithIcon("success", "门户网站搜索成功");
                        } else {
                            openNotificationWithIcon("error", ans.message);
                            if (ans.status === -1)
                                history.push("/login");
                        }
                    },
                    error => errorProcess(error)
                );
            }
        }
    };

    getWeiboData = (searchContent) => {

        const { dispatch } = this.props;
        if (searchContent !== undefined && searchContent !== '') {
            console.log(searchContent + ' getting weibo data...');
            const {user} = this.props;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token },
                body: JSON.stringify({ 'keyword': searchContent, 'search':1 })
            };
            // console.log(searchContent);
            if (searchContent !== this.state.lastSearch) {
                fetch(serverIP + '/getWeibo', requestOptions).then(
                    response => {
                        if (!response.ok) {
                            return Promise.reject(response.statusText);
                        }
                        return response.json();
                    }
                ).then(
                    ans => {
                        //console.log(ans.result);
                        if(ans.status === 1) {
                            this.setState(preState => ({
                                ...preState,
                                weiboData: ans.result,
                                lastSearch:searchContent,
                            }));
                            openNotificationWithIcon("success", "微博搜索成功");
                        } else {
                            openNotificationWithIcon("error", ans.message);
                            if (ans.status === -1)
                                history.push("/login");
                        }
                    },
                    error => errorProcess(error)
                );
            }
        }
    };

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
        // window.alert(searchContent);

        if (searchContent !== this.state.lastSearch) {
            // if (searchContent === '') {
            //     openNotificationWithIcon('error', '搜索内容为空');
            // }
            // window.alert('getData');
            this.getWeiboData(searchContent);
            this.getPortalData(searchContent);
            this.getAgencyData(searchContent);
            this.getForumData(searchContent);
        }
        return (
            <div style={{marginLeft:15, marginTop:15}}>
                <div style={{marginTop:15}}>
                    <ShowTablePage data={this.state.weiboData}
                                   columns={this.state.weiboColumns}
                                   type={"weibo"}
                                   title={" 相关微博"}
                                   collection={this.props.collection['weibo']}/>
                </div>
                <div style={{marginTop:15}}>
                    <ShowTablePage data={this.state.forumData}
                                   columns={this.state.forumColumns}
                                   type={"forum"}
                                   title={" 相关论坛"}
                                   collection={this.props.collection['forum']}/>
                </div>
                <div style={{marginTop:15}}>
                    <ShowTablePage data={this.state.portalData}
                                   columns={this.state.portalColumns}
                                   type={"weibo"}
                                   title={" 门户网站"}
                                   collection={this.props.collection['portal']}/>
                </div>
                <div style={{marginTop:15}}>
                    <ShowTablePage data={this.state.agencyData}
                                   columns={this.state.agencyColumns}
                                   type={"agency"}
                                   title={" 培训机构"}
                                   collection={this.props.collection['agency']}/>
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

