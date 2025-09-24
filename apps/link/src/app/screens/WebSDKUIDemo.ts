import { Container, Text, Graphics, Sprite, BlurFilter, Texture } from 'pixi.js';
import { animate } from 'motion';
import { FancyButton } from '@pixi/ui';

import { engine } from '../getEngine';
import { Button } from '../ui/Button';
import { Label } from '../ui/Label';
import { RoundedBox } from '../ui/RoundedBox';
import { WebSDKIntegration, utils } from '../../webSDKIntegration';

/**
 * Demo screen showcasing Web SDK UI functionalities integrated with PixiJS
 * This demonstrates how to use advanced UI components and utilities from the Web SDK packages
 */
export class WebSDKUIDemo extends Container {
	/** Assets bundles required by this screen */
	public static assetBundles = ['main'];

	private mainContainer: Container;
	private backButton: FancyButton;
	private demoContainer: Container;
	private title: Label;
	private infoPanel: RoundedBox;
	private bottomUIContainer: Container;

	// Render Groups
	private bgRenderGroup: Container;
	private symbolsRenderGroup: Container;
	private uiRenderGroup: Container;

	// Background Sprites
	private bg1: Sprite;
	private bg2: Sprite;
	private bg3: Sprite;

	// Slot Machine System
	private reels: any[] = [];
	private reelContainer: Container;
	private slotTextures: Texture[];
	private running = false;
	private tweening: any[] = [];

	// Slot Configuration
	private readonly REEL_WIDTH = 160;
	private readonly SYMBOL_SIZE = 150;
	private readonly REELS_COUNT = 5;
	private readonly SYMBOLS_PER_REEL = 4; // 3 visible + 1 for seamless scroll

	// Game State
	private balance = 1000.0;
	private betAmount = 10.0;
	private winAmount = 0.0;
	private isAutoPlaying = false;
	private isTurboEnabled = false;
	private isSoundEnabled = true;

	// UI Display Components
	private balanceDisplay: Label;
	private betDisplay: Label;
	private winDisplay: Label;

	// Control Buttons
	private playButton: FancyButton;
	private autoButton: FancyButton;
	private turboButton: FancyButton;
	private volumeButton: FancyButton;
	private menuButton: FancyButton;
	private pauseButton: FancyButton;
	private settingsButton: FancyButton;

	// Bet Controls
	private betIncreaseButton: FancyButton;
	private betDecreaseButton: FancyButton;

	// Responsive design demo
	private responsiveContainer: Container;
	private responsiveText: Label;

	constructor() {
		super();

		this.setupLayout();
		this.setupComponents();
		this.setupInteractions();
	}

	private setupBackgrounds() {
		// Background 1 (first, behind others)
		this.bg1 = Sprite.from('bg1.png');
		this.bg1.anchor.set(0.5);
		this.bg1.zIndex = 1;
		this.bgRenderGroup.addChild(this.bg1);

		// Background 2 (middle)
		this.bg2 = Sprite.from('bg2.png');
		this.bg2.anchor.set(0.5);
		this.bg2.zIndex = 2;
		this.bgRenderGroup.addChild(this.bg2);

		// Background 3 (last, in front of other backgrounds)
		this.bg3 = Sprite.from('bg3.png');
		this.bg3.anchor.set(0.5);
		this.bg3.zIndex = 3;
		this.bgRenderGroup.addChild(this.bg3);
	}

	private setupLayout() {
		this.mainContainer = new Container();
		this.addChild(this.mainContainer);

		// Create render groups with proper z-index ordering
		this.bgRenderGroup = new Container();
		this.bgRenderGroup.zIndex = 1;
		this.bgRenderGroup.sortableChildren = true;
		this.mainContainer.addChild(this.bgRenderGroup);

		this.symbolsRenderGroup = new Container();
		this.symbolsRenderGroup.zIndex = 2;
		this.symbolsRenderGroup.sortableChildren = true;
		this.mainContainer.addChild(this.symbolsRenderGroup);

		this.uiRenderGroup = new Container();
		this.uiRenderGroup.zIndex = 3;
		this.uiRenderGroup.sortableChildren = true;
		this.mainContainer.addChild(this.uiRenderGroup);

		// Demo container for components (will be moved to UI render group)
		this.demoContainer = new Container();
		this.uiRenderGroup.addChild(this.demoContainer);

		// Responsive demo container
		this.responsiveContainer = new Container();
		this.uiRenderGroup.addChild(this.responsiveContainer);

		// Enable sorting for main container
		this.mainContainer.sortableChildren = true;

		// Setup backgrounds
		this.setupBackgrounds();
		this.setupSlotMachine();
	}

