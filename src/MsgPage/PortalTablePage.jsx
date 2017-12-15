import React from 'react';
import {ShowTablePage} from "./ShowTablePage";
import { connect } from 'react-redux';
import { collectionActions } from '../_actions';
import { keywordActions } from '../_actions';
import {serverIP} from '../_helpers';
import { history } from '../_helpers';
import {userActions} from "../_actions/user.actions";
import { Link } from 'react-router-dom';
import { Popover } from 'antd';
// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';

/*
const portalContent = {
    '_id': 0,
    'contentType': 'portal',
    'source': '网易网',
    'url': 'http://tech.163.com/17/1127/16/D48SJLQ900097U7H.html',
    'title': '顶级科技大佬高端闭门会议，你也有机会参加!_网易科技',
    'content': '近年来，随着电视制播技术的进步和电视终端产业的发展，部分机构经批准开展了4K超高清电视节目制播和传输出售。为促进超高清电视发展开展了有益的探索和实践，但也出现了管理不规范、技术质量不达标等问题。为规范和促进4K超高清电视健康有序发展，通知如下：',
    'time': '2017_11_27_15_53',
    'keyword': '出售',
};
 */
class PortalTablePage extends React.Component {

    state = {
        portalColumns: [
            {title: '标题', dataIndex: 'title', width: "20%"},
            {title: '正文', className: 'content', width: "40%", render: (record) => (
                <Popover content={
                    <div style={{width: 400}}>
                        <p dangerouslySetInnerHTML={{__html: this.markKeyword(record.content, record.keyword)}}/>
                    </div>
                } title="全文内容">
                    <p>{record.content}</p>
                </Popover>)},
            {title: '来源', dataIndex: 'source'},
            {title: '发表时间', dataIndex: 'time',},
            {title: '关键字', dataIndex: 'keyword'},
            {title: '原文地址', key: 'url', render: (record) => (<a href={record.url} target={"_blank"}>原文地址</a>)},
            {title: '正负面', dataIndex: 'sentiment'},
        ],
        portalData: null,
        currentKwd: '',
    };

    componentDidMount(){
        //这里应该获取关键字对应的全部的微博数据
        const {user, dispatch, keyword} = this.props;
        if (this.props.collection['portal'] === null)
            dispatch(collectionActions.getCollection(user, 'portal'));
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
                            portalData: ans.result
                        }));
                    } else {
                        alert(ans.message);
                        if (ans.status === -1)
                            history.push("/login");
                    }
                },
                error => {
                    if (localStorage.getItem('user') !== null) {
                        dispatch(userActions.logout());
                        if (error.message === "Failed to fetch") {
                            alert("登录过期, 请重新登录");
                        } else {
                            alert("服务器内部错误,请联系管理员,抱歉！");
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
            portalData: null,
        }));

    };

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

        if (currentKwd !== '' && this.state.portalData === null) {
            this.getData(currentKwd);
        }

        const type = "portal";
        const data = (this.state.portalData  === null ? [] : this.state.portalData);
        const columns = this.state.portalColumns;
        const title = " 门户网站";
        const collection = this.props.collection['portal'];
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

const connectedPortalTablePage = connect(mapStateToProps)(PortalTablePage);
export { connectedPortalTablePage as PortalTablePage };

