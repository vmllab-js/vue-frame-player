<template>
	<div class="frame-player">
		<div v-if="mode === 'visible'" class="frame-images mode-visible">
			<img v-for="(image, frame) in frameImages"
			     class="frame-image"
			     :class="{'current-frame': currentFrame === frame}"
			     :src="image"
			/>
		</div>
		<div v-if="mode === 'opacity'" class="frame-images mode-opacity">
			<img v-for="(image, frame) in frameImages"
			     class="frame-image"
			     :class="{'current-frame': currentFrame === frame}"
			     :src="image"
			/>
		</div>
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
        mode: 'visible', // unique/visible/opacity/canvas
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
      // console.log( 'config', this.config )
      const { mode, initialImages, length } = this.config;
      this.mode = mode;

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
	.frame-images {
		position: relative;
		width: 100%;
		height: 100%;

		.frame-image {
			position: absolute;
			display: block;
			width: 100%;
			height: 100%;
		}

		&.mode-visible {
			.frame-image {
				display: none;

				&.current-frame {
					display: block;
				}
			}
		}

		&.mode-opacity {
			.frame-image {
				opacity: 0;

				&.current-frame {
					opacity: 1;
				}
			}
		}
	}
</style>
