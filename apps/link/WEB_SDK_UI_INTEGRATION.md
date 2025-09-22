# Web SDK UI Integration Guide

This guide explains how to use the Web SDK UI functionalities that have been integrated into your PixiJS project.

## What's Been Added

### 1. Workspace Package Dependencies

Added the following Web SDK packages to your `package.json`:

- `components-ui-pixi`: Advanced UI components for PixiJS (buttons, labels, layouts)
- `components-pixi`: Core PixiJS components (Amount, Button, FadeContainer, etc.)
- `components-layout`: Layout management utilities
- `state-shared`: State management utilities

### 2. Enhanced WebSDK Integration Layer

Extended `src/webSDKIntegration.ts` with comprehensive UI utilities:

#### UI Configuration

```typescript
import { WebSDKIntegration } from './webSDKIntegration';

// Access standardized button sizes
const buttonConfig = WebSDKIntegration.ui.buttonSizes.medium; // { width: 200, height: 80 }

// Use consistent color palette
const colors = WebSDKIntegration.ui.colors.primary; // 0x0f3460

// Apply standard spacing
const spacing = WebSDKIntegration.ui.spacing.md; // 16
```

#### Layout Helpers

```typescript
// Center content in viewport
WebSDKIntegration.layout.centerInViewport(myContainer);

// Position with safe margins
WebSDKIntegration.layout.positionWithMargins(myButton, {
	top: 20,
	right: 20,
});

// Create responsive grid
WebSDKIntegration.layout.createGrid(buttons, {
	columns: 3,
	spacing: 16,
});
```

#### Device and Responsive Design

```typescript
// Check device type
const isMobile = WebSDKIntegration.device.isMobile();
const deviceCategory = WebSDKIntegration.device.getDeviceCategory(); // 'mobile' | 'tablet' | 'desktop'

// Responsive scaling
const scaleFactor = WebSDKIntegration.getScaleFactor();
myContainer.scale.set(scaleFactor);

// Orientation detection
const isPortrait = WebSDKIntegration.isPortrait();
```

#### Integration Helpers

```typescript
// Create consistent button configurations
const buttonConfig = WebSDKIntegration.integration.createButtonConfig({
	text: 'Click Me',
	size: 'medium',
	style: 'primary',
});

// Apply consistent container styling
WebSDKIntegration.integration.styleContainer(myPanel, 'popup');
```

### 3. UI Demo Screen

Created `src/app/screens/WebSDKUIDemo.ts` demonstrating:

- Advanced button interactions
- Responsive design principles
- Web SDK utility usage
- Consistent styling patterns
- Animation integration

Access it via the "UI Demo" button on the main screen.

## How to Use the Web SDK Components

### Basic Button with Web SDK Styling

```typescript
import { Button } from '../ui/Button';
import { WebSDKIntegration } from '../../webSDKIntegration';

// Create button with Web SDK styling
const config = WebSDKIntegration.integration.createButtonConfig({
	text: 'My Button',
	size: 'large',
	style: 'accent',
});

const myButton = new Button({
	text: config.text,
	width: config.width,
	height: config.height,
	fontSize: config.fontSize,
});

// Apply color styling manually or extend Button class
```

### Responsive Layout

```typescript
export class MyScreen extends Container {
	public resize(width: number, height: number) {
		// Use Web SDK responsive helpers
		const scaleFactor = WebSDKIntegration.getScaleFactor();
		const isPortrait = WebSDKIntegration.isPortrait();

		// Apply responsive scaling
		this.mainContainer.scale.set(Math.max(0.5, scaleFactor));

		// Adjust layout based on orientation
		if (isPortrait) {
			// Stack elements vertically
			WebSDKIntegration.layout.createGrid(this.buttons, {
				columns: 1,
				spacing: WebSDKIntegration.ui.spacing.lg,
			});
		} else {
			// Arrange horizontally
			WebSDKIntegration.layout.createGrid(this.buttons, {
				columns: 3,
				spacing: WebSDKIntegration.ui.spacing.md,
			});
		}
	}
}
```

### Using Web SDK Utilities

```typescript
import { utils } from '../webSDKIntegration';

export class MyComponent extends Container {
	async animateIn() {
		// Use Web SDK timing utilities
		await utils.waitForTimeout(500);

		// Use Web SDK random utilities
		const randomDelay = utils.randomInteger({ min: 100, max: 500 });
		await utils.waitForTimeout(randomDelay);

		// Trigger animation
		animate(this, { alpha: 1 }, { duration: 0.3 });
	}
}
```

### Device-Specific Optimizations

```typescript
export class OptimizedScreen extends Container {
	constructor() {
		super();

		// Adjust quality based on device capabilities
		const shouldUseHighQuality = WebSDKIntegration.device.shouldUseHighQuality();
		const deviceCategory = WebSDKIntegration.device.getDeviceCategory();

		if (deviceCategory === 'mobile') {
			// Reduce particle count, lower texture resolution, etc.
			this.setupMobileOptimizations();
		} else if (shouldUseHighQuality) {
			// Enable premium effects, higher resolution assets, etc.
			this.setupHighQualityFeatures();
		}
	}
}
```

## Available Web SDK Packages

### components-ui-pixi

Game-specific UI components that are ready to use:

- `ButtonBet` - Betting interface button
- `ButtonAutoSpin` - Auto-spin functionality
- `ButtonDrawer` - Collapsible drawer interface
- `LabelBalance` - Balance display component
- `LabelWin` - Win amount display
- `LayoutDesktop/Tablet/Portrait` - Responsive layouts

### components-pixi

Core PixiJS components:

- `Button` - Advanced button component with Svelte integration
- `Amount` - Number display with formatting
- `FadeContainer` - Container with fade transitions
- `ResponsiveText` - Text that scales responsively
- `WinCountUpProvider` - Animated win counter

### components-layout

Layout management utilities for responsive design and container organization.

### state-shared

State management utilities that integrate with the UI components for data flow.

## Next Steps

1. **Explore the Demo**: Run the project and click "UI Demo" to see integration examples
2. **Check Package Sources**: Look at `packages/components-ui-pixi/src/components/` for more components
3. **Extend Integration**: Add more Web SDK utilities to `webSDKIntegration.ts` as needed
4. **Create Custom Components**: Use the patterns shown to create your own components
5. **Optimize for Performance**: Use device detection to adjust quality and features

## Benefits

- **Consistency**: Standardized styling and behavior across components
- **Responsiveness**: Built-in responsive design and device adaptation
- **Performance**: Device-aware optimizations and resource management
- **Maintainability**: Centralized configuration and utilities
- **Scalability**: Easy to extend and add new components

The integration provides a solid foundation for building professional-quality game UIs that work well across all devices and screen sizes.
