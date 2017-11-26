import React from 'react';
import { Link } from 'react-router-dom';

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';
import './MonitoringPage.css'

/**
 * 该类仅负责显示关键字列表
 */
class KwsList extends React.Component {

    render() {
        return (
            <div>
                {
                    this.props.keyword.map( (keyword, index)=>
                        <button type="button" className="btn btn-primary" key={index}>{keyword.name}</button>
                    )
                }
                <Link to="/keywords" style={{color:"white", marginLeft:10}} className="btn btn-danger">管理关键字</Link>
            </div>
        );
    }
}

export { KwsList };