	private setupSlotMachine() {
		// Initialize slot textures
		this.slotTextures = [
			Texture.from('H1.png'),
			Texture.from('H2.png'),
			Texture.from('H3.png'),
			Texture.from('H4.png'),
			Texture.from('H5.png'), // High value symbols
			Texture.from('L1.png'),
			Texture.from('L2.png'),
			Texture.from('L3.png'),
			Texture.from('L4.png'), // Low value symbols
			Texture.from('S.png'),
			Texture.from('W.png'), // Special symbols
		];

		// Calculate reel area dimensions
		const reelAreaWidth = this.REEL_WIDTH * this.REELS_COUNT;
		const reelAreaHeight = this.SYMBOL_SIZE * 3;

		// Create a gray background for the reel area
		const reelBg = new Graphics();
		reelBg.fill({ color: 0x222222, alpha: 0.85 }); // dark gray, slightly transparent
		reelBg.rect(0, 0, reelAreaWidth, reelAreaHeight);
		reelBg.endFill();

		// Position and center the background
		reelBg.x = -(reelAreaWidth / 2);
		reelBg.y = -(reelAreaHeight / 2);

		// Add the background to the symbolsRenderGroup (behind the reels)
		this.symbolsRenderGroup.addChild(reelBg);

		// Add a UI bar section below the reel area for balance and win display
		const uiBarHeight = 60;
		const uiBarColor = 0x1a1a2e; // Same as your infoPanel color
		const uiBarAlpha = 0.95;

		const uiBar = new Graphics();
		uiBar.fill({ color: uiBarColor, alpha: uiBarAlpha });
		uiBar.rect(
			-(reelAreaWidth / 2),
			reelAreaHeight / 2, // Position directly below the reel area
			reelAreaWidth,
			uiBarHeight,
		);
		uiBar.endFill();
		this.symbolsRenderGroup.addChild(uiBar);

		// Create reel container
		this.reelContainer = new Container();
		this.symbolsRenderGroup.addChild(this.reelContainer);

		// Create a mask for the visible reel area (3 rows)
		const reelMask = new Graphics();
		const maskWidth = this.REEL_WIDTH * this.REELS_COUNT;
		const maskHeight = this.SYMBOL_SIZE * 3; // Only 3 visible rows
		reelMask.rect(0, 0, maskWidth, maskHeight);
		reelMask.endFill();

		// Position the mask to align with the reelContainer
		reelMask.x = 0;
		reelMask.y = 0;

		// Center the mask relative to reelContainer's position
		this.reelContainer.mask = reelMask;
		this.symbolsRenderGroup.addChild(reelMask);

		// Center the reelContainer and mask together
		this.reelContainer.x = -(maskWidth / 2);
		this.reelContainer.y = -(maskHeight / 2); // Center 3 visible rows
		reelMask.x = this.reelContainer.x;
		reelMask.y = this.reelContainer.y;

		// Build the reels
		for (let i = 0; i < this.REELS_COUNT; i++) {
			const reelColumn = new Container();
			reelColumn.x = i * this.REEL_WIDTH;
			this.reelContainer.addChild(reelColumn);

			const reel = {
				container: reelColumn,
				symbols: [] as Sprite[],
				position: 0,
				previousPosition: 0,
				blur: new BlurFilter(),
			};

			reel.blur.blurX = 0;
			reel.blur.blurY = 0;
			reelColumn.filters = [reel.blur];

			// Build symbols for this reel
			for (let j = 0; j < this.SYMBOLS_PER_REEL; j++) {
				const randomTexture =
					this.slotTextures[Math.floor(Math.random() * this.slotTextures.length)];
				const symbol = new Sprite(randomTexture);

				// Position and scale symbol
				symbol.y = j * this.SYMBOL_SIZE;
				symbol.scale.set(
					Math.min(this.SYMBOL_SIZE / symbol.width, this.SYMBOL_SIZE / symbol.height),
				);
				symbol.x = Math.round((this.SYMBOL_SIZE - symbol.width) / 2);

				reel.symbols.push(symbol);
				reelColumn.addChild(symbol);
			}

			this.reels.push(reel);
		}

		// Center the reel container
		this.reelContainer.x = -(this.REEL_WIDTH * this.REELS_COUNT) / 2;
		this.reelContainer.y = -(this.SYMBOL_SIZE * 3) / 2; // Center 3 visible rows

		// Start the slot machine update loop
		this.startSlotMachineLoop();
	}

