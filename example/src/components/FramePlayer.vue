<template>
	<div class="frame-player">
		<div v-if="mode === 'unique'" class="frame-ctnr mode-unique">
			<img class="frame-image"
			     :src="frameImages[currentFrame]"
			/>
		</div>
		<div v-else-if="mode === 'visible'" class="frame-ctnr mode-visible">
			<img v-for="(image, frame) in frameImages"
			     class="frame-image"
			     :class="{'current-frame': currentFrame === frame}"
			     :src="image"
			/>
		</div>
		<div v-else-if="mode === 'opacity'" class="frame-ctnr mode-opacity">
			<img v-for="(image, frame) in frameImages"
			     class="frame-image"
			     :class="{'current-frame': currentFrame === frame}"
			     :src="image"
			/>
		</div>
		<div v-show="mode === 'canvas'" class="frame-ctnr mode-canvas">
			<canvas class="frame-canvas" ref="canvas"></canvas>
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
        events: {},
      }
    },
    methods: {
      set( setting ) {
        if ( setting.fps ) this.fps = setting.fps;
        if ( setting.loop ) this.loop = setting.loop;
        if ( setting.yoyo ) this.yoyo = setting.yoyo;
        if ( setting.mode ) {
          this.mode = setting.mode;
          // todo:
        }
      },
      __timer() {
        this._timer = window.requestAnimationFrame( this.__timer );

        // 更新当前帧
        if ( ++this.currentFrame >= this.frameLength ) {
          this.currentFrame = 0;
        }

        if ( this.mode === 'canvas' ) {
          this.__updateCanvas();
        }
      },
      __updateCanvas() {
        const canvas = this.$refs.canvas;
        const context = canvas.getContext( '2d' );
        let img = new Image();
        img.onload = () => {
          if ( canvas.width !== img.width ) {
            canvas.width = img.width;
          }
          if ( canvas.height !== img.height ) {
            canvas.height = img.height;
          }
          context.clearRect( 0, 0, canvas.width, canvas.height );
          context.drawImage( img, 0, 0 );
        };
        img.src = this.frameImages[ this.currentFrame ];
      },
    },
    mounted() {
      // console.log( 'config', this.config )
      const { mode, initialImages, length } = this.config;
      this.mode = mode;

      // 初始化所有帧
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

      // 启动更新循环
      this.__timer();
    },
    destroyed() {
      window.cancelAnimationFrame( this._timer );
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
	.frame-ctnr {
		position: relative;
		width: 100%;
		height: 100%;

		.frame-image,
		.frame-canvas {
			position: absolute;
			display: block;
			left: 0;
			top: 0;
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
