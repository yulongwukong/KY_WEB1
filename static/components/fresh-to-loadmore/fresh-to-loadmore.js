import pullTo from "./vue-pull-to.vue";
require('../../assets/icon/iconfont');

export default{
	props:{
		type:String
	},
	mounted(){
		$("#fresh-to-loadmore").css({
			height:$(window).height()
		});	
	},
	components:{
		pullTo
	},
	methods:{
		refresh(loaded){
			let timer = null;
			clearTimeout(timer);
			timer = setTimeout(()=>{
	        	this.$emit('refresh','loaded');
	        	loaded('done');
	        }, 1000);
		},
		loadmore(loaded){
			let timer = null;
			clearTimeout(timer);
			timer = setTimeout(()=>{
    			this.$emit('loadmore','loaded');
    			loaded('done');
		    },1000); 
		},
		stateChange(state) {
            if (state === 'pull' || state === 'trigger') {
              this.iconLink = '#icon-arrow-bottom';
            } else if (state === 'loading') {
              this.iconLink = '#icon-loading';
            } else if (state === 'loaded-done') {
              this.iconLink = '#icon-finish';
            }
        },
	}
}