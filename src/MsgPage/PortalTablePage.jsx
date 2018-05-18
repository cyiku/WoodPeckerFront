import React from 'react';
import {ShowTablePage} from "./ShowTablePage";
import { connect } from 'react-redux';
import { collectionActions } from '../_actions';
import { keywordActions } from '../_actions';
import { history } from '../_helpers';
import {Button} from 'antd';
import { Link } from 'react-router-dom';
import { Popover } from 'antd';
import { openNotificationWithIcon } from "../_helpers";
import { cmpTime } from '../_helpers';
import {errorProcess} from "../_helpers/error";
import {serverIP} from '../_helpers';
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
            {title: '发表时间', dataIndex: 'time', sorter: (a, b) => cmpTime(a,b)},
            {title: '关键字', dataIndex: 'keyword'},
            {title: '原文', key: 'url', render: (record) => (<a href={record.url} target={"_blank"}>原文</a>)},
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
                        openNotificationWithIcon("error", ans.message);
                        //if (ans.status === -1)
                        //    history.push("/login");
                    }
                },
                error => errorProcess()
            )
        }
    };

    clickKeyword = (event) => {
        let newKwd = event.target.getAttribute("value");
        if (newKwd == this.state.currentKwd || newKwd === null)
            return;

        let targets = document.getElementsByClassName("keyword");

        for (let i = 0; i < targets.length; ++i) {
            targets[i].setAttribute("type", "default");
        }
        event.target.setAttribute("type", "primary");

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
                kwdButtonClass[keyword[i].name] = "primary";
            } else {
                kwdButtonClass[keyword[i].name] = "default";
            }
        }

        if (currentKwd !== '' && this.state.portalData === null) {
            this.getData(currentKwd);
        }

        const type = "portal";
        //const data = (this.state.portalData  === null ? [] : this.state.portalData);
        const data = this.state.portalData;
        const columns = this.state.portalColumns;
        const title = " 门户网站";
        const collection = this.props.collection['portal'];
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

const connectedPortalTablePage = connect(mapStateToProps)(PortalTablePage);
export { connectedPortalTablePage as PortalTablePage };

