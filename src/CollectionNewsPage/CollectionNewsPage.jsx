import React from 'react';
import { CSVLink } from 'react-csv';
import { Table, Card, Icon } from 'antd';
import { connect } from 'react-redux';
import { collectionActions } from '../_actions';
import { Popover } from 'antd';

// 导入css
import './CollectionNewsPage.css';

class CollectionNewsPage extends React.Component {

    state = {
        weiboColumns: [
            {title: '发布者', dataIndex: 'authid'} ,
            //{title: '正文', sorter: (a, b) => a.content.length - b.content.length, render: (record) => <div dangerouslySetInnerHTML={{__html: record.content}}> </div>},
            {title: '正文', className:'content', width: "40%",render: (record) => (
                <Popover content={
                    <div style={{width: 400}}>
                        <p dangerouslySetInnerHTML={{__html: this.markKeyword(record.content, record.keyword)}}/>
                    </div>
                } title="全文内容">
                    <p>{record.content}</p>
                </Popover>)},
            //{title: '正文',  width: 500, sorter: (a, b) => a.content.length - b.content.length, render: (record) => <p>艺术家Michael 讲旧钥匙打造成各种美丽的工艺品，并且出售，单品售价在200加元左右，真是变废为宝。 u200b艺术家Michael 讲旧钥匙打造成各种美丽的工艺品，并且出售，单品售价在200加</p>},
            {title: '点赞量', dataIndex: 'n_like', sorter: (a, b) => a.n_like - b.n_like,},
            {title: '评论量', dataIndex: 'n_comment', sorter: (a, b) => a.n_comment - b.n_comment,},
            {title: '转发量', dataIndex: 'n_forward', sorter: (a, b) => a.n_forward - b.n_forward,},
            {title: '发表时间', dataIndex: 'time',},
            {title: '关键字', dataIndex: 'keyword'},
            {title: '原文', key: 'url', render: (record) => (<a href={record.url} target={"_blank"}>原文</a>)
            },
            {title: '正负面', dataIndex: 'sentiment'},
            {title: '操作', key: 'action', render: (record) => (
                <span>
                    <CSVLink data={this.objToJSON(record)}
                             filename={new Date().toLocaleString() + '.csv'}
                             target="_blank"
                             title="导出">
                        <Icon type="download" />
                    </CSVLink>
                    <a href="javascript:void(0);" title="删除" style={{marginLeft:5}}><Icon type="delete" onClick={event => this.deleteCollection(event, record._id, 'weibo')}/></a>
                </span>
            )},

        ],
        weiboData: [],

        agencyColumns: [
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
            {title: '原文', key: 'url', render: (record) => (<a href={record.url} target={"_blank"}>原文</a>)
            },
            {title: '正负面', dataIndex: 'sentiment'},
            {title: '操作', key: 'action', render: (record) => (
                <span>
                    <CSVLink data={this.objToJSON(record)}
                             filename={new Date().toLocaleString() + '.csv'}
                             target="_blank"
                             title="导出">
                        <Icon type="download" />
                    </CSVLink>
                    <a href="javascript:void(0);" title="删除" style={{marginLeft:5}}><Icon type="delete" onClick={event => this.deleteCollection(event, record._id, 'agency')}/></a>
                </span>
            )},
        ],
        agencyData: [],

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
            {title: '原文', key: 'url', render: (record) => (<a href={record.url} target={"_blank"}>原文</a>)
            },
            {title: '正负面', dataIndex: 'sentiment'},
            {title: '操作', key: 'action', render: (record) => (
                <span>
                    <CSVLink data={this.objToJSON(record)}
                             filename={new Date().toLocaleString() + '.csv'}
                             target="_blank"
                             title="导出">
                        <Icon type="download" />
                    </CSVLink>
                    <a href="javascript:void(0);" title="删除" style={{marginLeft:5}}><Icon type="delete" onClick={event => this.deleteCollection(event, record._id, 'forum')}/></a>
                </span>
            )},
        ],
        forumData: [],

