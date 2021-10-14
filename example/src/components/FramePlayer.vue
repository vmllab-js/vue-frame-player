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
      this.off();
    },
    methods: {
      set( setting ) {
        if ( setting.fps > 0 ) this.fps = setting.fps;
        if ( setting.playStep > 0 ) this.playStep = setting.playStep;
        if ( setting.playMode ) {
          this.playMode = setting.playMode;
          this.playDirection = 1;
        }
        if ( setting.imageMode ) this.imageMode = setting.imageMode;
        return this;
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
        const interval = 1000 / this.fps * this.playStep;
        if ( now - this._lastFrameTime < interval ) return;
        this._lastFrameTime += interval;
        if ( now - this._lastFrameTime > interval ) this._lastFrameTime = now;
        let nextFrame = this.currentFrame + this.playStep * this.playDirection;
        if ( nextFrame >= this.frameLength ) {
          switch ( this.playMode ) {
            case 'normal':
              this.paused = true;
              this.trigger( 'pause', { from: 'ended', current: this.currentFrame } );
              this.trigger( 'ended', { from: 'ended', current: this.currentFrame } );
              break;
            case 'loop':
              this.currentFrame = 0;
              this.trigger( 'loop', { from: 'loop', current: this.currentFrame } );
              break;
            case 'yoyo':
              this.playDirection *= -1;
              this.trigger( 'yoyo', { from: 'yoyo', current: this.currentFrame } );
              break;
          }
        } else if ( nextFrame < 0 ) {
          switch ( this.playMode ) {
            case 'normal':
            case 'loop':
              this.paused = true;
              this.trigger( 'pause', { from: 'ended', current: this.currentFrame } );
              break;
            case 'yoyo':
              this.playDirection *= -1;
              this.trigger( 'yoyo', { from: 'yoyo', current: this.currentFrame } );
              break;
          }
        } else {
          this.currentFrame = nextFrame;
        }

        if ( this.imageMode === 'canvas' ) this.__updateCanvas();

        this.trigger( 'update', { from: 'update', current: this.currentFrame } )
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
      // 播放控制
      play() {
        this.paused = false;
        this.trigger( 'play', { from: 'play', current: this.currentFrame } );
        return this;
      },
      pause() {
        this.paused = true;
        this.trigger( 'pause', { from: 'pause', current: this.currentFrame } );
        return this;
      },
      toggle() {
        this.paused = !this.paused;
        this.trigger( this.paused ? 'pause' : 'play', { from: 'toggle', current: this.currentFrame } );
        return this;
      },
      stop() {
        this.goto( 0 );
        this.paused = true;
        this.trigger( 'pause', { from: 'stop', current: this.currentFrame } );
        return this;
      },
      replay() {
        this.goto( 0 );
        this.paused = false;
        this.trigger( 'play', { from: 'replay', current: this.currentFrame } );
        return this;
      },
      goto( frame ) {
        this.currentFrame = frame;
        if ( this.imageMode === 'canvas' ) this.__updateCanvas();
        this.trigger( 'goto', { from: 'goto', current: this.currentFrame } );
        return this;
      },
      // 事件管理
      on( eventName, callback ) {
        if ( !this.events[ eventName ] ) this.events[ eventName ] = [];
        this.events[ eventName ].push( callback );
        return this;
      },
      off( eventName, callback ) {
        if ( !eventName ) {
          this.events = {};
        } else if ( !callback ) {
          this.events[ eventName ] = [];
        } else if ( this.events[ eventName ] ) {
          this.events[ eventName ] = this.events[ eventName ].filter( e => e !== callback );
        }
        return this;
      },
      trigger( eventName, detail ) {
        if ( this.events[ eventName ] ) {
          this.events[ eventName ].forEach( e => e( detail ) );
        }
        return this;
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