	private startSlotMachineLoop() {
		// Add to engine ticker for slot machine updates
		engine().ticker.add(this.updateSlotMachine);
	}

	private updateSlotMachine = () => {
		// Update reel positions and blur effects
		for (let i = 0; i < this.reels.length; i++) {
			const reel = this.reels[i];

			// Update blur filter based on speed
			reel.blur.blurY = (reel.position - reel.previousPosition) * 8;
			reel.previousPosition = reel.position;

			// Update symbol positions
			for (let j = 0; j < reel.symbols.length; j++) {
				const symbol = reel.symbols[j];
				const prevY = symbol.y;

				symbol.y =
					((reel.position + j) % reel.symbols.length) * this.SYMBOL_SIZE - this.SYMBOL_SIZE;

				// Handle symbol wrapping and texture swapping
				if (symbol.y < 0 && prevY > this.SYMBOL_SIZE) {
					const randomTexture =
						this.slotTextures[Math.floor(Math.random() * this.slotTextures.length)];
					symbol.texture = randomTexture;
					symbol.scale.set(
						Math.min(
							this.SYMBOL_SIZE / symbol.texture.width,
							this.SYMBOL_SIZE / symbol.texture.height,
						),
					);
					symbol.x = Math.round((this.SYMBOL_SIZE - symbol.width) / 2);
				}
			}
		}

		// Update tweening
		this.updateTweening();
	};

	private updateTweening() {
		const now = Date.now();
		const toRemove: any[] = [];

		for (let i = 0; i < this.tweening.length; i++) {
			const tween = this.tweening[i];
			const phase = Math.min(1, (now - tween.start) / tween.time);

			tween.object[tween.property] = this.lerp(
				tween.propertyBeginValue,
				tween.target,
				tween.easing(phase),
			);

			if (tween.change) tween.change(tween);

			if (phase === 1) {
				tween.object[tween.property] = tween.target;
				if (tween.complete) tween.complete(tween);
				toRemove.push(tween);
			}
		}

		for (const tween of toRemove) {
			this.tweening.splice(this.tweening.indexOf(tween), 1);
		}
	}

	private tweenTo(
		object: any,
		property: string,
		target: number,
		time: number,
		easing: (t: number) => number,
		onChange?: (tween: any) => void,
		onComplete?: (tween: any) => void,
	) {
		const tween = {
			object,
			property,
			propertyBeginValue: object[property],
			target,
			easing,
			time,
			change: onChange,
			complete: onComplete,
			start: Date.now(),
		};

		this.tweening.push(tween);
		return tween;
	}

	private lerp(a: number, b: number, t: number): number {
		return a * (1 - t) + b * t;
	}

	private backout(amount: number) {
		return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
	}

	// Slot machine spin functionality
	private startSpin() {
		if (this.running) return;
		this.running = true;

		for (let i = 0; i < this.reels.length; i++) {
			const reel = this.reels[i];
			const extra = Math.floor(Math.random() * 3);
			const target = reel.position + 10 + i * 5 + extra;
			const time = 2500 + i * 600 + extra * 600;

			this.tweenTo(
				reel,
				'position',
				target,
				time,
				this.backout(0.5),
				undefined,
				i === this.reels.length - 1 ? () => this.reelsComplete() : undefined,
			);
		}
	}