        portalColumns: [
            {title: '标题', dataIndex: 'title'},
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
            {title: '原文', key: 'url', render: (record) => (<a href={record.url} target={"_blank"}>原文</a>)
            },
            {title: '正负面', dataIndex: 'sentiment'},
            {title: '操作', key: 'action', render: (record) => (
                <span>
                    <CSVLink data={this.objToJSON(record)}
                             filename={new Date().toLocaleString() + '.csv'}
                             target="_blank"
                             title="导出">
                        <Icon type="download" />
                    </CSVLink>
                    <a href="javascript:void(0);" title="删除" style={{marginLeft:5}}><Icon type="delete" onClick={event => this.deleteCollection(event, record._id, 'portal')}/></a>
                </span>
            )},
        ],
        portalData: [],
    };

    componentDidMount() {

        const {user, dispatch, collection} = this.props;
        if (collection['weibo'] === null) {
            dispatch(collectionActions.getCollection(user, "weibo"));
        }
        if (collection['forum'] === null) {
            dispatch(collectionActions.getCollection(user, "forum"));
        }
        if (collection['portal'] === null) {
            dispatch(collectionActions.getCollection(user, "portal"));
        }
        if (collection['agency'] === null) {
            dispatch(collectionActions.getCollection(user, "agency"));
        }

    }

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

    objToJSON = (record) => {
        let str = JSON.stringify([record]); // object list to str
        return JSON.parse(str);   // str to json
    };


    // searchWeibo = () => {
    //     let searchedWeibo = [];
    //     for (let i = 0; i < this.state.weiboData.length; ++i) {
    //         if (this.state.weiboData[i]['content'].indexOf(this.state.searchWeiboContent) !== -1) {
    //             searchedWeibo.push(this.state.weiboData[i]);
    //         }
    //     }
    //     console.log(searchedWeibo);
    //     this.setState(
    //         preState => ({
    //             ...preState,
    //             searchedWeibo: searchedWeibo
    //         })
    //     );
    // };


    handlechange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    deleteCollection = (event, id, type) => {
        const {user, dispatch} = this.props;
        dispatch(collectionActions.delCollection(user, [id], type));
    };

    render() {

        const {collection} = this.props;
        let weiboCollection = (collection['weibo'] === null ? []: collection['weibo']);
        let forumCollection = (collection['forum'] === null ? []: collection['forum']);
        let portalCollection = (collection['portal'] === null ? []: collection['portal']);
        let agencyCollection = (collection['agency'] === null ? []: collection['agency']);


        return (
            <div style={{marginTop: 15, marginLeft:15}}>

                {/*具体微博展示*/}
                <Card title={
                    <div>
                        <span style={{fontWeight:800}}>收藏的微博</span>
                    </div>
                } style={{marginBottom: 50}}>
                    <Table columns={this.state.weiboColumns} dataSource={weiboCollection}/>

                    {/*功能*/}
                    <div style={{marginTop: 15}}>
                        <CSVLink data={weiboCollection}
                                 filename={new Date().toLocaleString() + '.csv'}
                                 target="_blank"
                                 title="导出"
                        >
                            <Icon type="download" />导出
                        </CSVLink>
                    </div>
                </Card>


                {/*具体贴吧展示*/}
                <Card title={
                    <div>
                        <span style={{fontWeight:800}}>收藏的论坛</span>
                    </div>
                } style={{marginBottom: 50}}>
                    <Table columns={this.state.forumColumns} dataSource={forumCollection}/>

                    {/*功能*/}
                    <div style={{marginTop: 15}}>
                        <CSVLink data={forumCollection}
                                 filename={new Date().toLocaleString() + '.csv'}
                                 target="_blank"
                                 title="导出"
                        >
                            <Icon type="download" />导出
                        </CSVLink>
                    </div>
                </Card>


                {/*门户网站展示*/}
                <Card title={
                    <div>
                        <span style={{fontWeight:800}}>收藏的门户</span>
                    </div>
                } style={{marginBottom: 50}}>
                    <Table columns={this.state.portalColumns} dataSource={portalCollection}/>

                    {/*功能*/}
                    <div style={{marginTop: 15}}>
                        <CSVLink data={portalCollection}
                                 filename={new Date().toLocaleString() + '.csv'}
                                 target="_blank"
                                 title="导出"
                        >
                            <Icon type="download" />导出
                        </CSVLink>
                    </div>
                </Card>


                {/*培训结构展示*/}
                <Card title={
                    <div>
                        <span style={{fontWeight:800}}>收藏的培训机构</span>
                    </div>
                } style={{marginBottom: 50}}>
                    <Table columns={this.state.portalColumns} dataSource={agencyCollection}/>

                    {/*功能*/}
                    <div style={{marginTop: 15}}>
                        <CSVLink data={agencyCollection}
                                 filename={new Date().toLocaleString() + '.csv'}
                                 target="_blank"
                                 title="导出"
                        >
                            <Icon type="download" />导出
                        </CSVLink>
                    </div>
                </Card>

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

const connectedCollectionNewsPage = connect(mapStateToProps)(CollectionNewsPage);
export { connectedCollectionNewsPage as CollectionNewsPage };

