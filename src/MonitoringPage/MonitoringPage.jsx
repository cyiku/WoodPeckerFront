import React from 'react';
import { connect } from 'react-redux';
import { keywordActions } from '../_actions';
import {KwsList} from "./KwsList";
import {MsgShow} from "./MsgShow";

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';
import './MonitoringPage.css'



class MonitoringPage extends React.Component {


    componentDidMount(){
        const { user, dispatch, keyword } = this.props;
        if (keyword.length === 0)
            dispatch(keywordActions.getKws(user));
    }


    render() {
        const {keyword} = this.props;
        //console.log(keyword);
        return (
            <div className="content-wrapper">
                <div className="container-fluid">

                    <KwsList keyword={keyword}/>

                    <div className="row">
                        {
                           keyword.map(
                                (keyword, index)=><MsgShow keyword={keyword}  user = {this.props.user} key={index}/>
                            )
                        }
                    </div>


                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { authentication, keyword } = state;
    const { user } = authentication;
    return {
        user, keyword
    };
}

const connectedMonitoringPage= connect(mapStateToProps)(MonitoringPage);
export { connectedMonitoringPage as MonitoringPage };

