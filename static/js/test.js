import "../css/test.less";
import Vue from "vue";
import slideBanner from "../components/swiper/swiper.vue";
import freshToLoadmore from "../components/fresh-to-loadmore/fresh-to-loadmore.vue";

const vm = new Vue({
    el: "#root",
    data:{
        swiperConfig:{
            "listImg":[{
            "url": "https://vip.cardinfo.com.cn/alliance-source/h5/image/iBrush_banner1.png",
            "link":"https://www.baidu.com"
            },
            {
                "url": "https://vip.cardinfo.com.cn/alliance-source/h5/image/iBrush_banner1.png"
            }],
            "bulletsColor":"#fff"
        }
        
    },
    components: {
        slideBanner,
        freshToLoadmore
    },
    mounted() {

    },
    methods:{
        refresh(){
            alert("刷新完成")
        }
    }
})
