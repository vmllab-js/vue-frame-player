<template>
	<div class="home">
		<FramePlayer v-if="config" ref="theFramePlayer" :config="config"/>

		<div class="controls pa">
			<div>
				<div class="btn fps" @click="setFPS(fps-5)">-5</div>
				<div class="btn fps">fps:{{fps}}</div>
				<div class="btn fps" @click="setFPS(fps+5)">+5</div>
			</div>
			<div>
				<div class="btn play" @click="togglePlay">{{paused?'play':'pause'}}</div>
				<div class="btn stop" @click="stop">stop</div>
				<div class="btn replay" @click="replay">replay</div>
				<div class="btn goto" @click="goto(20)">goto(20)</div>
			</div>
			<div>
				<div class="btn playMode" :class="{unactive:playMode!=='normal'}" @click="setPlayMode('normal')">
					normal
				</div>
				<div class="btn playMode" :class="{unactive:playMode!=='loop'}" @click="setPlayMode('loop')">
					loop
				</div>
				<div class="btn playMode" :class="{unactive:playMode!=='yoyo'}" @click="setPlayMode('yoyo')">
					yoyo
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
  import FramePlayer from '@/components/FramePlayer.vue'

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
        imageModes: [ 'unique', 'visible', 'opacity', 'canvas' ],
        imageMode: '',
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
      };

      setTimeout( () => {
        const player = this.$refs.theFramePlayer;
        this.fps = player.fps;
        this.imageMode = player.imageMode;
        this.playMode = player.playMode;
        player.on( 'play', () => {
          this.paused = false;
        } );
        player.on( 'pause', () => {
          this.paused = true;
        } );
      } );
    },
    methods: {
      setFPS( fps ) {
        const player = this.$refs.theFramePlayer;
        player.set( { fps } );
        this.fps = player.fps;
      },
      togglePlay() {
        const player = this.$refs.theFramePlayer;
        player.toggle();
      },
      stop() {
        const player = this.$refs.theFramePlayer;
        player.stop();
      },
      replay() {
        const player = this.$refs.theFramePlayer;
        player.replay();
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
