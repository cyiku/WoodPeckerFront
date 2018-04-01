import { Popover } from 'antd'
import { cmpTime } from '../_helpers';

const agencyColumns = [
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
    {title: '原文地址', key: 'url', render: (record) => (<a href={record.url} target={"_blank"}>原文地址</a>)},
];
export {agencyColumns};
