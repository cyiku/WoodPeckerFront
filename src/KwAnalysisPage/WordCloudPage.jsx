import React from 'react';
import { connect } from 'react-redux';
import {ShowPicPage} from "./ShowPicPage";


class WordCloudPage extends React.Component {

    state = {

    };

    componentDidMount(){

        const { currentKwd } = this.props;
        if (currentKwd !== undefined) {
            // post到服务器
        }
    }

    render() {
        return (
            <ShowPicPage data={''} type={''} title={'词语分布图'}/>
        );
    }
}


function mapStateToProps(state, ownProps) {
    const { authentication } = state;
    const { user } = authentication;
    const { currentKwd } = ownProps;
    return {
        user, currentKwd
    };
}

const connectedWordCloudPage = connect(mapStateToProps)(WordCloudPage);
export { connectedWordCloudPage as WordCloudPage };

