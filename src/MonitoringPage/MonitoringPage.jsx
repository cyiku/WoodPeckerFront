import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import { keywordActions } from '../_actions';
import {collectionActions} from "../_actions";
import {KwsList} from "./KwsList";
import {MsgShow} from "./MsgShow";

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
                <div style={{marginLeft:15}}>
                    <KwsList keyword={keyword}/>

                    <Row gutter={16}>
                        {
                            keyword.map(
                                (keyword, index)=><Col span={8}><MsgShow keyword={keyword}  key={index} index={index}/></Col>
                            )
                        }
                    </Row>
                </div>;

        return (
            <div style={{marginTop:15}}>
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

