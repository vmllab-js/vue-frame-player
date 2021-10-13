<template>
	<div class="frame-player">
		<img v-for="(image, frame) in frameImages"
		     class="frame-image"
		     :class="{'current-frame': currentFrame === frame}"
		     :src="image"
		/>
	</div>
</template>

<script>
  export default {
    name: 'FramePlayer',
    props: {
      config: Object,
    },
    data() {
      return {
        frameImages: [],
        currentFrame: 0,
        frameLength: 0,
        fps: 20,
        paused: false,
        loop: false,
        yoyo: false,
        jumpStep: 1,
        useCanvas: false,
        events: {},
      }
    },
    methods: {},
    mounted() {
      console.log( 'config', this.config )
      const { initialImages, length } = this.config;
      let frameImages = [];
      if ( typeof initialImages === 'function' ) {
        for ( let i = 0; i < length; ++i ) {
          frameImages.push( initialImages( i, length ) );
        }
      } else {
        frameImages = [ ...initialImages ];
      }
      this.frameImages = frameImages;
      this.frameLength = frameImages.length;

      setInterval( () => {
        if ( ++this.currentFrame >= this.frameLength ) {
          this.currentFrame = 0;
        }
      }, 1000 / this.fps );
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
	.frame-player {
		position: relative;
		width: 100%;
		height: 100%;

		.frame-image {
			position: absolute;
			display: block;
			width: 100%;
			height: 100%;
			opacity: 0;

			&.current-frame {
				opacity: 1;
			}
		}
	}
</style>
