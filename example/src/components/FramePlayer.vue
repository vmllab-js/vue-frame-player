<template>
	<div class="frame-player">
		<div v-if="imageMode === 'unique'" class="frame-ctnr mode-unique">
			<img class="frame-image"
			     :src="frameImages[currentFrame]"
			/>
		</div>
		<div v-else-if="imageMode === 'visible'" class="frame-ctnr mode-visible">
			<img v-for="(image, frame) in frameImages"
			     class="frame-image"
			     :class="{'current-frame': currentFrame === frame}"
			     :src="image"
			/>
		</div>
		<div v-else-if="imageMode === 'opacity'" class="frame-ctnr mode-opacity">
			<img v-for="(image, frame) in frameImages"
			     class="frame-image"
			     :class="{'current-frame': currentFrame === frame}"
			     :src="image"
			/>
		</div>
		<div v-show="imageMode === 'canvas'" class="frame-ctnr mode-canvas">
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
        imageMode: 'visible', // unique/visible/opacity/canvas
        playMode: 'normal', // normal/loop/yoyo
        frameImages: [],
        currentFrame: 0,
        frameLength: 0,
        fps: 20,
        paused: false,
        playStep: 1,
        playDirection: 1,
        events: {},
      }
    },
    mounted() {
      // console.log( 'config', this.config )
      this.set( this.config );

      // 初始化所有帧
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

      // 启动更新循环
      this.__timer();
    },
    destroyed() {
      window.cancelAnimationFrame( this._timer );
    },
    methods: {
      set( setting ) {
        if ( setting.fps && setting.fps > 0 ) this.fps = setting.fps;
        if ( setting.playMode ) this.playMode = setting.playMode;
        if ( setting.imageMode ) this.imageMode = setting.imageMode;
      },
      __timer() {
        this._timer = window.requestAnimationFrame( this.__timer );

        if ( this.paused ) return;

        // 更新当前帧
        const now = Date.now();
        if ( !this._lastFrameTime ) {
          this._lastFrameTime = now;
          return;
        }
        const interval = 1000 / this.fps;
        if ( now - this._lastFrameTime < interval ) return;
        this._lastFrameTime += interval;
        if ( now - this._lastFrameTime > interval ) this._lastFrameTime = now;
        let nextFrame = this.currentFrame + this.playStep * this.playDirection;
        if ( nextFrame >= this.frameLength ) {
          switch ( this.playMode ) {
            case 'normal':
              this.paused = true;
              break;
            case 'loop':
              this.currentFrame = 0;
              break;
            case 'yoyo':
              this.playDirection *= -1;
              break;
          }
        } else if ( nextFrame < 0 ) {
          switch ( this.playMode ) {
            case 'normal':
            case 'loop':
              this.paused = true;
              break;
            case 'yoyo':
              this.playDirection *= -1;
              break;
          }
        } else {
          this.currentFrame = nextFrame;
        }

        if ( this.imageMode === 'canvas' ) this.__updateCanvas();
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
      play() {
        this.paused = false;
      },
      pause() {
        this.paused = true;
      },
      toggle() {
        this.paused = !this.paused;
      },
      stop() {
        this.goto( 0 );
        this.paused = true;
      },
      replay() {
        this.goto( 0 );
        this.paused = false;
      },
      goto( frame ) {
        this.currentFrame = frame;
        if ( this.imageMode === 'canvas' ) this.__updateCanvas();
      },
      on( eventName, callback ) {
        console.log(this.events)
      },
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