	private reelsComplete() {
		this.running = false;
		// TODO: Connect to RGS result handling here
		console.log('Spin complete - ready for RGS integration');
	}

	private setupComponents() {
		// Title - keep at top
		this.title = new Label({
			text: 'C.R.E.A.M. LINK',
			style: {
				fontSize: 56,
				fill: 0xffffff,
				fontWeight: 'bold',
			},
		});
		this.title.y = -320;
		this.demoContainer.addChild(this.title);

		// Create bottom UI panel
		this.infoPanel = new RoundedBox({
			width: 900,
			height: 100, // Smaller height for bottom bar
			color: 0x00bf,
			shadow: true,
			shadowColor: 0x00bf,
			shadowOffset: 8,
		});
		this.infoPanel.y = 200; // Will be repositioned in resize method
		this.demoContainer.addChild(this.infoPanel);

		// Create a container for bottom UI elements
		this.bottomUIContainer = new Container();
		this.bottomUIContainer.y = 200; // Will be repositioned in resize method
		this.demoContainer.addChild(this.bottomUIContainer);

		// Balance Display - left side of bottom bar
		this.balanceDisplay = new Label({
			text: `$${this.balance.toFixed(2)}`,
			style: {
				fontSize: 30,
				fill: 0x00ff88,
				fontWeight: 'bold',
			},
		});
		this.balanceDisplay.x = -240;
		this.balanceDisplay.y = -220;
		this.bottomUIContainer.addChild(this.balanceDisplay);

		// Bet Display - left-center of bottom bar
		this.betDisplay = new Label({
			text: `: $${this.betAmount.toFixed(2)}`,
			style: {
				fontSize: 30,
				fill: 0xffff00,
				fontWeight: 'bold',
			},
		});
		this.betDisplay.x = 300;
		this.betDisplay.y = -30;
		this.bottomUIContainer.addChild(this.betDisplay);

		// Win Display - right side of bottom bar
		this.winDisplay = new Label({
			text: `Win: $${this.winAmount.toFixed(2)}`,
			style: {
				fontSize: 30,
				fill: 0xff4444,
				fontWeight: 'bold',
			},
		});
		this.winDisplay.x = 180;
		this.winDisplay.y = -220;
		this.bottomUIContainer.addChild(this.winDisplay);

		// Main Play Button - center of bottom bar, scaled to 0.5
		this.playButton = new FancyButton({
			defaultView: 'Playbutton.png',
			anchor: 0.5,
			scale: 0.5, // Scaled to 0.5 as requested
			animations: {
				hover: { props: { scale: { x: 0.95, y: 0.95 } }, duration: 100 },
				pressed: { props: { scale: { x: 0.85, y: 0.85 } }, duration: 100 },
			},
		});
		this.playButton.y = -20;
		this.bottomUIContainer.addChild(this.playButton);

		// Bet Increase Button - right of play button
		this.betIncreaseButton = new FancyButton({
			defaultView: 'increase.png',
			anchor: 0.5,
			scale: 1.2,
			animations: {
				hover: { props: { scale: { x: 0.95, y: 0.95 } }, duration: 100 },
				pressed: { props: { scale: { x: 0.85, y: 0.85 } }, duration: 100 },
			},
		});
		this.betIncreaseButton.x = 100;
		this.betIncreaseButton.y = -20;
		this.bottomUIContainer.addChild(this.betIncreaseButton);

		// Bet Decrease Button - left of play button
		this.betDecreaseButton = new FancyButton({
			defaultView: 'decrease.png',
			anchor: 0.5,
			scale: 1.2,
			animations: {
				hover: { props: { scale: { x: 0.95, y: 0.95 } }, duration: 100 },
				pressed: { props: { scale: { x: 0.85, y: 0.85 } }, duration: 100 },
			},
		});
		this.betDecreaseButton.x = -100;
		this.betDecreaseButton.y = -20;
		this.bottomUIContainer.addChild(this.betDecreaseButton);

		// Auto Play Button - left side of bottom bar
		this.autoButton = new FancyButton({
			defaultView: 'auto.png',
			anchor: 0.5,
			scale: 1.2,
			animations: {
				hover: { props: { scale: { x: 0.95, y: 0.95 } }, duration: 100 },
				pressed: { props: { scale: { x: 0.85, y: 0.85 } }, duration: 100 },
			},
		});
		this.autoButton.x = -250;
		this.autoButton.y = 20;
		this.bottomUIContainer.addChild(this.autoButton);

		// Turbo Button - left side of bottom bar
		this.turboButton = new FancyButton({
			defaultView: 'turbo-off.png',
			anchor: 0.5,
			scale: 1.2,
			animations: {
				hover: { props: { scale: { x: 0.95, y: 0.95 } }, duration: 100 },
				pressed: { props: { scale: { x: 0.85, y: 0.85 } }, duration: 100 },
			},
		});
		this.turboButton.x = -200;
		this.turboButton.y = 20;
		this.bottomUIContainer.addChild(this.turboButton);

		// Volume Button - right side of bottom bar
		this.volumeButton = new FancyButton({
			defaultView: 'vol-on.png',
			anchor: 0.5,
			scale: 1,
			animations: {
				hover: { props: { scale: { x: 0.95, y: 0.95 } }, duration: 100 },
				pressed: { props: { scale: { x: 0.85, y: 0.85 } }, duration: 100 },
			},
		});
		this.volumeButton.x = 200;
		this.volumeButton.y = 20;
		this.bottomUIContainer.addChild(this.volumeButton);

		// Menu Button - right side of bottom bar
		this.menuButton = new FancyButton({
			defaultView: 'menu.png',
			anchor: 0.5,
			scale: 2.5,
			animations: {
				hover: { props: { scale: { x: 0.95, y: 0.95 } }, duration: 100 },
				pressed: { props: { scale: { x: 0.85, y: 0.85 } }, duration: 100 },
			},
		});
		this.menuButton.x = -350;
		this.menuButton.y = 10;
		this.bottomUIContainer.addChild(this.menuButton);

		// Pause Button (keep at top left of screen, not in bottom bar)
		this.pauseButton = new FancyButton({
			defaultView: 'icon-pause.png',
			anchor: 0.5,
			scale: 0.0,
			animations: {
				hover: { props: { scale: { x: 0.65, y: 0.65 } }, duration: 100 },
				pressed: { props: { scale: { x: 0.55, y: 0.55 } }, duration: 100 },
			},
		});
		this.pauseButton.x = -400;
		this.pauseButton.y = -320;
		this.demoContainer.addChild(this.pauseButton);

		// Settings Button (keep at top right of screen, not in bottom bar)
		this.settingsButton = new FancyButton({
			defaultView: 'icon-settings.png',
			anchor: 0.5,
			scale: 0,
			animations: {
				hover: { props: { scale: { x: 0.65, y: 0.65 } }, duration: 100 },
				pressed: { props: { scale: { x: 0.55, y: 0.55 } }, duration: 100 },
			},
		});
		this.settingsButton.x = 400;
		this.settingsButton.y = -320;
		this.demoContainer.addChild(this.settingsButton);

		// Back button - keep at bottom left corner
		this.backButton = new FancyButton({
			defaultView: 'rounded-rectangle.png',
			text: new Label({
				text: '← Back',
				style: {
					fontSize: 20,
					fill: 0xffffff,
				},
			}),
			textOffset: { x: 0, y: -5 },
			scale: 0.6,
			anchor: 0.5,
			animations: {
				hover: {
					props: { scale: { x: 0.65, y: 0.65 } },
					duration: 100,
				},
				pressed: {
					props: { scale: { x: 0.55, y: 0.55 } },
					duration: 100,
				},
			},
		});
		this.backButton.width = 120;
		this.backButton.height = 60;
		this.addChild(this.backButton);

		// Responsive design demo
		this.responsiveText = new Label({
			text: 'Responsive: Loading...',
			style: {
				fontSize: 18,
				fill: 0x00ff88,
				fontStyle: 'italic',
			},
		});
		this.responsiveContainer.addChild(this.responsiveText);

		this.updateResponsiveInfo();
	}

