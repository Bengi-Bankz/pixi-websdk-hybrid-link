import { Container, Text, Graphics, Sprite } from 'pixi.js';
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

	// Render Groups
	private bgRenderGroup: Container;
	private symbolsRenderGroup: Container;
	private uiRenderGroup: Container;

	// Background Sprites
	private bg1: Sprite;
	private bg2: Sprite;
	private bg3: Sprite;

	// Symbol Sprites
	private symbolH1: Sprite;
	private symbolH2: Sprite;
	private symbolH3: Sprite;
	private symbolH4: Sprite;
	private symbolH5: Sprite;
	private symbolL1: Sprite;
	private symbolL2: Sprite;
	private symbolL3: Sprite;
	private symbolL4: Sprite;
	private symbolS: Sprite;
	private symbolW: Sprite;

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
		this.symbolsRenderGroup.zIndex = 3;
		this.symbolsRenderGroup.sortableChildren = true;
		this.mainContainer.addChild(this.symbolsRenderGroup);

		this.uiRenderGroup = new Container();
		this.uiRenderGroup.zIndex = 2;
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
		this.setupSymbols();
	}

	private setupSymbols() {
		// Create a grid layout for symbols in the center of the screen
		const symbolSpacing = 120;
		const gridWidth = 4; // 4 columns
		const startX = (-(gridWidth - 1) * symbolSpacing) / 2;
		const startY = -symbolSpacing;

		// High value symbols (H1-H5)
		const highSymbols = ['H1.png', 'H2.png', 'H3.png', 'H4.png', 'H5.png'];
		const highSprites = [
			(this.symbolH1 = Sprite.from(highSymbols[0])),
			(this.symbolH2 = Sprite.from(highSymbols[1])),
			(this.symbolH3 = Sprite.from(highSymbols[2])),
			(this.symbolH4 = Sprite.from(highSymbols[3])),
			(this.symbolH5 = Sprite.from(highSymbols[4])),
		];

		// Low value symbols (L1-L4)
		const lowSymbols = ['L1.png', 'L2.png', 'L3.png', 'L4.png'];
		const lowSprites = [
			(this.symbolL1 = Sprite.from(lowSymbols[0])),
			(this.symbolL2 = Sprite.from(lowSymbols[1])),
			(this.symbolL3 = Sprite.from(lowSymbols[2])),
			(this.symbolL4 = Sprite.from(lowSymbols[3])),
		];

		// Special symbols
		this.symbolS = Sprite.from('S.png'); // Scatter
		this.symbolW = Sprite.from('W.png'); // Wild

		// Arrange symbols in a grid
		const allSymbols = [...highSprites, ...lowSprites, this.symbolS, this.symbolW];

		allSymbols.forEach((symbol, index) => {
			symbol.anchor.set(0.5);
			symbol.scale.set(0.15); // Scale down to fit nicely

			const col = index % gridWidth;
			const row = Math.floor(index / gridWidth);

			symbol.x = startX + col * symbolSpacing;
			symbol.y = startY + row * symbolSpacing;

			this.symbolsRenderGroup.addChild(symbol);
		});
	}

	private setupComponents() {
		// Title
		this.title = new Label({
			text: 'Betting Interface Demo',
			style: {
				fontSize: 36,
				fill: 0xffffff,
				fontWeight: 'bold',
			},
		});
		this.title.y = -320;
		this.demoContainer.addChild(this.title);

		// Info panel background - larger to accommodate betting interface
		this.infoPanel = new RoundedBox({
			width: 800,
			height: 500,
			color: 0x1a1a2e,
			shadow: true,
			shadowColor: 0x16213e,
			shadowOffset: 10,
		});
		this.demoContainer.addChild(this.infoPanel);

		// Balance Display
		this.balanceDisplay = new Label({
			text: `Balance: $${this.balance.toFixed(2)}`,
			style: {
				fontSize: 24,
				fill: 0x00ff88,
				fontWeight: 'bold',
			},
		});
		this.balanceDisplay.x = -300;
		this.balanceDisplay.y = -200;
		this.demoContainer.addChild(this.balanceDisplay);

		// Bet Display
		this.betDisplay = new Label({
			text: `Bet: $${this.betAmount.toFixed(2)}`,
			style: {
				fontSize: 20,
				fill: 0xffff00,
				fontWeight: 'bold',
			},
		});
		this.betDisplay.x = 0;
		this.betDisplay.y = -200;
		this.demoContainer.addChild(this.betDisplay);

		// Win Display
		this.winDisplay = new Label({
			text: `Win: $${this.winAmount.toFixed(2)}`,
			style: {
				fontSize: 24,
				fill: 0xff4444,
				fontWeight: 'bold',
			},
		});
		this.winDisplay.x = 300;
		this.winDisplay.y = -200;
		this.demoContainer.addChild(this.winDisplay);

		// Main Play Button
		this.playButton = new FancyButton({
			defaultView: 'Playbutton.png',
			anchor: 0.5,
			scale: 0.8,
			animations: {
				hover: { props: { scale: { x: 0.85, y: 0.85 } }, duration: 100 },
				pressed: { props: { scale: { x: 0.75, y: 0.75 } }, duration: 100 },
			},
		});
		this.playButton.y = -50;
		this.demoContainer.addChild(this.playButton);

		// Bet Increase Button
		this.betIncreaseButton = new FancyButton({
			defaultView: 'increase.png',
			anchor: 0.5,
			scale: 0.7,
			animations: {
				hover: { props: { scale: { x: 0.75, y: 0.75 } }, duration: 100 },
				pressed: { props: { scale: { x: 0.65, y: 0.65 } }, duration: 100 },
			},
		});
		this.betIncreaseButton.x = 80;
		this.betIncreaseButton.y = -50;
		this.demoContainer.addChild(this.betIncreaseButton);

		// Bet Decrease Button
		this.betDecreaseButton = new FancyButton({
			defaultView: 'decrease.png',
			anchor: 0.5,
			scale: 0.7,
			animations: {
				hover: { props: { scale: { x: 0.75, y: 0.75 } }, duration: 100 },
				pressed: { props: { scale: { x: 0.65, y: 0.65 } }, duration: 100 },
			},
		});
		this.betDecreaseButton.x = -80;
		this.betDecreaseButton.y = -50;
		this.demoContainer.addChild(this.betDecreaseButton);

		// Auto Play Button
		this.autoButton = new FancyButton({
			defaultView: 'auto.png',
			anchor: 0.5,
			scale: 0.6,
			animations: {
				hover: { props: { scale: { x: 0.65, y: 0.65 } }, duration: 100 },
				pressed: { props: { scale: { x: 0.55, y: 0.55 } }, duration: 100 },
			},
		});
		this.autoButton.x = -200;
		this.autoButton.y = 50;
		this.demoContainer.addChild(this.autoButton);

		// Turbo Button
		this.turboButton = new FancyButton({
			defaultView: 'turbo-off.png',
			anchor: 0.5,
			scale: 0.6,
			animations: {
				hover: { props: { scale: { x: 0.65, y: 0.65 } }, duration: 100 },
				pressed: { props: { scale: { x: 0.55, y: 0.55 } }, duration: 100 },
			},
		});
		this.turboButton.x = -100;
		this.turboButton.y = 50;
		this.demoContainer.addChild(this.turboButton);

		// Volume Button
		this.volumeButton = new FancyButton({
			defaultView: 'vol-on.png',
			anchor: 0.5,
			scale: 0.6,
			animations: {
				hover: { props: { scale: { x: 0.65, y: 0.65 } }, duration: 100 },
				pressed: { props: { scale: { x: 0.55, y: 0.55 } }, duration: 100 },
			},
		});
		this.volumeButton.x = 100;
		this.volumeButton.y = 50;
		this.demoContainer.addChild(this.volumeButton);

		// Menu Button
		this.menuButton = new FancyButton({
			defaultView: 'menu.png',
			anchor: 0.5,
			scale: 0.6,
			animations: {
				hover: { props: { scale: { x: 0.65, y: 0.65 } }, duration: 100 },
				pressed: { props: { scale: { x: 0.55, y: 0.55 } }, duration: 100 },
			},
		});
		this.menuButton.x = 200;
		this.menuButton.y = 50;
		this.demoContainer.addChild(this.menuButton);

		// Pause Button (top left)
		this.pauseButton = new FancyButton({
			defaultView: 'icon-pause.png',
			anchor: 0.5,
			scale: 0.8,
			animations: {
				hover: { props: { scale: { x: 0.85, y: 0.85 } }, duration: 100 },
				pressed: { props: { scale: { x: 0.75, y: 0.75 } }, duration: 100 },
			},
		});
		this.pauseButton.x = -350;
		this.pauseButton.y = -220;
		this.demoContainer.addChild(this.pauseButton);

		// Settings Button (top right)
		this.settingsButton = new FancyButton({
			defaultView: 'icon-settings.png',
			anchor: 0.5,
			scale: 0.8,
			animations: {
				hover: { props: { scale: { x: 0.85, y: 0.85 } }, duration: 100 },
				pressed: { props: { scale: { x: 0.75, y: 0.75 } }, duration: 100 },
			},
		});
		this.settingsButton.x = 350;
		this.settingsButton.y = -220;
		this.demoContainer.addChild(this.settingsButton);

		// Back button
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
			scale: 0.8,
			anchor: 0.5,
			animations: {
				hover: {
					props: { scale: { x: 0.85, y: 0.85 } },
					duration: 100,
				},
				pressed: {
					props: { scale: { x: 0.75, y: 0.75 } },
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
				await this.playGame();
			} else {
				this.showInsufficientFundsMessage();
			}
			this.playButtonFeedback();
		});

		// Bet Increase Button
		this.betIncreaseButton.onPress.connect(() => {
			this.increaseBet();
			this.playButtonFeedback();
		});

		// Bet Decrease Button
		this.betDecreaseButton.onPress.connect(() => {
			this.decreaseBet();
			this.playButtonFeedback();
		});

		// Auto Play Button
		this.autoButton.onPress.connect(() => {
			this.toggleAutoPlay();
			this.playButtonFeedback();
		});

		// Turbo Button
		this.turboButton.onPress.connect(() => {
			this.toggleTurbo();
			this.playButtonFeedback();
		});

		// Volume Button
		this.volumeButton.onPress.connect(() => {
			this.toggleSound();
			this.playButtonFeedback();
		});

		// Menu Button
		this.menuButton.onPress.connect(() => {
			this.showMenu();
			this.playButtonFeedback();
		});

		// Pause Button
		this.pauseButton.onPress.connect(() => {
			engine().navigation.presentPopup(
				// Import and use your PausePopup
				(globalThis as any).PausePopup || (Container as any),
			);
		});

		// Settings Button
		this.settingsButton.onPress.connect(() => {
			engine().navigation.presentPopup(
				// Import and use your SettingsPopup
				(globalThis as any).SettingsPopup || (Container as any),
			);
		});

		// Back button
		this.backButton.onPress.connect(() => {
			// Import MainScreen dynamically to avoid circular dependency
			import('./main/MainScreen').then(({ MainScreen }) => {
				engine().navigation.showScreen(MainScreen);
			});
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

	private playButtonFeedback() {
		// Use existing audio system
		engine().audio.sfx.play('main/sounds/sfx-press.wav', { volume: 0.7 });
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
		const backgroundScale = Math.max(width / 3840, height / 2160) * 1.1; // 1.1 for slight overflow
		[this.bg1, this.bg2, this.bg3].forEach((bg) => {
			if (bg) {
				bg.scale.set(backgroundScale);
			}
		});

		// Position back button
		this.backButton.x = 80;
		this.backButton.y = 50;

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

		// Add symbols to animation sequence
		const symbols = [
			this.symbolH1,
			this.symbolH2,
			this.symbolH3,
			this.symbolH4,
			this.symbolH5,
			this.symbolL1,
			this.symbolL2,
			this.symbolL3,
			this.symbolL4,
			this.symbolS,
			this.symbolW,
		];

		const allComponents = [...components, ...symbols];

		for (let i = 0; i < allComponents.length; i++) {
			const component = allComponents[i];
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
	}

	/** Hide screen with animations */
	public async hide() {
		await animate(this, { alpha: 0 }, { duration: 0.3, ease: 'easeIn' });
	}
}
