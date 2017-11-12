import React from 'react';
import { Link } from 'react-router-dom';



// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';
import './MonitoringPage.css'



class KwsList extends React.Component {

    render() {
        return (
            <div>
                {
                    this.props.keyword.map( (keyword, index)=>
                        <button type="button" className="btn btn-primary" key={index}>{keyword.name}</button>
                    )
                }
                <button type="button" className="btn btn-danger"><Link to="/keywords" style={{color:"white"}}>管理关键字</Link></button>
            </div>
        );
    }
}

export { KwsList };
