import { userSettings } from './app/utils/userSettings';
import { engine } from './app/getEngine';

// Import useful utilities from the Web SDK
import { waitForResolve, waitForTimeout } from 'utils-shared/wait';
import { randomInteger } from 'utils-shared/random';

// Note: You can add more imports as needed from the Web SDK packages
// Check the packages folder to see what's available

/**
 * Web SDK Integration Layer
 * This provides a bridge between the PixiJS creation template and useful Web SDK utilities
 */
export class WebSDKIntegration {
	// Utility functions from utils-shared
	static utils = {
		waitForResolve,
		waitForTimeout,
		randomInteger,
	};

	// Enhanced user settings with Web SDK utilities
	static userSettings = {
		...userSettings,
		// Add any custom settings integrations here
	};

	// Engine utilities
	static getEngine() {
		return engine();
	}

	static getApp() {
		return engine(); // CreationEngine extends Application
	}

	static getStage() {
		return engine()?.stage;
	}

	static getRenderer() {
		return engine()?.renderer;
	}

	// Viewport utilities
	static getViewportSize() {
		const app = this.getApp();
		return {
			width: app?.screen?.width || window.innerWidth,
			height: app?.screen?.height || window.innerHeight,
		};
	}

	// Add responsive design helpers
	static isPortrait() {
		const { width, height } = this.getViewportSize();
		return height > width;
	}

	static isLandscape() {
		return !this.isPortrait();
	}

	// Get scale factor for responsive design
	static getScaleFactor() {
		const { width, height } = this.getViewportSize();
		const baseWidth = 1920;
		const baseHeight = 1080;

		return Math.min(width / baseWidth, height / baseHeight);
	}

	// UI Component Utilities
	static ui = {
		// Standard button sizes based on Web SDK conventions
		buttonSizes: {
			small: { width: 120, height: 60 },
			medium: { width: 200, height: 80 },
			large: { width: 280, height: 100 },
		},

		// Color palette inspired by Web SDK components
		colors: {
			primary: 0x0f3460,
			secondary: 0x1a1a2e,
			accent: 0xec1561,
			success: 0x00ff88,
			warning: 0xffa500,
			error: 0xff4444,
			text: {
				primary: 0xffffff,
				secondary: 0xcccccc,
				muted: 0x888888,
			},
			background: {
				dark: 0x1a1a2e,
				medium: 0x2a2a4e,
				light: 0x3a3a6e,
			},
		},

		// Font configurations matching Web SDK standards
		fonts: {
			primary: 'Arial Rounded MT Bold',
			secondary: 'proxima-nova',
			sizes: {
				small: 14,
				medium: 18,
				large: 24,
				xl: 32,
				xxl: 48,
			},
		},

		// Layout helpers
		spacing: {
			xs: 4,
			sm: 8,
			md: 16,
			lg: 24,
			xl: 32,
			xxl: 48,
		},

		// Animation presets
		animations: {
			durations: {
				fast: 0.1,
				normal: 0.3,
				slow: 0.5,
			},
			easings: {
				bounce: 'backOut',
				smooth: 'easeOut',
				snap: 'easeIn',
			},
		},
	};

	// Layout utilities inspired by Web SDK layout components
	static layout = {
		// Center content in viewport
		centerInViewport(container: any) {
			const { width, height } = WebSDKIntegration.getViewportSize();
			container.x = width * 0.5;
			container.y = height * 0.5;
		},

		// Position element with safe margins
		positionWithMargins(element: any, options: {
			top?: number;
			right?: number;
			bottom?: number;
			left?: number;
		}) {
			const { width, height } = WebSDKIntegration.getViewportSize();
			const margins = {
				top: options.top ?? 0,
				right: options.right ?? 0,
				bottom: options.bottom ?? 0,
				left: options.left ?? 0,
			};

			if (options.top !== undefined) element.y = margins.top;
			if (options.bottom !== undefined) element.y = height - margins.bottom;
			if (options.left !== undefined) element.x = margins.left;
			if (options.right !== undefined) element.x = width - margins.right;
		},

		// Create responsive grid layout
		createGrid(items: any[], options: {
			columns: number;
			spacing?: number;
			startX?: number;
			startY?: number;
		}) {
			const spacing = options.spacing ?? WebSDKIntegration.ui.spacing.md;
			const startX = options.startX ?? 0;
			const startY = options.startY ?? 0;

			items.forEach((item, index) => {
				const row = Math.floor(index / options.columns);
				const col = index % options.columns;
				
				item.x = startX + col * (item.width + spacing);
				item.y = startY + row * (item.height + spacing);
			});
		},
	};

	// Device and performance utilities
	static device = {
		isMobile() {
			return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		},

		isTablet() {
			return /iPad|Android|Tablet/i.test(navigator.userAgent) && !this.isMobile();
		},

		isDesktop() {
			return !this.isMobile() && !this.isTablet();
		},

		// Get device category for responsive design
		getDeviceCategory() {
			if (this.isMobile()) return 'mobile';
			if (this.isTablet()) return 'tablet';
			return 'desktop';
		},

		// Performance helpers
		getDevicePixelRatio() {
			return window.devicePixelRatio || 1;
		},

		// Memory and performance considerations
		shouldUseHighQuality() {
			const ratio = this.getDevicePixelRatio();
			const { width, height } = WebSDKIntegration.getViewportSize();
			const totalPixels = width * height * ratio;
			
			// Use high quality for larger, high-DPI displays
			return totalPixels > 2073600; // 1920x1080 threshold
		},
	};

	// Integration helpers for Web SDK components
	static integration = {
		// Create consistent button configuration
		createButtonConfig(options: {
			text: string;
			size?: 'small' | 'medium' | 'large';
			style?: 'primary' | 'secondary' | 'accent';
		}): {
			width: number;
			height: number;
			text: string;
			backgroundColor: number;
			textColor: number;
			fontSize: number;
		} {
			const size = WebSDKIntegration.ui.buttonSizes[options.size ?? 'medium'];
			const colors = WebSDKIntegration.ui.colors;
			
			let backgroundColor: number;
			let textColor: number;
			
			switch (options.style) {
				case 'primary':
					backgroundColor = colors.primary;
					textColor = colors.text.primary;
					break;
				case 'secondary':
					backgroundColor = colors.secondary;
					textColor = colors.text.primary;
					break;
				case 'accent':
					backgroundColor = colors.accent;
					textColor = colors.text.primary;
					break;
				default:
					backgroundColor = colors.primary;
					textColor = colors.text.primary;
			}

			return {
				...size,
				text: options.text,
				backgroundColor,
				textColor,
				fontSize: WebSDKIntegration.ui.fonts.sizes.medium,
			};
		},

		// Apply consistent styling to containers
		styleContainer(container: any, style: 'panel' | 'popup' | 'overlay') {
			const colors = WebSDKIntegration.ui.colors;
			
			switch (style) {
				case 'panel':
					container.backgroundColor = colors.background.medium;
					break;
				case 'popup':
					container.backgroundColor = colors.background.dark;
					break;
				case 'overlay':
					container.backgroundColor = 0x000000;
					container.alpha = 0.7;
					break;
			}
		},
	};
}

// Create a singleton instance
export const webSDK = new WebSDKIntegration();

// Export utilities for easy access
export const { utils, userSettings: enhancedUserSettings } = WebSDKIntegration;
