import { WebSDKIntegration, utils } from '../../../webSDKIntegration';
import { Container, Text } from 'pixi.js';

/**
 * Example component showing how to use Web SDK utilities in your PixiJS template
 */
export class WebSDKExample extends Container {
	private infoText: Text;

	constructor() {
		super();

		// Create a text display
		this.infoText = new Text({
			text: 'Web SDK Integration Example',
			style: {
				fontFamily: 'Arial',
				fontSize: 24,
				fill: 0xffffff,
				align: 'center',
			},
		});
		this.infoText.anchor.set(0.5);
		this.addChild(this.infoText);

		// Example of using Web SDK utilities
		this.demoWebSDKFeatures();
	}

	private async demoWebSDKFeatures() {
		// Example 1: Using randomInteger from Web SDK
		const randomNumber = utils.randomInteger({ min: 1, max: 100 });
		console.log('Random number from Web SDK:', randomNumber);

		// Example 2: Using wait utilities
		await utils.waitForTimeout(1000);
		this.infoText.text = `Random: ${randomNumber}`;

		// Example 3: Getting viewport info
		const viewportSize = WebSDKIntegration.getViewportSize();
		console.log('Viewport size:', viewportSize);

		// Example 4: Responsive design
		const isPortrait = WebSDKIntegration.isPortrait();
		const scaleFactor = WebSDKIntegration.getScaleFactor();
		console.log('Is portrait:', isPortrait, 'Scale factor:', scaleFactor);

		// Example 5: Access to the engine
		const stage = WebSDKIntegration.getStage();
		console.log('Stage children count:', stage?.children.length);
	}

	public resize(width: number, height: number) {
		// Center the text
		this.x = width * 0.5;
		this.y = height * 0.3;

		// Example of responsive scaling using Web SDK
		const scaleFactor = WebSDKIntegration.getScaleFactor();
		this.scale.set(scaleFactor);
	}
}
