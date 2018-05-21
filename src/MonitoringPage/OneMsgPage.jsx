import React from 'react';
import { Popover, Card, Icon } from 'antd';
import { CSVLink } from 'react-csv';
import { collectionActions } from '../_actions';
import { connect } from 'react-redux';
//const Panel = Collapse.Panel;

const maxDisplayCharacter = 100;

class OneMsgPage extends React.Component {

    state = {
        iconType: "star-o",
        id: '',
    }

    componentDidMount () {
        this.initIcon();
    }

    componentDidUpdate () {
        const {content} = this.props;
        if(content._id === this.state.id)
            return;
        this.initIcon();
    }

    initIcon = () => {
        const {content, contentType, collection} = this.props;
        const typeCollection = collection[contentType];
        let iconType = "star-o";
        let id = content._id;
        if (typeCollection !== null && typeCollection !== undefined) {
            for (let i = 0; i < typeCollection.length; ++i) {
                if (typeCollection[i]['_id'] === id) {
                    iconType = "star";
                }
            }
        }
        this.setState(preState=>({
            iconType: iconType,
            id: id,
        }));
    }

    markKeyword = (content, keywords) => {
        // 分割keywords
        const keyword_list = keywords.split('_');
        for (let i = 0; i < keyword_list.length; ++i) {
            content = content.replace(new RegExp(keyword_list[i], "gm"), '<span style="color: red">'+keyword_list[i]+'</span>');
        }
        return content;
    };

    timeTransfer = (time) => {
        const unit = ['年', '月', '日', '时', '分'];
        for (let i = 0; i < unit.length; ++i) {
            time = time.replace('_', unit[i]);
        }
        return time + '秒';
    };

    objToJSON = (record) => {
        let str = JSON.stringify([record]); // object list to str
        return JSON.parse(str);   // str to json
    };

    collectionOneRow = (event, data, iconID) => {

        const {user, dispatch} = this.props;
        let icon = document.getElementById(iconID);
        let iconType;
        if (icon.getAttribute("class") === "anticon anticon-star-o") {
            dispatch(collectionActions.addCollection(user, data, data[0]['contentType']));
            iconType = "star";
        } else {
            dispatch(collectionActions.delCollection(user, [data[0]['_id']], data[0]['contentType']));
            iconType = "star-o";
        }
        this.setState(preState=>({
            iconType: iconType
        }));
    };


    render() {
        let showMsg;

        const {content, contentType} = this.props;
        const newTime = this.timeTransfer(content.time);
        //const {collectionType, collectionInner} = this.hasCollected(content._id, collection[contentType]);
        
        // 如果是新的则提示
        let newContent = '';
        if (this.props.isNew) {
            newContent = 'New';
        }

        // 全文内容
        const testContent = (
            <div style={{width: 400}}>
                <p dangerouslySetInnerHTML={{__html: this.markKeyword(content.content, content.keyword)}}/>
            </div>
        );

        // 每条消息最多显示的字符数
        let showContent = content.content;
        if (content.source !=='新浪微博' && content.source !=='百度搜索' && content.content.length > maxDisplayCharacter) {
            showContent = content.content.slice(0, maxDisplayCharacter) + '...';
        }

        if (contentType === 'weibo')
            showMsg =
                <div style={{display:'flex', flexDirection: 'column', justifyContent: 'space-around'}} onMouseMove={this.newToOld}>
                    <p style={{fontSize:15}} dangerouslySetInnerHTML={{__html: this.markKeyword(showContent, content.keyword)}} className={'text'}/>
                    <span style={{fontSize:14}}>转发({content.n_forward}) 评论({content.n_comment}) 赞({content.n_like})</span>
                </div>;
        else if (contentType === 'portal')
            showMsg =
                <div style={{display:'flex', flexDirection: 'column', justifyContent: 'space-around'}} onMouseMove={this.newToOld}>
                    <div>
                        <a href={content.url} style={{fontSize:14}} target="_blank">
                            <p className={"title"}>{content.title}</p>
                        </a>
                    </div>
                    <p style={{fontSize:15}} dangerouslySetInnerHTML={{__html: this.markKeyword(showContent, content.keyword)}} className={'text'}/>
                </div>;
        else if (contentType === 'forum')
            showMsg =
                <div style={{display:'flex', flexDirection: 'column', justifyContent: 'space-around'}} onMouseMove={this.newToOld}>
                    <p style={{fontSize:15}} dangerouslySetInnerHTML={{__html: this.markKeyword(showContent, content.keyword)}} className={'text'}/>
                    <span style={{fontSize:14}}>点击({content.n_click}) 回复({content.n_reply})</span>
                </div>;
        else if (contentType === 'agency')
            showMsg =
                <div style={{display:'flex', flexDirection: 'column', justifyContent: 'space-around'}} onMouseMove={this.newToOld}>
                    <div>
                        <a href={content.url} style={{fontSize:14}} target="_blank">
                            <p className={"title"}>{content.title}</p>
                        </a>
                    </div>
                    <p style={{fontSize:15}} dangerouslySetInnerHTML={{__html: this.markKeyword(showContent, content.keyword)}} className={'text'}/>
                </div>;
        return (

            <div style={{ marginBottom: 10}}>
                {/*{header}*/}
                <Card title={
                    <div>
                        <span style={{float: "right", color:"red", fontStyle: "italic"}}>{newContent}</span>
                        <span style={{float: "right"}}>{content.source}</span>
                        <span>{content.authid? content.authid: "匿名用户"}</span>
                    </div>
                }>

                    {showMsg}
                    <span style={{fontSize:14}}>发表于: {newTime}</span>
                    <div style={{marginTop:5}}>
                        <Popover content={testContent} title="全文内容">
                            <a href="javascript:void(0);" target="_blank" title="全文内容"><Icon type="file-text" style={{fontSize: 16, color:"gray"}}/></a>
                        </Popover>
                        <a href={content.url} target="_blank" style={{marginLeft:15}} className={"colorChanged"} title="原文地址"><Icon type="link" style={{fontSize: 16, color:"gray"}}/></a>
                        <a href="javascript:void(0);" onClick={event => this.collectionOneRow(event, this.objToJSON(content), content._id)} style={{marginLeft:15}}>
                            <Icon id={content._id} type={this.state.iconType} style={{fontSize: 16, color:"gray"}}/>
                        </a>
                        <CSVLink data={this.objToJSON(content)}
                                 filename={new Date().toLocaleString() + '.csv'}
                                 target="_blank"
                                 title="导出"
                                 style={{marginLeft:15}}
                        >
                            <Icon type="download" style={{fontSize: 16, color:"gray"}}/>
                        </CSVLink>
                    </div>
                </Card>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const {authentication, collection} = state;
    const {user} = authentication;
    const {content, contentType, time, isNew} = ownProps;
    return {user, collection, content, contentType, time, isNew};
}

const connectedOneMsgPage = connect(mapStateToProps)(OneMsgPage);
export { connectedOneMsgPage as OneMsgPage };