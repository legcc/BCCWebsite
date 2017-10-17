<template>
    <div class="detail-container">
        <header class="header">
            <h2 class="title">Message Detail</h2>
        </header>
        <article class="article">
            <ul>
                <li v-for="info in messageDetail">
                    <template v-if="info.value != null && info.value != ''">
                        <strong class="message-info-key">{{optionKeys[info.name] ? optionKeys[info.name] + ' :' : info.name + ' :'}}</strong>
                        <em class="info-value">{{info.value}}</em>
                    </template>
                </li>
            </ul>
            <nuxt-link :to="{name:'myBCC-message'}">
                <button type="button" class="back-btn">Back</button>
            </nuxt-link>
        </article>
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex'
    export default {
        async fetch({store, query}) {
            if (query.messageId > 0) {
                await store.dispatch("index/myBCC/myBCC/setMessageDetail", {messageId: query.messageId});
            }
        },
        asyncData({query, redirect}){
            if (Object.keys(query).length) {
                let obj = {};
                obj.moduleName = "messageDetail";
                obj.CURRENT_PATH = [{
                    name: "Message",
                    url: "myBCC-message"
                }, {
                    name: "Message Detail",
                    url: "myBCC-messageDetail"
                }];
                return obj;
            } else {
                redirect("/myBcc/message");
            }
        },
        data () {
            return {
                optionKeys: {
                    messageType: "Message Type",
                    title: "Title",
                    //content: "Content",
                    readTime: "Read Time",
                    sendTime: "Message Time",
                    senderName: "Sender",
                    readStatus: "Read Status"
                }
            }
        },
        methods: {
            ...mapActions('index/myBCC/myBCC', [
                'changeCurrentPath'
            ])
        },
        created(){
            this.changeCurrentPath(this.CURRENT_PATH)
        },
        computed: {
            messageDetail(){
                return this.messageDetail
            },
            ...mapState('index/myBCC/myBCC', {
                messageDetail: state => state.messageDetail
            })
        },
        components: {}
    }
</script>
<style lang="less" scoped>
    @import "~element-ui/lib/theme-default/icon.css";
    @import "~~assets/less/myBCC/detail";
</style>
