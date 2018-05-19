import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

/**
 * 该类为监控页面的所有关注的关键字展示
 */
class KwsList extends React.Component {

    render() {
        return (
            <div>
                {
                    this.props.keyword.map( (keyword, index)=>
                        <Button key={index} href={"#"+keyword.name} size="large" style={{marginRight:15}}>{keyword.name}</Button>
                    )
                }
                <Button type="primary" size="large"><Link to="/keywords">管理关键字</Link></Button>
            </div>
        );
    }
}

export { KwsList };
