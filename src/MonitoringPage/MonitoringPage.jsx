import React from 'react';
import { connect } from 'react-redux';
import { keywordActions } from '../_actions';
import {collectionActions} from "../_actions";
import {KwsList} from "./KwsList";
import {MsgShow} from "./MsgShow";

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';
import './MonitoringPage.css'


class MonitoringPage extends React.Component {


    componentDidMount(){
        const { user, dispatch, keyword, collection } = this.props;
        if (keyword === null) {
            dispatch(keywordActions.getKws(user));
        }
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


    render() {
        const {keyword} = this.props;

        let keywordDiv = <div></div>;
        if (keyword !== null)
            keywordDiv =
                <div>
                    <KwsList keyword={keyword}/>

                    <div className="row">
                        {
                            keyword.map(
                                (keyword, index)=><MsgShow keyword={keyword}  key={index}/>
                            )
                        }
                    </div>
                </div>;

        //console.log(keyword);
        return (
            <div className="content-wrapper">
                {keywordDiv}
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { authentication, keyword, collection } = state;
    const { user } = authentication;
    return {
        user, keyword, collection
    };
}

const connectedMonitoringPage= connect(mapStateToProps)(MonitoringPage);
export { connectedMonitoringPage as MonitoringPage };

