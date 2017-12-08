import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';


class KwsListPage2 extends React.Component {


    clickKeyword = (event) => {
        let targets = document.getElementsByClassName("keyword");
        /*
        for (let i = 0; i < targets.length; ++i) {
            targets[i].setAttribute("class", "btn btn-secondary keyword");
        }
        event.target.setAttribute("class", "btn btn-primary keyword");
        */

        alert(123);
    };

    render() {

        //console.log(this.props);
        const {keyword} = this.props;
        const {currentKwd} = this.props;

        let kwdButtonClass = {};

        for (let i = 0; i < keyword.length; i++) {
            if (keyword[i].name === currentKwd) {
                kwdButtonClass[keyword[i].name] = "btn btn-primary keyword";
            } else {
                kwdButtonClass[keyword[i].name] = "btn btn-secondary keyword";
            }
        }

        return (
            <div>
                {
                    keyword.map( (oneKwd, index)=>
                        <Link
                            to={{pathname:'/kwAnalysis', state:oneKwd.name}}
                            className={kwdButtonClass[oneKwd.name]}
                            key={index}
                            style={{color:"white", marginLeft:10}}
                        >
                            {oneKwd.name}
                        </Link>
                    )
                }
                <Link
                    to="/keywords"
                    style={{color:"white", marginLeft:10}}
                    className="btn btn-danger"
                >
                    管理关键字
                </Link>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const {keyword, currentKwd} = ownProps;
    return {
        keyword, currentKwd
    };
}

const connectedKwsListPage2 = connect(mapStateToProps)(KwsListPage2);
export { connectedKwsListPage2 as KwsListPage2 };
