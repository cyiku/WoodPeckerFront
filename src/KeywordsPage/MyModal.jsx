import React from 'react';
import { Modal, Button } from 'antd';
import { Checkbox } from 'antd';
// 导入css
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../_helpers/sb-admin.css';

const confirm = Modal.confirm;
const CheckboxGroup = Checkbox.Group;



class MyModal extends React.Component {

    constructor(pros) {
        super(pros);
        this.state = {
            ModalText: 'Content of the modal dialog',
            //checkbox
        };
    }




    render() {
        return (
            <Modal title="新加关键字"
                   visible={this.props.updateVisible && this.state.updateVisible}
                   onOk={this.handleOk}
                   confirmLoading={this.state.confirmLoading}
                   onCancel={this.handleCancel}
            >
                <div className="form-group">
                    <label>关键字名称</label>
                    <input type="text" name="txt_departmentname" data-bind="value:Name" className="form-control" id="txt_departmentname" placeholder="关键字名称"/>
                </div>
                <div className="form-group">
                    <label>爬取站点</label>
                    <div className="m-b-15">
                        <ul className="nav nav-pills nav-stacked nav-sm panel-body">
                            <li>
                                <div>
                                    <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                                        <Checkbox
                                            indeterminate={this.state.indeterminate}
                                            onChange={this.onCheckAllChange}
                                            checked={this.state.checkAll}
                                        >
                                            Check all
                                        </Checkbox>
                                    </div>
                                    <br />
                                    <CheckboxGroup options={plainOptions}  onChange={this.onChange} />
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </Modal>
        );
    }
}

export { MyModal };