	private setupInteractions() {
		// Play Button - Main game action
		this.playButton.onPress.connect(async () => {
			if (this.balance >= this.betAmount) {
				this.startSpin(); // Use slot machine spin instead
				await this.playGame();
			} else {
				this.showInsufficientFundsMessage();
			}
			engine().audio.sfx.play('main/sounds/sfx-press.wav', { volume: 0.7 });
		});
		this.playButton.onHover.connect(() => {
			engine().audio.sfx.play('main/sounds/sfx-hover.wav', { volume: 0.5 });
		});

		// Bet Increase Button
		this.betIncreaseButton.onPress.connect(() => {
			this.increaseBet();
			engine().audio.sfx.play('main/sounds/sfx-press.wav', { volume: 0.7 });
		});
		this.betIncreaseButton.onHover.connect(() => {
			engine().audio.sfx.play('main/sounds/sfx-hover.wav', { volume: 0.5 });
		});

		// Bet Decrease Button
		this.betDecreaseButton.onPress.connect(() => {
			this.decreaseBet();
			engine().audio.sfx.play('main/sounds/sfx-press.wav', { volume: 0.7 });
		});
		this.betDecreaseButton.onHover.connect(() => {
			engine().audio.sfx.play('main/sounds/sfx-hover.wav', { volume: 0.5 });
		});

		// Auto Play Button
		this.autoButton.onPress.connect(() => {
			this.toggleAutoPlay();
			engine().audio.sfx.play('main/sounds/sfx-press.wav', { volume: 0.7 });
		});
		this.autoButton.onHover.connect(() => {
			engine().audio.sfx.play('main/sounds/sfx-hover.wav', { volume: 0.5 });
		});

		// Turbo Button
		this.turboButton.onPress.connect(() => {
			this.toggleTurbo();
			engine().audio.sfx.play('main/sounds/sfx-press.wav', { volume: 0.7 });
		});
		this.turboButton.onHover.connect(() => {
			engine().audio.sfx.play('main/sounds/sfx-hover.wav', { volume: 0.5 });
		});

		// Volume Button
		this.volumeButton.onPress.connect(() => {
			this.toggleSound();
			engine().audio.sfx.play('main/sounds/sfx-press.wav', { volume: 0.7 });
		});
		this.volumeButton.onHover.connect(() => {
			engine().audio.sfx.play('main/sounds/sfx-hover.wav', { volume: 0.5 });
		});

		// Menu Button
		this.menuButton.onPress.connect(() => {
			this.showMenu();
			engine().audio.sfx.play('main/sounds/sfx-press.wav', { volume: 0.7 });
		});
		this.menuButton.onHover.connect(() => {
			engine().audio.sfx.play('main/sounds/sfx-hover.wav', { volume: 0.5 });
		});

		// Pause Button
		this.pauseButton.onPress.connect(() => {
			engine().navigation.presentPopup(
				// Import and use your PausePopup
				(globalThis as any).PausePopup || (Container as any),
			);
			engine().audio.sfx.play('main/sounds/sfx-press.wav', { volume: 0.7 });
		});
		this.pauseButton.onHover.connect(() => {
			engine().audio.sfx.play('main/sounds/sfx-hover.wav', { volume: 0.5 });
		});

		// Settings Button
		this.settingsButton.onPress.connect(() => {
			engine().navigation.presentPopup(
				// Import and use your SettingsPopup
				(globalThis as any).SettingsPopup || (Container as any),
			);
			engine().audio.sfx.play('main/sounds/sfx-press.wav', { volume: 0.7 });
		});
		this.settingsButton.onHover.connect(() => {
			engine().audio.sfx.play('main/sounds/sfx-hover.wav', { volume: 0.5 });
		});

		// Back button
		this.backButton.onPress.connect(() => {
			// Import MainScreen dynamically to avoid circular dependency
			import('./main/MainScreen').then(({ MainScreen }) => {
				engine().navigation.showScreen(MainScreen);
			});
			engine().audio.sfx.play('main/sounds/sfx-press.wav', { volume: 0.7 });
		});
		this.backButton.onHover.connect(() => {
			engine().audio.sfx.play('main/sounds/sfx-hover.wav', { volume: 0.5 });
		});
	}

