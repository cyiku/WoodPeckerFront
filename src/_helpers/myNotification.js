import {notification} from 'antd';

const openNotificationWithIcon = (type, message, description="") => {
    notification.config({
        duration: 3,
    });
    notification[type]({
        message: message,
        description: description,
    });
};

export {openNotificationWithIcon};