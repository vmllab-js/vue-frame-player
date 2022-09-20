<template>
	<div class="home">
		<frame-player ref="theFramePlayer"/>
	</div>
</template>

<script lang="ts">
	import {Options, Vue} from 'vue-class-component';
	import FramePlayer from '../../packages/FramePlayer';

	@Options({
		components: {
			FramePlayer,
		}
	})
	export default class Home extends Vue {
		mounted() {
			const player: any = this.$refs.theFramePlayer;
			player.init({
				imageMode: 'visible',
				playMode: 'loop',
				length: 150,
				// initialImages: ( i, length ) => require( `../assets/bg/${i + 1}.jpg` ),
				initialImages: 'https://vmllab-js.github.io/vFramePlayer/image/[frame].jpg',
				playStep: 1,
				playSpeed: 1,
				autoplay: true,
				preload: true,
			});
		}
	}
</script>

<style>
	.home {
		position: absolute;
		width: 640px;
		height: 1008px;
	}
</style>
