<template>
    <div class="swiper-container">
        <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="i in swiper_config.listImg" :style="{ backgroundImage:'url(' + i.url + ')'}">
                <a :href="i.link?i.link:'javascript:;'"></a>
            </div>
        </div>
        <div class="swiper-pagination swiper-pagination-white">
        </div>
    </div>
</template>

<script>
    import Swiper from 'swiper';
    //import './css/swiper.css';
    export default {
        data(){
            return{

            }
        },
        props:{
            'swiper_config':Object
        },
        mounted() {

            let me = this;

            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                bulletActiveClass: me.swiper_config.bulletsColor?'my-bullet-active':'swiper-pagination-bullet-active',
                paginationClickable: false,
                loop: true,
                speed: 600,
                autoplay: 3000,
                autoplayDisableOnInteraction:false,
                observer:true,
                observeParents:true,
                onAutoplay:function(){
                    $(".my-bullet-active").css({
                        'background':me.swiper_config.bulletsColor
                    });
                },
                onSlideChangeStart:function(swiper){
                    $(".my-bullet-active").css({
                        'background':me.swiper_config.bulletsColor
                    });
                },
                onInit:function(swiper){
                    $(".my-bullet-active").css({
                        'background':me.swiper_config.bulletsColor
                    });
                }
            });

        }
    }
</script>

<style lang="less" src="./css/index.less"></style>
