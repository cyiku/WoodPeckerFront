import React from 'react';
import { Collapse } from 'antd';
import { CSVLink } from 'react-csv';

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';


const Panel = Collapse.Panel;


class OneMsgPage extends React.Component {

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
    render() {
        let showMsg;

        const {content, contentType, time} = this.props;
        const newTime = this.timeTransfer(content.time);

        if (contentType === 'weibo')
            showMsg =
                <div>
                    <div style={{fontSize:15}} id={content._id + time}/>
                    <span>转发({content.n_forword}) 评论({content.n_comment}) 赞({content.n_like})</span>
                </div>;
        else if (contentType === 'portal')
            showMsg =
                <div>
                    <div>
                        <a href={content.url} style={{fontSize:10}} target="_blank">
                            {content.title}
                        </a>
                    </div>
                    <div style={{fontSize:15}} id={content._id + time}/>
                </div>;
        return (
            <div className="card mb-4">
                <div className="card-body">
                    <div>
                        <h6 style={{display:"inline"}}>{content.publisher}</h6>
                        <i
                            style={{float:"right"}}>{newTime}, {content.source}</i>
                    </div>
                    {showMsg}
                </div>
                <hr className="my-0" />
                <div className="card-body py-2 small">
                    <a className="mr-3 d-inline-block" href={content.url} target="_blank">原文地址</a>
                    <a className="mr-3 d-inline-block" href=" "><i className="fa fa-fw fa-star-o"/>收藏</a>
                    <CSVLink data={this.objToJSON(content)}
                             filename={new Date().toLocaleString()}
                             target="_blank"
                             title="导出"
                             className="mr-3 d-inline-block"
                    >
                        <i className="fa fa-fw fa-share-square-o"/>导出
                    </CSVLink>
                    <a className="d-inline-block" href=" "><i className="fa fa-fw fa-send-o"/>发送</a>
                </div>
            </div>
        );
    }
}


export {OneMsgPage};