import React from 'react';
import {ShowTablePage} from "./ShowTablePage";
import { connect } from 'react-redux';
import { collectionActions } from '../_actions';
import { Link } from 'react-router-dom';
import { keywordActions } from '../_actions';
import { Button } from 'antd';
import { Popover } from 'antd';

class WeiboTablePage extends React.Component {
    // 消息展示之微博消息
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
            {title: '点赞量', dataIndex: 'n_like'},
            {title: '评论量', dataIndex: 'n_comment'},
            {title: '转发量', dataIndex: 'n_forward'},
            {title: '时间', dataIndex: 'time'},
            {title: '原文', key: 'url', render: (record) => (<a href={record.url} target={"_blank"}>原文</a>)},
        ],
        currentKwd: '',
    };

    componentDidMount(){
        //这里应该获取用户收藏的，有关该关键字对应的全部的微博收藏
        const {user, dispatch, keyword} = this.props;
        if (this.props.collection['weibo'] === null)
            dispatch(collectionActions.getCollection(user, 'weibo'));
        if (keyword === null)
            dispatch(keywordActions.getKws(user));
    }

    markKeyword = (content, keywords) => {
        // 将消息中的keyword标记为红色
        // 分割keywords
        const keyword_list = keywords.split('_');
        //console.log(keyword_list);
        for (let i = 0; i < keyword_list.length; ++i) {
            content = content.replace(new RegExp(keyword_list[i], "gm"), '<span style="color: red">'+keyword_list[i]+'</span>');
        }
        return content;
    };

    clickKeyword = (event) => {
        // 点击关键字按钮
        let newKwd = event.target.getAttribute("value");
        // 如果点击的关键字跟显示的相同，即没有切换
        if (newKwd === this.state.currentKwd || newKwd === null)
            return;
        // 此时点击的是不同的关键字
        let targets = document.getElementsByClassName("keyword");
        for (let i = 0; i < targets.length; ++i) {
            targets[i].setAttribute("type", "default");
        }
        event.target.setAttribute("type", "primary");
        this.setState(preState => ({
            ...preState,
            currentKwd: newKwd,
            weiboData: null,
        }));
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

        const type = "weibo";
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

const connectedWeiboTablePage = connect(mapStateToProps)(WeiboTablePage);
export { connectedWeiboTablePage as WeiboTablePage };

