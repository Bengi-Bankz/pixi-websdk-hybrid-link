import { Container, Text, Graphics } from 'pixi.js';
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

	private setupLayout() {
		this.mainContainer = new Container();
		this.addChild(this.mainContainer);

		// Demo container for components
		this.demoContainer = new Container();
		this.mainContainer.addChild(this.demoContainer);

		// Responsive demo container
		this.responsiveContainer = new Container();
		this.mainContainer.addChild(this.responsiveContainer);
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

		for (let i = 0; i < components.length; i++) {
			const component = components[i];
			component.alpha = 0;
			component.scale.set(0.8);

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
