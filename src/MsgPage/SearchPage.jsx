import React from 'react';
import {ShowTablePage} from "./ShowTablePage";
import { connect } from 'react-redux';
import {serverIP} from '../_helpers';
import { history } from '../_helpers';
import { Popover } from 'antd';
import { openNotificationWithIcon } from "../_helpers";
import { cmpTime } from '../_helpers';

class SearchPage extends React.Component {

    state = {
        weiboColumns: [
            {title: '发布者', dataIndex: 'authid'} ,
            {title: '正文', className: 'content', width: "40%",render: (record) => (
                <Popover content={
                    <div style={{width: 400}}>
                        <p dangerouslySetInnerHTML={{__html: this.markSearch(record.content, record.search)}}/>
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
        searchContent: '',
    };

    componentDidMount(){
        //这里应该获取关键字对应的全部的微博数据
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
        if (typeof(this.props.location.state) !== "undefined") {
            value = this.props.location.state.value;
        }
        if (value !== this.state.searchContent) {
            this.setState(preState => ({
                ...preState,
                searchContent: value
            }));
        }
    }


    getData = (searchContent) => {

        const { dispatch } = this.props;
        console.log(searchContent + ' getting source data...');

        if (searchContent !== undefined && searchContent !== '') {
            const {user} = this.props;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token },
                body: JSON.stringify({ 'searchContent': searchContent })
            };
            console.log(searchContent);
            // fetch(serverIP + '/getWeibo', requestOptions).then(
            //     response => {
            //         if (!response.ok) {
            //             return Promise.reject(response.statusText);
            //         }
            //         return response.json();
            //     }
            // ).then(
            //     ans => {
            //         //console.log(ans.result);
            //         if(ans.status === 1) {
            //             this.setState(preState => ({
            //                 ...preState,
            //                 weiboData: ans.result
            //             }));
            //         } else {
            //             openNotificationWithIcon("error", ans.message);
            //             if (ans.status === -1)
            //                 history.push("/login");
            //         }
            //     },
            //     error => {
            //         if (localStorage.getItem('user') !== null) {
            //             //// dispatch(userActions.logout());
            //             if (error.message === "Failed to fetch") {
            //                 openNotificationWithIcon("error", "连接服务器失败");
            //             } else {
            //                 openNotificationWithIcon("error", "服务器内部错误,请联系管理员,抱歉！");
            //             }
            //         }
            //     }
            // )
        }
    };

    // 讲消息中的searchContent标记为红色
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

        if (searchContent !== '') {
            this.getData(searchContent);
        }

        const type = "weibo";
        //const data = (this.state.weiboData === null ? [] : this.state.weiboData);
        const data = this.state.weiboData;
        const columns = this.state.weiboColumns;
        const title = " 相关微博";
        const collection = this.props.collection['weibo'];

        return (
            <div style={{marginLeft:15, marginTop:15}}>
                <div style={{marginTop:15}}>
                    <ShowTablePage data={data} columns={columns} type={type} title={title} collection={collection}/>
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

