# Link - PixiJS Creation Template + Web SDK Integration

A modern game development setup that combines the power of **PixiJS Creation Template** with the **Web SDK monorepo ecosystem**, giving you the best of both worlds for professional game development.

## 🎯 Purpose

This project demonstrates how to integrate a standalone PixiJS Creation Template into the Web SDK monorepo while preserving all the valuable features from both ecosystems. It's perfect for developers who want:

- **Professional PixiJS development tools** (AssetPack, Creation Engine, etc.)
- **Modern monorepo benefits** (shared utilities, configurations, tooling)
- **Flexibility** to use either approach based on project needs
- **Scalability** for complex game development workflows

## ✨ Benefits

### From PixiJS Creation Template

- 🚀 **Creation Engine** - Advanced game engine with built-in navigation, audio, and lifecycle management
- 📦 **AssetPack Integration** - Automatic asset optimization, sprite sheet generation, and manifest creation
- 📱 **Responsive Design** - Built-in viewport management and resize handling
- 🎵 **Audio System** - Integrated background music and sound effects management
- 🏗️ **Professional Architecture** - Screen-based navigation, popup system, and component organization
- ⚡ **Modern Tooling** - Latest PixiJS 8, TypeScript, Vite, and hot reload
- 🎨 **UI Components** - Pre-built buttons, animations, and interactive elements

### From Web SDK Monorepo

- 🔧 **Shared Utilities** - Access to battle-tested functions for timing, randomization, and more
- 📋 **Consistent Configs** - Unified ESLint, TypeScript, and build configurations
- 🏢 **Monorepo Benefits** - Shared dependencies, cross-package imports, and unified tooling
- 🧪 **Testing Infrastructure** - Storybook integration ready for component testing
- 🌐 **Deployment Pipeline** - Integration with existing Web SDK build and deployment processes
- 📚 **Knowledge Sharing** - Learn from other apps and components in the ecosystem

## 🏗️ Architecture

```
apps/link/
├── src/
│   ├── app/                    # Game screens, UI, and components
│   │   ├── screens/           # Screen-based navigation system
│   │   ├── popups/            # Modal popups and overlays
│   │   ├── ui/                # Reusable UI components
│   │   └── utils/             # App-specific utilities
│   ├── engine/                # Creation Engine with plugins
│   ├── main.ts                # Application entry point
│   └── webSDKIntegration.ts   # Bridge to Web SDK utilities
├── raw-assets/                # Source assets (processed by AssetPack)
├── public/                    # Static assets and generated sprites
├── scripts/                   # AssetPack configuration and build tools
└── package.json               # Hybrid dependencies from both ecosystems
```

## 🚦 Getting Started

### Prerequisites

- Node.js 22.16.0+ (recommended)
- pnpm 10.5.0+

### Development

```bash
# From the monorepo root
cd web-sdk
pnpm install

# Start development server
pnpm run dev --filter=link

# Access your app at http://localhost:3006
```

### Building

```bash
# Build for production
pnpm run build --filter=link
```

## 🛠️ Key Features

### Creation Engine

The app uses a sophisticated engine that provides:

- **Screen Management** - Navigate between different game screens
- **Audio Management** - Background music and sound effects
- **Popup System** - Modal dialogs and overlays
- **Resize Handling** - Automatic viewport adjustments
- **Asset Loading** - Efficient resource management

### AssetPack Integration

Automatic asset processing that:

- **Optimizes Images** - Compression and format conversion
- **Generates Sprites** - Automatic sprite sheet creation
- **Creates Manifests** - Asset loading configurations
- **Handles Multiple Formats** - Support for various image and audio formats

### Web SDK Utilities

Access to proven utilities:

```typescript
import { WebSDKIntegration, utils } from './webSDKIntegration';

// Random number generation
const randomValue = utils.randomInteger({ min: 1, max: 100 });

// Async timing utilities
await utils.waitForTimeout(1000);
await utils.waitForResolve(callback);

// Viewport and responsive design
const isPortrait = WebSDKIntegration.isPortrait();
const scaleFactor = WebSDKIntegration.getScaleFactor();
```

## 🎮 Example Usage

### Creating a New Screen

```typescript
import { Container } from 'pixi.js';
import { WebSDKIntegration, utils } from '../../../webSDKIntegration';

export class MyGameScreen extends Container {
	public static assetBundles = ['gameplay'];

	constructor() {
		super();
		this.setupGameplay();
	}

	private async setupGameplay() {
		// Use Web SDK utilities
		const randomSeed = utils.randomInteger({ min: 1, max: 1000 });

		// Access engine features
		const stage = WebSDKIntegration.getStage();

		// Your game logic here
	}

	public resize(width: number, height: number) {
		// Responsive design with Web SDK helpers
		const scaleFactor = WebSDKIntegration.getScaleFactor();
		this.scale.set(scaleFactor);
	}
}
```

### Using AssetPack

1. Add assets to `raw-assets/` folder
2. AssetPack automatically processes them during development
3. Access optimized assets in your code:

```typescript
// AssetPack generates optimized versions automatically
const texture = await Assets.load('my-sprite.png');
```

## 🔄 Integration Benefits

### Why This Hybrid Approach?

1. **Best of Both Worlds** - Get professional PixiJS tooling + monorepo benefits
2. **No Vendor Lock-in** - Can evolve toward pure Web SDK or pure PixiJS as needed
3. **Learning Path** - Gradual adoption of Web SDK patterns while keeping familiar PixiJS structure
4. **Team Flexibility** - Accommodate different developer preferences and skills
5. **Future-Proof** - Easy to migrate features between approaches

### When to Use This Setup

✅ **Perfect for:**

- Complex PixiJS games that need professional tooling
- Teams wanting to leverage existing Web SDK infrastructure
- Projects requiring both standalone and integrated development
- Learning and experimenting with different architectures

❌ **Consider alternatives for:**

- Simple games that don't need advanced asset processing
- Pure Web SDK projects following established patterns
- Projects with strict architectural requirements

## 🤝 Contributing

This setup demonstrates integration patterns that can be applied to other projects in the monorepo. Feel free to:

- Enhance the Web SDK integration layer
- Add more utility bridges between systems
- Share learnings with other app developers
- Contribute improvements back to both ecosystems

## 📚 Resources

- [PixiJS Creation Template Documentation](https://github.com/pixijs/create-pixi)
- [Web SDK Documentation](../../../README.md)
- [AssetPack Documentation](https://assetpack.org/)
- [PixiJS Documentation](https://pixijs.download/release/docs/index.html)

## 🎯 Next Steps

1. **Explore the Creation Engine** - Check out screen navigation and audio systems
2. **Experiment with AssetPack** - Add assets and see automatic optimization
3. **Use Web SDK Utilities** - Integrate more shared functions as needed
4. **Build Your Game** - Start developing with this powerful hybrid setup

---

_This project showcases how modern web development can benefit from combining specialized tools with monorepo architectures for maximum flexibility and power._
