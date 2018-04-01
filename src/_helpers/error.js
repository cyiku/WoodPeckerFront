import { openNotificationWithIcon } from "../_helpers";
import { history } from '../_helpers';

function errorProcess(error) {
    if (localStorage.getItem('user') !== null) {
        if (error.message === "Failed to fetch") {
            openNotificationWithIcon("error", "连接服务器失败, 请重新登录");
            // history.push('/login');
            // localStorage.removeItem('user');
            localStorage.clear();
        } else {
            openNotificationWithIcon("error", "服务器内部错误,请联系管理员,抱歉！");
        }
    }

}
export {errorProcess};