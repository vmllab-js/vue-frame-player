interface FramePlayer {
	name: string;

	init(config: object): FramePlayer;

	set(setting: object): FramePlayer;

	play(): FramePlayer;

	pause(): FramePlayer;

	toggle(): FramePlayer;

	stop(): FramePlayer;

	replay(): FramePlayer;

	goto(frame: number): FramePlayer;

	on(eventName: string, callback: () => any): FramePlayer;

	off(eventName: string, callback: () => any): FramePlayer;

	trigger(eventName: string, detail: any): FramePlayer;
}