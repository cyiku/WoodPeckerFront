import React from 'react';
import { connect } from 'react-redux';
import { collectionActions } from '../_actions';
import {ShowPicPage} from "./ShowPicPage";

// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';


class WordCloudPage extends React.Component {

    state = {

    };

    componentDidMount(){

        const { currentKwd } = this.props;
        if (currentKwd !== undefined) {
            // post到服务器
        }
    }

    collection = (event, data, id, type) => {
        const {user, dispatch} = this.props;

        let icon = document.getElementById(id);
        if (icon.getAttribute("class") === "fa fa-star-o") {
            // 收藏
            icon.setAttribute("class", "fa fa-star");

            dispatch(collectionActions.addCollection(user, data, type));

            if (icon.innerHTML !== "") {
                icon.innerHTML = " 取消收藏";
            }
        } else {
            // 取消收藏
            icon.setAttribute("class", "fa fa-star-o");

            dispatch(collectionActions.delCollection(user, data.id, type));

            if (icon.innerHTML !== "") {
                icon.innerHTML = " 收藏";
            }
        }
    };


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

