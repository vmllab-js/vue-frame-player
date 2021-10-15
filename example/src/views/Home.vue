<template>
	<div class="home">
		<frame-player v-if="config" ref="theFramePlayer" :config="config"/>

		<div class="controls pa">
			<div>
				<div class="btn fps" @click="setFPS(fps-5)">-5</div>
				<div class="btn fps">fps:{{fps}}</div>
				<div class="btn fps" @click="setFPS(fps+5)">+5</div>
			</div>
			<div>
				<div class="btn play-step" @click="setPlayStep(playStep-1)">-1</div>
				<div class="btn play-step">playStep:{{playStep}}</div>
				<div class="btn play-step" @click="setPlayStep(playStep+1)">+1</div>
			</div>
			<div>
				<div class="btn play-speed" @click="setPlaySpeed(-3)">&lt;&lt;rewind</div>
				<div class="btn play" @click="play">play</div>
				<div class="btn play-speed" @click="setPlaySpeed(3)">forward&gt;&gt;</div>
			</div>
			<div>
				<div class="btn play" @click="pause">pause</div>
				<div class="btn stop" @click="stop">stop</div>
				<div class="btn replay" @click="replay">replay</div>
				<div class="btn goto" @click="goto(20)">goto(20)</div>
			</div>
			<div>
				<div v-for="mode in playModes"
				     class="btn playMode"
				     :class="{unactive:playMode!==mode}"
				     @click="setPlayMode(mode)">
					{{mode}}
				</div>
			</div>
			<div>
				<div v-for="mode in imageModes"
				     class="btn imageMode"
				     :class="{unactive:imageMode!==mode}"
				     @click="setImageMode(mode)">
					{{mode}}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
  // @ is an alias to /src
  // import FramePlayer from '@/components/FramePlayer.vue'
  import FramePlayer from 'vue-frame-player'

  export default {
    name: 'Home',
    components: {
      FramePlayer
    },
    data() {
      return {
        config: null,
        paused: false,
        fps: 0,
        playStep: 1,
        playSpeed: 1,
        imageModes: [ 'unique', 'visible', 'opacity', 'canvas' ],
        imageMode: '',
        playModes: [ 'normal', 'loop', 'yoyo' ],
        playMode: '',
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
        imageMode: 'canvas',
        playMode: 'loop',
        length: 40,
        initialImages: ( i, length ) => require( `../assets/bg/${i + 1}.jpg` ),
        fps: 30,
        playStep: 1,
        playSpeed: 1,
      };

      setTimeout( () => {
        const player = this.$refs.theFramePlayer;
        this.fps = player.fps;
        this.playStep = player.playStep;
        this.playSpeed = player.playSpeed;
        this.imageMode = player.imageMode;
        this.playMode = player.playMode;
        player
          .on( 'play', () => {
            console.log( 'on play' )
            this.paused = false;
          } )
          .on( 'pause', () => {
            console.log( 'on pause' )
            this.paused = true;
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
      } );
    },
    methods: {
      setFPS( fps ) {
        const player = this.$refs.theFramePlayer;
        player.set( { fps } );
        this.fps = player.fps;
      },
      setPlayStep( playStep ) {
        const player = this.$refs.theFramePlayer;
        player.set( { playStep } );
        this.playStep = player.playStep;
      },
      setPlaySpeed( playSpeed ) {
        const player = this.$refs.theFramePlayer;
        player.set( { playSpeed } ).play();
        this.playSpeed = player.playSpeed;
      },
      play() {
        const player = this.$refs.theFramePlayer;
        player.set( { playSpeed: 1 } ).play();
      },
      pause() {
        const player = this.$refs.theFramePlayer;
        player.pause();
      },
      stop() {
        const player = this.$refs.theFramePlayer;
        player.stop();
      },
      replay() {
        const player = this.$refs.theFramePlayer;
        player.set( { playSpeed: 1 } ).replay();
      },
      goto( frame ) {
        const player = this.$refs.theFramePlayer;
        player.goto( frame );
      },
      setPlayMode( playMode ) {
        const player = this.$refs.theFramePlayer;
        player.set( { playMode } );
        this.playMode = player.playMode;
      },
      setImageMode( imageMode ) {
        const player = this.$refs.theFramePlayer;
        player.set( { imageMode } );
        this.imageMode = player.imageMode;
      },
    }
  }
</script>

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
		overflow: hidden;

		.frame-player {
			position: absolute;
			width: 750px;
			height: 1490px;
		}

		.controls {
			bottom: 0;
			width: 100%;
			text-align: center;

			.btn {
				display: inline-block;
				margin: 10px;
				padding: 10px 20px;
				font-size: 40px;
				color: #fff;
				background: rgba(0, 35, 20, 0.9);
				border-radius: 5px;

				&.unactive {
					opacity: 0.5;
				}
			}

			.play {
				bottom: 0;
			}
		}
	}
</style>