	// Game Logic Methods
	private async playGame() {
		// Deduct bet amount
		this.balance -= this.betAmount;
		this.updateDisplays();

		// Simulate game delay
		const gameDelay = this.isTurboEnabled ? 500 : 1000;
		await utils.waitForTimeout(gameDelay);

		// Generate random win (demo logic)
		const winChance = 0.3; // 30% chance to win
		const randomValue = utils.randomInteger({ min: 1, max: 100 });

		if (randomValue <= winChance * 100) {
			// Win scenario
			const multiplier = utils.randomInteger({ min: 2, max: 10 });
			this.winAmount = this.betAmount * multiplier;
			this.balance += this.winAmount;

			// Animate win
			await this.animateWin();
		} else {
			// Lose scenario
			this.winAmount = 0;
		}

		this.updateDisplays();
	}

	private async animateWin() {
		// Flash win display
		for (let i = 0; i < 3; i++) {
			this.winDisplay.style.fill = 0xffff00;
			await utils.waitForTimeout(200);
			this.winDisplay.style.fill = 0xff4444;
			await utils.waitForTimeout(200);
		}
	}

	private increaseBet() {
		const increments = [1, 5, 10, 25, 50, 100];
		const currentIndex = increments.findIndex((inc) => inc >= this.betAmount);
		const nextIndex = Math.min(currentIndex + 1, increments.length - 1);
		this.betAmount = increments[nextIndex];
		this.updateDisplays();
	}

