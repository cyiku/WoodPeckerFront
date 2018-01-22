import React from 'react';
import { List, Avatar, Icon } from 'antd';
class BlankPage extends React.Component {


    render() {

        const listData = [];
        for (let i = 0; i < 5; i++) {
            listData.push({
                href: 'http://ant.design',
                title: `ant design part ${i}`,
                content: 'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
            });
        }

        const pagination = {
            pageSize: 10,
            current: 1,
            total: listData.length,
            onChange: (() => {}),
        };

        const IconText = ({ type, text }) => (
            <span>
                <Icon type={type} style={{ marginRight: 8 }} />
                {text}
            </span>
        );

        return (
            <List
                itemLayout="vertical"
                size="large"
                pagination={pagination}
                dataSource={listData}
                renderItem={item => (
                    <List.Item
                        key={item.title}
                        actions={[<IconText type="star-o" text="156" />, <IconText type="like-o" text="156" />, <IconText type="message" text="2" />]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={item.avatar} />}
                            title={<a href={item.href}>{item.title}</a>}
                            description={item.description}
                        />
                        {item.content}
                    </List.Item>
                )}
            />
        );
    }
}

export { BlankPage };