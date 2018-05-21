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
            {title: '时间', dataIndex: 'time'},
            {title: '关键字', dataIndex: 'keyword'},
            {title: '原文', key: 'url', render: (record) => (<a href={record.url} target={"_blank"}>原文</a>)},
        ],
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
            return <div>请求中, 请稍候</div>;

        let currentKwd = '';
        if(this.state.currentKwd === '') {
            if (keyword.length > 0) {
                currentKwd = keyword[0].name;
            }
        } else {
            currentKwd = this.state.currentKwd;
        }

        if (currentKwd === '')
            return <div>暂无关键字</div>;

        let kwdButtonClass = {};
        for (let i = 0; i < keyword.length; i++) {
            if (keyword[i].name === currentKwd) {
                kwdButtonClass[keyword[i].name] = "primary";
            } else {
                kwdButtonClass[keyword[i].name] = "default";
            }
        }

        const type = "portal";
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
                    <ShowTablePage columns={columns} type={type} title={title} collection={collection} keyword={currentKwd}/>
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

