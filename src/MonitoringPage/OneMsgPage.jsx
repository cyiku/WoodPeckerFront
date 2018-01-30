import React from 'react';
import { Popover, Card, Icon } from 'antd';
import { CSVLink } from 'react-csv';
import { collectionActions } from '../_actions';
import { connect } from 'react-redux';
// 开源代码: 限制段落行数，chrome, firefox, safari都可以
import './clamp.js';
//const Panel = Collapse.Panel;


class OneMsgPage extends React.Component {

    markKeyword = (content, keywords) => {

        // 分割keywords
        const keyword_list = keywords.split('_');
        //console.log(keyword_list);
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

    /**
     * 将object类型转换成Json
     * @param record: object类型
     */
    objToJSON = (record) => {
        let str = JSON.stringify([record]); // object list to str
        return JSON.parse(str);   // str to json
    };

    /**
     * 收藏一条消息
     * @param event: 鼠标点击收藏(取消收藏)的事件
     * @param data: 消息对应的类型, 为JsonArray,[{'content':'', 'id':''...}]
     * @param iconID: 消息对应的收藏Icon的ID, 和消息的ID一致
     */
    collectionOneRow = (event, data, iconID) => {

        /**
         * user: 为了发送请求时后台辨识用户
         * dispatch: react-redux
         * type: collection是Json, key为type, 添加和删除时, 加入type, 方便增删
         */
        const {user, dispatch} = this.props;

        let icon = document.getElementById(iconID);
        if (icon.getAttribute("class") === "anticon anticon-star-o") {
            // 收藏
            dispatch(collectionActions.addCollection(user, data, data[0]['contentType']));
            icon.setAttribute("class", "anticon anticon-star"); // 更换图标

        } else {
            // 取消收藏
            dispatch(collectionActions.delCollection(user, [data[0]['_id']], data[0]['contentType']));
            icon.setAttribute("class", "anticon anticon-star-o"); //更换图标
        }
    };

    /**
     * 初次打开时图标更换
     * @param id
     * @param collection
     * @returns {*}
     */
    hasCollected = (id, collection) => {
        if (collection === null)
            return {collectionType: "star-o", collectionInner: "收藏"};
        for (let i = 0; i < collection.length; ++i) {
            if (collection[i]['_id'] === id) {
                return {collectionType: "star", collectionInner: "取消收藏"}
            }
        }
        return {collectionType: "star-o", collectionInner: "收藏"}
    };

    /*
    componentWillUpdate() {
        const {content, time} = this.props;
        document.getElementById(content._id + time).innerHTML = "";
    }

    componentDidUpdate() {
        const {content, time} = this.props;
        const newContent = this.markKeyword(content.content, content.keyword);
        document.getElementById(content._id + time).innerHTML = newContent;
    }

    componentDidMount () {
        const {content, time} = this.props;
        const newContent = this.markKeyword(content.content, content.keyword);
        document.getElementById(content._id + time).innerHTML = newContent;

    }
    */
    componentDidMount () {
        var p = document.getElementsByClassName('text');
        for (let i = 0; i < p.length; ++i)
            window.$clamp(p[i], {clamp: 3, useNativeClamp: false});   // 设置最多显示消息的行数
    }

    render() {
        let showMsg;

        const {content, contentType, collection} = this.props;
        const newTime = this.timeTransfer(content.time);
        const {collectionType, collectionInner} = this.hasCollected(content._id, collection[contentType]);

        // let header;
        // if (content.boudary !== undefined) {
        //     header = <h3 style={{color:"red", textAlign:"center"}}>上次您读到这里</h3>;
        // }
        // 全文内容
        const testContent = (
            <div style={{width: 400}}>
                <p dangerouslySetInnerHTML={{__html: this.markKeyword(content.content, content.keyword)}}/>
            </div>
        );

        if (contentType === 'weibo')
            showMsg =
                <div style={{display:'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
                    <p style={{fontSize:15}} dangerouslySetInnerHTML={{__html: this.markKeyword(content.content, content.keyword)}} className={'text'}/>
                    <span style={{}}>转发({content.n_forward}) 评论({content.n_comment}) 赞({content.n_like})</span>
                </div>;
        else if (contentType === 'portal')
            showMsg =
                <div style={{display:'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
                    <div>
                        <a href={content.url} style={{fontSize:14}} target="_blank">
                            <p className={"title"}>{content.title}</p>
                        </a>
                    </div>
                    <p style={{fontSize:15}} dangerouslySetInnerHTML={{__html: this.markKeyword(content.content, content.keyword)}} className={'text'}/>
                </div>;
        else if (contentType === 'forum')
            showMsg =
                <div style={{display:'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
                    <p style={{fontSize:15}} dangerouslySetInnerHTML={{__html: this.markKeyword(content.content, content.keyword)}} className={'text'}/>
                    <span>点击({content.n_click}) 回复({content.n_reply})</span>
                </div>;
        else if (contentType === 'agency')
            showMsg =
                <div style={{display:'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
                    <div>
                        <a href={content.url} style={{fontSize:14}} target="_blank">
                            <p className={"title"}>{content.title}</p>
                        </a>
                    </div>
                    <p style={{fontSize:15}} dangerouslySetInnerHTML={{__html: this.markKeyword(content.content, content.keyword)}} className={'text'}/>
                </div>;
        return (

            <div style={{ marginBottom: 10 }}>
                {/*{header}*/}
                <Card title={
                    <div>
                        <span style={{float: "right"}}>{content.source}</span>
                        <span>{content.authid? content.authid: "匿名用户"}</span>
                    </div>
                }>

                    {showMsg}
                    <span>发表于: {newTime}</span>
                    <div>
                        <Popover content={testContent} title="全文内容">
                            <a href="javascript:void(0);" target="_blank">全部内容</a>
                        </Popover>
                        <a href={content.url} target="_blank" style={{marginLeft:15}} className={"colorChanged"}>原文地址</a>
                        <a href="javascript:void(0);" onClick={event => this.collectionOneRow(event, this.objToJSON(content), content._id)} style={{marginLeft:15}}>
                            <Icon id={content._id} type={collectionType}/> {collectionInner}
                        </a>
                        <CSVLink data={this.objToJSON(content)}
                                 filename={new Date().toLocaleString() + '.csv'}
                                 target="_blank"
                                 title="导出"
                                 style={{marginLeft:15}}
                        >
                            <Icon type="download" /> 导出
                        </CSVLink>
                    </div>
                </Card>
            </div>

            // <div className="card" style={{marginBottom: 10}}>
            //     <div className="card-body">
            //         <div>
            //             <i style={{float: "right"}}>{newTime}, {content.source}</i>
            //             <h6>{content.authid? content.authid: "匿名用户"}</h6>
            //         </div>
            //         {showMsg}
            //     </div>
            //     <hr className="my-0" />
            //     <div className="card-body py-2 small">
            //         <Popover content={testContent} title="全文内容">
            //             <a className="mr-3 d-inline-block" href="javascript:void(0);" target="_blank">全部内容</a>
            //         </Popover>
            //         <a className="mr-3 d-inline-block" href={content.url} target="_blank">原文地址</a>
            //         <a className="mr-3 d-inline-block" href="javascript:void(0);" onClick={event => this.collectionOneRow(event, this.objToJSON(content), content._id)}>
            //             <i id={content._id} className={collectionClass}>{collectionInner}</i>
            //         </a>
            //         <CSVLink data={this.objToJSON(content)}
            //                  filename={new Date().toLocaleString() + '.csv'}
            //                  target="_blank"
            //                  title="导出"
            //                  className="mr-3 d-inline-block"
            //         >
            //             <i className="fa fa-fw fa-share-square-o"/>导出
            //         </CSVLink>
            //         {/*<a className="d-inline-block" href="javascript:void(0);"><i className="fa fa-fw fa-send-o"/>发送</a>*/}
            //     </div>
            // </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const {authentication, collection} = state;
    const {user} = authentication;
    const {content, contentType, time} = ownProps;
    return {user, collection, content, contentType, time};
}

const connectedOneMsgPage = connect(mapStateToProps)(OneMsgPage);
export { connectedOneMsgPage as OneMsgPage };