	private decreaseBet() {
		const increments = [1, 5, 10, 25, 50, 100];
		const currentIndex = increments.findIndex((inc) => inc >= this.betAmount);
		const prevIndex = Math.max(currentIndex - 1, 0);
		this.betAmount = increments[prevIndex];
		this.updateDisplays();
	}

	private toggleAutoPlay() {
		this.isAutoPlaying = !this.isAutoPlaying;

		// Update button appearance based on state
		if (this.isAutoPlaying) {
			this.autoButton.tint = 0x00ff88; // Green tint when active
		} else {
			this.autoButton.tint = 0xffffff; // Normal tint
		}
	}

	private toggleTurbo() {
		this.isTurboEnabled = !this.isTurboEnabled;

		// Update button texture based on state
		if (this.isTurboEnabled) {
			this.turboButton.defaultView = 'turbo-on.png';
		} else {
			this.turboButton.defaultView = 'turbo-off.png';
		}
	}

	private toggleSound() {
		this.isSoundEnabled = !this.isSoundEnabled;

		// Update button texture and engine sound
		if (this.isSoundEnabled) {
			this.volumeButton.defaultView = 'vol-on.png';
			engine().audio.setMasterVolume(0.5);
		} else {
			this.volumeButton.defaultView = 'vol-off.png';
			engine().audio.setMasterVolume(0);
		}
	}

	private showMenu() {
		// Create a simple demo message
		this.title.text = 'Menu Clicked!';
		setTimeout(() => {
			this.title.text = 'Betting Interface Demo';
		}, 1000);
	}

	private showInsufficientFundsMessage() {
		// Flash balance display red
		const originalColor = this.balanceDisplay.style.fill;
		this.balanceDisplay.style.fill = 0xff0000;
		this.balanceDisplay.text = 'Insufficient Funds!';

		setTimeout(() => {
			this.balanceDisplay.style.fill = originalColor;
			this.updateDisplays();
		}, 1500);
	}

