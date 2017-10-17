export default function ({redirect, route, store}) {
	//不拦截页面
	const  interceptPage = [];
	//权限拦截
	if (!/(home)\/\w*|^\/$/.test(route.path)
		&& !/(prompt)\/\w*/.test(route.path) && !/(terms)/.test(route.path)
		&& !/(contact)/.test(route.path) && !/(store)/.test(route.path)
		&& (!store.state.authUser || store.state.authUser.uid == null || store.state.authUser == undefined)) {
		//未登录情况只允许访问home、prompt、store等模块页面
		redirect("/home/login");
	} else if((!store.state.authUser || store.state.authUser.uid == null || store.state.authUser == undefined)
		&& (/(course)\/\w*/.test(route.path) || /(exercise)\/\w*/.test(route.path))) {
    	//未登录不允许访问课程与练习题内容
    	redirect("/home/login");
    } else if(store.state.authUser && store.state.authUser.customerType == 1
    	&& (/(home\/login)\/*|^\/$/.test(route.path) || /(home\/regist)\/*|^\/$/.test(route.path) || /(educator)\/\w*/.test(route.path))) {
    	//学习者不允许访问教学端
    	if(route.path != "/") {
    		redirect("/learner/myCourse");
    	}
    } else if(store.state.authUser && store.state.authUser.customerType == 2
    	&& (/(home\/login)\/*|^\/$/.test(route.path) || /(home\/regist)\/*|^\/$/.test(route.path) || /(learner)\/\w*/.test(route.path))) {
    	//教学者不允许访问学习端
    	if(route.path != "/") {
    		redirect("/educator/myClass");
    	}
    }
}
