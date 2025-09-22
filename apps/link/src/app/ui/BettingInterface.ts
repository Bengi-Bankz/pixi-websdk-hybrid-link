import { Container, Text, Graphics } from 'pixi.js';
import { FancyButton } from '@pixi/ui';
import { animate } from 'motion';

import { Label } from '../ui/Label';
import { WebSDKIntegration, utils } from '../../webSDKIntegration';

/**
 * Advanced betting interface component using Web SDK patterns
 * Demonstrates responsive design, state management, and UI consistency
 */
export class BettingInterface extends Container {
	// State management
	private _balance = 1000.0;
	private _betAmount = 10.0;
	private _winAmount = 0.0;
	private _isPlaying = false;

	// UI Components
	private balanceLabel: Label;
	private betLabel: Label;
	private winLabel: Label;
	private playButton: FancyButton;
	private betContainer: Container;

	// Configuration using Web SDK patterns
	private config = WebSDKIntegration.integration.createButtonConfig({
		text: 'SPIN',
		size: 'large',
		style: 'primary',
	});

	constructor() {
		super();
		this.setupInterface();
	}

	private setupInterface() {
		// Create responsive layout using Web SDK utilities
		const isPortrait = WebSDKIntegration.isPortrait();
		const spacing = WebSDKIntegration.ui.spacing;

		// Balance display with consistent styling
		this.balanceLabel = new Label({
			text: `$${this._balance.toFixed(2)}`,
			style: {
				fontSize: WebSDKIntegration.ui.fonts.sizes.xl,
				fill: WebSDKIntegration.ui.colors.success,
				fontFamily: WebSDKIntegration.ui.fonts.primary,
				fontWeight: 'bold',
			},
		});

		// Bet display
		this.betLabel = new Label({
			text: `Bet: $${this._betAmount.toFixed(2)}`,
			style: {
				fontSize: WebSDKIntegration.ui.fonts.sizes.large,
				fill: WebSDKIntegration.ui.colors.text.primary,
				fontFamily: WebSDKIntegration.ui.fonts.primary,
			},
		});

		// Win display
		this.winLabel = new Label({
			text: `Win: $${this._winAmount.toFixed(2)}`,
			style: {
				fontSize: WebSDKIntegration.ui.fonts.sizes.large,
				fill: WebSDKIntegration.ui.colors.accent,
				fontFamily: WebSDKIntegration.ui.fonts.primary,
				fontWeight: 'bold',
			},
		});

		// Main play button using Web SDK styling
		this.playButton = new FancyButton({
			defaultView: 'Playbutton.png',
			anchor: 0.5,
			animations: {
				hover: {
					props: { scale: { x: 1.05, y: 1.05 } },
					duration: WebSDKIntegration.ui.animations.durations.fast * 1000,
				},
				pressed: {
					props: { scale: { x: 0.95, y: 0.95 } },
					duration: WebSDKIntegration.ui.animations.durations.fast * 1000,
				},
			},
		});

		// Set up interactions
		this.playButton.onPress.connect(() => this.handlePlay());

		// Add components to container
		this.addChild(this.balanceLabel);
		this.addChild(this.betLabel);
		this.addChild(this.winLabel);
		this.addChild(this.playButton);

		// Apply responsive layout
		this.applyResponsiveLayout();
	}

	private applyResponsiveLayout() {
		const isPortrait = WebSDKIntegration.isPortrait();
		const scaleFactor = WebSDKIntegration.getScaleFactor();
		const spacing = WebSDKIntegration.ui.spacing;

		if (isPortrait) {
			// Vertical layout for portrait
			this.balanceLabel.y = -spacing.xxl * 2;
			this.betLabel.y = -spacing.xl;
			this.playButton.y = 0;
			this.winLabel.y = spacing.xl;
		} else {
			// Horizontal layout for landscape
			WebSDKIntegration.layout.createGrid(
				[this.balanceLabel, this.betLabel, this.playButton, this.winLabel],
				{
					columns: 4,
					spacing: spacing.lg,
					startX: -300,
					startY: 0,
				},
			);
		}

		// Apply responsive scaling
		const minScale = 0.6;
		const maxScale = 1.2;
		const adjustedScale = Math.max(minScale, Math.min(maxScale, scaleFactor));
		this.scale.set(adjustedScale);
	}

	private async handlePlay() {
		if (this._isPlaying || this._balance < this._betAmount) {
			return;
		}

		this._isPlaying = true;
		this.playButton.interactive = false;

		try {
			// Deduct bet
			this._balance -= this._betAmount;
			this.updateDisplays();

			// Animate spinning
			await this.animatePlay();

			// Calculate result using Web SDK utilities
			const isWin = utils.randomInteger({ min: 1, max: 100 }) <= 30; // 30% win chance

			if (isWin) {
				const multiplier = utils.randomInteger({ min: 2, max: 10 });
				this._winAmount = this._betAmount * multiplier;
				this._balance += this._winAmount;
				await this.animateWin();
			} else {
				this._winAmount = 0;
			}

			this.updateDisplays();
		} finally {
			this._isPlaying = false;
			this.playButton.interactive = true;
		}
	}

	private async animatePlay() {
		// Spin animation
		const originalRotation = this.playButton.rotation;
		await animate(
			this.playButton,
			{ rotation: originalRotation + Math.PI * 4 },
			{ duration: 1.0, ease: 'easeOut' },
		);
		this.playButton.rotation = originalRotation;
	}

	private async animateWin() {
		// Flash effect for win
		const flashCount = 5;
		const originalTint = this.winLabel.tint;

		for (let i = 0; i < flashCount; i++) {
			this.winLabel.tint = WebSDKIntegration.ui.colors.warning;
			await utils.waitForTimeout(100);
			this.winLabel.tint = originalTint;
			await utils.waitForTimeout(100);
		}

		// Scale bounce
		await animate(this.winLabel.scale, { x: 1.3, y: 1.3 }, { duration: 0.2, ease: 'backOut' });
		await animate(this.winLabel.scale, { x: 1, y: 1 }, { duration: 0.3, ease: 'backOut' });
	}

	private updateDisplays() {
		this.balanceLabel.text = `$${this._balance.toFixed(2)}`;
		this.betLabel.text = `Bet: $${this._betAmount.toFixed(2)}`;
		this.winLabel.text = `Win: $${this._winAmount.toFixed(2)}`;

		// Update colors based on Web SDK color system
		this.balanceLabel.style.fill =
			this._balance > 0 ? WebSDKIntegration.ui.colors.success : WebSDKIntegration.ui.colors.error;

		this.winLabel.style.fill =
			this._winAmount > 0
				? WebSDKIntegration.ui.colors.warning
				: WebSDKIntegration.ui.colors.text.muted;
	}

	// Public API methods
	public resize(width: number, height: number) {
		this.applyResponsiveLayout();
	}

	public get balance() {
		return this._balance;
	}
	public set balance(value: number) {
		this._balance = value;
		this.updateDisplays();
	}

	public get betAmount() {
		return this._betAmount;
	}
	public set betAmount(value: number) {
		this._betAmount = Math.max(1, value);
		this.updateDisplays();
	}

	public get isPlaying() {
		return this._isPlaying;
	}
}
