import NavHeader from "~/components/nav_header";
import NavFooter from "~/components/nav_footer";
import Vue from "vue";
export default Vue.component('container', {
    functional: true,
    render (h, context) {
        return (
            <div>
                <NavHeader/>
                <div id="container-wrap" style={style.wrap}>
                    {context.children}
                </div>
                <NavFooter/>
            </div>)
    },
    props: {},

})

const style = {
    wrap: {
        height: '100%',
        padding: '0.76rem 0 1rem 0'
    }
}