<template>
	<div id="fresh-to-loadmore">
		<pull-to 
			:top-load-method="(type=='refresh'||type=='all')?refresh:''"
			:bottom-load-method="(type=='loadmore'||type=='all')?loadmore:''"
			@top-state-change="stateChange"
			@bottom-state-change="stateChange"
		>
	    <!-- vue 2.5 use slot-scope -->
	    <template slot="top-block" slot-scope="props">
	      <div class="top-load-wrapper">
	        <svg class="icon"
	             :class="{
	                'icon-arrow': props.state === 'trigger',
	                'icon-loading': props.state === 'loading'
	             }"
	             aria-hidden="true">
	          <use :xlink:href="iconLink"></use>
	        </svg>
	        <span>{{props.stateText}}</span>
	      </div>
	    </template>
	    
	    <slot></slot>	

	    <!-- vue 2.5 use slot-scope -->
	    <template slot="bottom-block" slot-scope="props">
	      <div class="bottom-load-wrapper">
	        <svg class="icon"
	             :class="{
	                'icon-arrow': props.state === 'trigger',
	                'icon-loading': props.state === 'loading'
	             }"
	             aria-hidden="true">
	          <use :xlink:href="iconLink"></use>
	        </svg>
	        <span>{{ props.stateText }}</span>
	      </div>
	    </template>
	  </pull-to>
	</div>
</template>

<style src="./fresh-to-loadmore.less" lang="less"></style>
<script src="./fresh-to-loadmore.js"></script>