	private updateDisplays() {
		this.balanceDisplay.text = `Balance: $${this.balance.toFixed(2)}`;
		this.betDisplay.text = `Bet: $${this.betAmount.toFixed(2)}`;
		this.winDisplay.text = `Win: $${this.winAmount.toFixed(2)}`;

		// Update colors based on values
		this.balanceDisplay.style.fill = this.balance > 0 ? 0x00ff88 : 0xff4444;
		this.winDisplay.style.fill = this.winAmount > 0 ? 0xffff00 : 0xff4444;
	}

	private updateResponsiveInfo() {
		const viewport = WebSDKIntegration.getViewportSize();
		const isPortrait = WebSDKIntegration.isPortrait();
		const scaleFactor = WebSDKIntegration.getScaleFactor().toFixed(2);

		this.responsiveText.text =
			`Viewport: ${viewport.width}x${viewport.height} | ` +
			`Orientation: ${isPortrait ? 'Portrait' : 'Landscape'} | ` +
			`Scale: ${scaleFactor}x`;
	}

	/** Prepare the screen */
	public prepare() {
		this.updateResponsiveInfo();
	}

	/** Resize the screen */
	public resize(width: number, height: number) {
		const centerX = width * 0.5;
		const centerY = height * 0.5;

		this.mainContainer.x = centerX;
		this.mainContainer.y = centerY;

		// Scale backgrounds to cover the screen
		const backgroundScale = Math.max(width / 3840, height / 2160) * 0.9; // 0.6 for slight overflow
		[this.bg1, this.bg2, this.bg3].forEach((bg) => {
			if (bg) {
				bg.scale.set(backgroundScale);
			}
		});

		// Position back button
		this.backButton.x = 80;
		this.backButton.y = 50;

		// Position bottom UI bar at actual bottom of screen
		const bottomBarY = height / 2 - 20; // 20px from bottom edge
		if (this.infoPanel) {
			this.infoPanel.y = bottomBarY;
		}
		if (this.bottomUIContainer) {
			this.bottomUIContainer.y = bottomBarY;
		}

		// Position responsive info
		this.responsiveContainer.x = 20;
		this.responsiveContainer.y = height - 40;

		// Update responsive info when resizing
		this.updateResponsiveInfo();

		// Apply responsive scaling using Web SDK utilities
		const scaleFactor = WebSDKIntegration.getScaleFactor();
		const minScale = 0.5;
		const maxScale = 1.2;
		const adjustedScale = Math.max(minScale, Math.min(maxScale, scaleFactor));

		this.demoContainer.scale.set(adjustedScale);
	}

	/** Show screen with animations */
	public async show() {
		// Initialize displays
		this.updateDisplays();

		// Fade in animation
		this.alpha = 0;
		await animate(this, { alpha: 1 }, { duration: 0.5, ease: 'easeOut' });

		// Stagger animations for components
		const components = [
			this.title,
			this.infoPanel,
			this.balanceDisplay,
			this.betDisplay,
			this.winDisplay,
			this.playButton,
			this.betIncreaseButton,
			this.betDecreaseButton,
			this.autoButton,
			this.turboButton,
			this.volumeButton,
			this.menuButton,
			this.pauseButton,
			this.settingsButton,
		];

		// Animate UI components
		for (let i = 0; i < components.length; i++) {
			const component = components[i];
			component.alpha = 0;
			component.scale.set(component.scale.x * 0.8, component.scale.y * 0.8);

			animate(component, { alpha: 1 }, { duration: 0.3, delay: i * 0.05 });
			animate(
				component.scale,
				{ x: component.scale.x / 0.8, y: component.scale.y / 0.8 },
				{
					duration: 0.4,
					delay: i * 0.05,
					ease: 'backOut',
				},
			);
		}

		// Animate reel container
		if (this.reelContainer) {
			this.reelContainer.alpha = 0;
			animate(this.reelContainer, { alpha: 1 }, { duration: 0.5, delay: 0.2 });
		}
	}

	/** Hide screen with animations */
	public async hide() {
		// Clean up ticker
		engine().ticker.remove(this.updateSlotMachine);
		await animate(this, { alpha: 0 }, { duration: 0.3, ease: 'easeIn' });
	}
}
