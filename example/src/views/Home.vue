<template>
	<div class="home">
		<div class="box">
			<frame-player ref="theFramePlayer" :config="{
			  imageMode: 'visible',
			  playMode: 'loop',
			  length: 150,
			  // initialImages: ( i, length ) => require( `../assets/bg/${i + 1}.jpg` ),
			  initialImages: 'https://vmllab-js.github.io/vFramePlayer/image/[frame].jpg',
			  playStep: 1,
			  playSpeed: 1,
			  autoplay: true,
			  preload: true,
			}"/>
			<div class="info">
				<div class="fps">FPS：{{player.fps}}</div>
				<div class="current">当前帧：{{player.currentFrame}}</div>
				<div class="direction">方向：{{player.playDirection>0?'正向':'反向'}}</div>
				<div class="direction">速度：{{player.playSpeed}}X</div>
			</div>
			<div class="controls">
				<div class="process-ctnr">
					<div class="process" :style="{width:(player.currentFrame/player.frameLength*100)+'%'}"></div>
				</div>
				<i class="fa fa-play" @click="play"></i>
				<i class="fa fa-pause" @click="pause"></i>
				<i class="fa fa-backward" @click="setPlaySpeed(-3)"></i>
				<i class="fa fa-stop" @click="stop"></i>
				<i class="fa fa-forward" @click="setPlaySpeed(3)"></i>
				<i class="fa fa-repeat" @click="replay"></i>
				<i class="fa fa-play" @click="goto(20)"> 20</i>
			</div>
		</div>

		<div class="config">
			<div class="flex">
				<div class="label">playMode:</div>
				<div class="content">
					<div v-for="mode in playModes"
					     class="btn playMode"
					     :class="{unactive:player.playMode!==mode}"
					     @click="setPlayMode(mode)">
						{{mode}}
					</div>
				</div>
			</div>
			<div class="flex">
				<div class="label">imageMode:</div>
				<div class="content">
					<div v-for="mode in imageModes"
					     class="btn imageMode"
					     :class="{unactive:player.imageMode!==mode}"
					     @click="setImageMode(mode)">
						{{mode}}
					</div>
				</div>
			</div>
			<div class="flex">
				<div class="label">fps: {{player.fps}}</div>
				<div class="content">
					<div class="btn fps" @click="setFPS(player.fps-5)">-5</div>
					<div class="btn fps" @click="setFPS(player.fps+5)">+5</div>
				</div>
				<div class="label">playStep: {{player.playStep}}</div>
				<div class="content">
					<div class="btn play-step" @click="setPlayStep(player.playStep-1)">-1</div>
					<div class="btn play-step" @click="setPlayStep(player.playStep+1)">+1</div>
				</div>
			</div>
			<div class="flex">
			</div>
		</div>
	</div>
</template>

<script>
  // @ is an alias to /src
  import FramePlayer from '@/components/FramePlayer.vue'
  // import FramePlayer from 'vue-frame-player'

  export default {
    name: 'Home',
    components: {
      FramePlayer
    },
    data() {
      return {
        imageModes: [ 'unique', 'visible', 'opacity', 'canvas' ],
        playModes: [ 'normal', 'loop', 'yoyo' ],
        player: {}
      }
    },
    mounted() {
      const player = this.$refs.theFramePlayer;
      this.player = player;
      player
        .on( 'play', () => {
          console.log( 'on play' )
        } )
        .on( 'pause', () => {
          console.log( 'on pause' )
        } )
        .on( 'ended', () => {
          console.log( 'on ended' )
        } )
        .on( 'loop', () => {
          console.log( 'on loop' )
        } )
        .on( 'yoyo', () => {
          console.log( 'on yoyo' )
        } )
        .on( 'update', ( detail ) => {
          console.log( 'on update', detail )
        } );
    },
    methods: {
      setFPS( fps ) {
        this.player.set( { fps } );
      },
      setPlayStep( playStep ) {
        this.player.set( { playStep } );
      },
      setPlaySpeed( playSpeed ) {
        this.player.set( { playSpeed } ).play();
      },
      play() {
        this.player.set( { playSpeed: 1 } ).play();
      },
      pause() {
        this.player.pause();
      },
      stop() {
        this.player.stop();
      },
      replay() {
        this.player.set( { playSpeed: 1 } ).replay();
      },
      goto( frame ) {
        this.player.set( { playSpeed: 1 } ).goto( frame ).play();
      },
      setPlayMode( playMode ) {
        this.player.set( { playMode } );
      },
      setImageMode( imageMode ) {
        this.player.set( { imageMode } );
      },
    }
  }
</script>

<style scoped src="../assets/css/font-awesome.min.css"></style>
<style lang="scss" scoped>
	.pa {
		position: absolute;
	}

	.home {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: auto;

		.box {
			position: relative;
			margin: 30px auto 30px auto;
			width: 640px;
			height: 1008px;
			border: 1px solid #000;
			box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);

			.info {
				position: absolute;
				left: 0;
				top: 0;
				padding: 10px 20px;
				width: 200px;
				font-size: 24px;
				line-height: 36px;
				color: #fff;
				background: rgba(0, 0, 0, 0.5);
			}

			.controls {
				position: absolute;
				background: rgba(0, 0, 0, 0.5);
				padding: 10px 20px;
				width: 100%;
				height: 80px;
				left: 0;
				bottom: 0;
				font-size: 32px;
				color: #fff;
				line-height: 60px;
				box-sizing: border-box;

				.process-ctnr {
					position: absolute;
					left: 0;
					top: -8px;
					width: 100%;
					height: 8px;
					background: #aaaaaa;

					.process {
						width: 0%;
						height: 100%;
						background: #fff;
						transition: 0.1s;
					}
				}

				i {
					display: inline-block;
					padding: 15px 20px;
					cursor: pointer;
				}
			}
		}

		.config {
			margin: 0 auto;
			width: 640px;

			.flex {
				display: flex;
			}

			.label {
				margin-right: 10px;
				font-size: 26px;
				line-height: 60px;
				color: #fff;
			}

			.content {
				flex: 1;
			}

			.btn {
				display: inline-block;
				margin: 5px;
				padding: 10px 15px;
				font-size: 26px;
				line-height: 30px;
				color: #fff;
				background: rgba(0, 35, 20, 1);
				border-radius: 5px;
				transition: 0.5s;
				cursor: pointer;

				&.unactive {
					background: rgba(0, 35, 20, 0.3);
					opacity: 0.7;
				}
			}

			.play {
				bottom: 0;
			}
		}
	}
</style>
