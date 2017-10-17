import {Router} from 'express'
var router = Router()
const urllib = require("urllib-sync");
const querystring = require("querystring");
const backEndPath = require("../../static/server.config").backEndPath;

router.post('/api/login', function (req, res) {
    let param = req.body.data;
    let postData = querystring.stringify(param);
    let re = urllib.request(`${backEndPath}/api/user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        content: postData
    });
    let data = JSON.parse(re.data.toString());
    +data.status_code === 200 ? req.session.authUser = data.data : void(0);
    return res.json(data)
});
//发起POST /api/signUp 请求注销当前用户，并从 req.session 中移除
router.post('/api/signUp', function (req, res) {
    req.session.destroy();
});
router.post('/api/personalSetting', function (req, res) {
    let param = req.body.data;
    let postData = querystring.stringify(param);
    let re = urllib.request(`${backEndPath}/api/user/personalSetting`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        content: postData
    });
    let data = JSON.parse(re.data.toString());
    req.session.authUser = data.data;
    return res.json(data)
});
//更新用户头像缓存
router.post('/api/changeHeadImage', function(req, res) {
    let param = req.body.data;
    req.session.authUser.headImage = param.headImage;
    req.session.authUser.smallHeadImage = param.smallHeadImage;
    req.session.authUser.lastName = "Lin123";
    console.log("1.HeadImage = " + req.session.authUser.headImage);
    console.log("2.SmallHeadImage = " + req.session.authUser.smallHeadImage);
    console.log("3.lastName = " + req.session.authUser.lastName);
    req.session.save(function(err) {
        console.log(err);
    })
});
export default router
