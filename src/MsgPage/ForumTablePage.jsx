import React from 'react';
import {ShowTablePage} from "./ShowTablePage";
import { connect } from 'react-redux';
import { collectionActions } from '../_actions';
import { Link } from 'react-router-dom';
import { keywordActions } from '../_actions';
import {serverIP} from '../_helpers';
import { history } from '../_helpers';
import {userActions} from "../_actions/user.actions";
import { Popover } from 'antd';
import { openNotificationWithIcon } from "../_helpers";

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';

/*
const forumContent = {
    '_id': 3,
    'contentType': 'forum',
    'source': '百度贴吧',
    'url': 'http://tech.163.com/17/1127/16/D48SJLQ900097U7H.html',
    'content': '近年来，随着电视制播技术的进步和电视终端产业的发展，部分机构经批准开展了4K超高清电视节目制播和传输出售。为促进超高清电视',
    'n_click': 10,
    'n_reply': 12,
    'authid': "oyyw",
    "time": "2017_12_08_03_38_34",
    'keyword': '出售',
};
 */
class ForumTablePage extends React.Component {

    state = {
        forumColumns: [
            {title: '发布者', dataIndex: 'authid'},
            {title: '正文', className: 'content', width: "40%", render: (record) => (
                <Popover content={
                    <div style={{width: 400}}>
                        <p dangerouslySetInnerHTML={{__html: this.markKeyword(record.content, record.keyword)}}/>
                    </div>
                } title="全文内容">
                    <p>{record.content}</p>
                </Popover>)},
            {title: '点击量', dataIndex: 'n_click', sorter: (a, b) => a.n_click - b.n_click,},
            {title: '转发量', dataIndex: 'n_reply', sorter: (a, b) => a.n_reply - b.n_reply,},
            {title: '来源', dataIndex: 'source'},
            {title: '发表时间', dataIndex: 'time',},
            {title: '关键字', dataIndex: 'keyword'},
            {title: '原文地址', key: 'url', render: (record) => (<a href={record.url} target={"_blank"}>原文地址</a>)},
            {title: '正负面', key: 'sentiment', render: (record) => (<p>{record.sentiment > 0.5 ? "正" : "负"}</p>)},
        ],
        forumData: null,
        currentKwd: '',
    };

    markKeyword = (content, keywords) => {
        //console.log(content);
        //console.log(keywords);
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

    componentDidMount(){
        //这里应该获取关键字对应的全部的微博数据
        const {user, dispatch, keyword} = this.props;
        if (this.props.collection['forum'] === null) {
            dispatch(collectionActions.getCollection(user, 'forum'));
        }
        if (keyword === null)
            dispatch(keywordActions.getKws(user));
    }

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

            fetch(serverIP + '/getForum', requestOptions).then(
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
                            forumData: ans.result
                        }));
                    } else {
                        openNotificationWithIcon("error", ans.message);
                        if (ans.status === -1)
                            history.push("/login");
                    }
                },
                error => {
                    if (localStorage.getItem('user') !== null) {
                        // dispatch(userActions.logout());
                        if (error.message === "Failed to fetch") {
                            openNotificationWithIcon("error", "连接服务器失败");
                        } else {
                            openNotificationWithIcon("error", "服务器内部错误,请联系管理员,抱歉！");
                        }
                    }
                }
            )
        }
    };

    clickKeyword = (event) => {
        let targets = document.getElementsByClassName("keyword");

        for (let i = 0; i < targets.length; ++i) {
            targets[i].setAttribute("class", "btn btn-secondary keyword");
        }
        event.target.setAttribute("class", "btn btn-primary keyword");

        let newKwd = event.target.getAttribute("value");

        this.setState(preState => ({
            ...preState,
            currentKwd: newKwd,
            forumData: null,
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
                kwdButtonClass[keyword[i].name] = "btn btn-primary keyword";
            } else {
                kwdButtonClass[keyword[i].name] = "btn btn-secondary keyword";
            }
        }

        if (currentKwd !== '' && this.state.forumData === null) {
            this.getData(currentKwd);
        }

        const type = "forum";
        //const data = (this.state.forumData === null ? [] : this.state.forumData);
        const data = this.state.forumData;
        const columns = this.state.forumColumns;
        const title = " 相关论坛";
        const collection = this.props.collection['forum'];
        return (
            <div>
                <div style={{marginBottom: 10, marginTop: 10}}>
                    {
                        keyword.map( (oneKwd, index)=>
                            <button
                                className={kwdButtonClass[oneKwd.name]}
                                key={index}
                                style={{color:"white", marginLeft:10}}
                                onClick={this.clickKeyword}
                                value={oneKwd.name}
                            >
                                {oneKwd.name}
                            </button>
                        )
                    }
                    <Link
                        to="/keywords"
                        style={{color:"white", marginLeft:10}}
                        className="btn btn-danger"
                    >
                        管理关键字
                    </Link>
                </div>
                <ShowTablePage data={data} columns={columns} type={type} title={title} collection={collection}/>
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

const connectedForumTablePage = connect(mapStateToProps)(ForumTablePage);
export { connectedForumTablePage as ForumTablePage };

