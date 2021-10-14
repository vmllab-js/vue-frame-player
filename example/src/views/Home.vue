<template>
	<div class="home">
		<FramePlayer v-if="config" :config="config"/>
	</div>
</template>

<script>
  // @ is an alias to /src
  import FramePlayer from '@/components/FramePlayer.vue'

  export default {
    name: 'Home',
    components: {
      FramePlayer
    },
    data() {
      return {
        config: null
      }
    },
    mounted() {
      // let initialImages = [];
      // for ( let i = 1; i <= 40; ++i ) {
      //   initialImages.push( require( `../assets/bg/${i}.jpg` ) );
      // }
      // this.config = {
      //   initialImages
      // };
      this.config = {
        mode: 'canvas',
        length: 40,
        initialImages: ( i, length ) => require( `../assets/bg/${i + 1}.jpg` )
      };
    }
  }
</script>

<style lang="scss" scoped>
	.home {
		.frame-player {
			width: 750px;
			height: 1490px;
		}
	}
</style>
