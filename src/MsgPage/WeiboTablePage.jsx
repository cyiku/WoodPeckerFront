import React from 'react';
import {ShowTablePage} from "./ShowTablePage";
import { connect } from 'react-redux';
import { collectionActions } from '../_actions';
import { Link } from 'react-router-dom';
import { keywordActions } from '../_actions';
import {serverIP} from '../_helpers';
import { history } from '../_helpers';
import { Button } from 'antd';
import { Popover } from 'antd';
import { openNotificationWithIcon } from "../_helpers";
import { cmpTime } from '../_helpers';
import {errorProcess} from "../_helpers/error";

class WeiboTablePage extends React.Component {

    state = {
        weiboColumns: [
            {title: '发布者', dataIndex: 'authid'} ,
            {title: '正文', className: 'content', width: "40%",render: (record) => (
                <Popover content={
                    <div style={{width: 400}}>
                        <p dangerouslySetInnerHTML={{__html: this.markKeyword(record.content, record.keyword)}}/>
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
        weiboData: null,
        currentKwd: '',
    };

    componentDidMount(){
        //这里应该获取关键字对应的全部的微博数据
        const {user, dispatch, keyword} = this.props;
        if (this.props.collection['weibo'] === null)
            dispatch(collectionActions.getCollection(user, 'weibo'));
        if (keyword === null)
            dispatch(keywordActions.getKws(user));
    }

    // 讲消息中的keyword标记为红色
    markKeyword = (content, keywords) => {
        // 分割keywords
        const keyword_list = keywords.split('_');
        //console.log(keyword_list);
        for (let i = 0; i < keyword_list.length; ++i) {
            //content.replace(keyword_list[i], '<span style="color: red">'+keyword_list[i]+'</span>')
            content = content.replace(new RegExp(keyword_list[i], "gm"), '<span style="color: red">'+keyword_list[i]+'</span>');
        }
        //console.log(content);
        return content;
    };

    getData = (keyword) => {

        const { dispatch } = this.props;
        console.log(keyword + ' getting source data...');

        if (keyword !== undefined) {
            const {user} = this.props;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token },
                body: JSON.stringify({ 'keyword': keyword })
            };

            fetch(serverIP + '/getWeibo', requestOptions).then(
                response => {
                    if (!response.ok) {
                        return Promise.reject(response.statusText);
                    }
                    return response.json();
                }
            ).then(
                ans => {
                    // console.log(ans.result);
                    if(ans.status === 1) {
                        this.setState(preState => ({
                            ...preState,
                            weiboData: ans.result
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
    };

    clickKeyword = (event) => {
        let targets = document.getElementsByClassName("keyword");

        for (let i = 0; i < targets.length; ++i) {
            targets[i].setAttribute("type", "default");
        }
        event.target.setAttribute("type", "primary");

        let newKwd = event.target.getAttribute("value");

        this.setState(preState => ({
            ...preState,
            currentKwd: newKwd,
            weiboData: null,
        }));

    };

    render() {
        let {keyword} = this.props;
        if (keyword === null)
            keyword = [];

        if(this.state.currentKwd === '' && keyword.length > 0) {
            this.setState(preState => ({
                ...preState,
                currentKwd: keyword[0].name
            }));
        }

        const {currentKwd} = this.state;

        let kwdButtonClass = {};

        for (let i = 0; i < keyword.length; i++) {
            if (keyword[i].name === currentKwd) {
                kwdButtonClass[keyword[i].name] = "primary";
            } else {
                kwdButtonClass[keyword[i].name] = "default";
            }
        }

        if (currentKwd !== '' && this.state.weiboData === null) {
            this.getData(currentKwd);
        }

        const type = "weibo";
        //const data = (this.state.weiboData === null ? [] : this.state.weiboData);
        const data = this.state.weiboData;
        const columns = this.state.weiboColumns;
        const title = " 相关微博";
        const collection = this.props.collection['weibo'];

        return (
            <div style={{marginLeft:15, marginTop:15}}>
                <div>
                    {
                        keyword.map( (oneKwd, index)=>
                            <Button
                                size="large"
                                type={kwdButtonClass[oneKwd.name]}
                                key={index}
                                onClick={this.clickKeyword}
                                value={oneKwd.name}
                                style={{marginRight:15}}
                            >
                                {oneKwd.name}
                            </Button>
                        )
                    }
                    <Button type="primary" size="large"><Link to="/keywords">管理关键字</Link></Button>
                </div>
                <div style={{marginTop:15}}>
                    <ShowTablePage data={data} columns={columns} type={type} title={title} collection={collection}/>
                </div>
            </div>

        );
    }
}


function mapStateToProps(state) {
    const { authentication, collection, keyword } = state;
    const { user } = authentication;
    return {
        user, collection, keyword
    };
}

const connectedWeiboTablePage = connect(mapStateToProps)(WeiboTablePage);
export { connectedWeiboTablePage as WeiboTablePage };

