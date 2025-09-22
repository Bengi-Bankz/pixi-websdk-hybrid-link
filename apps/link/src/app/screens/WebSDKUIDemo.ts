import { Container, Text, Graphics } from "pixi.js";
import { animate } from "motion";
import { FancyButton } from "@pixi/ui";

import { engine } from "../getEngine";
import { Button } from "../ui/Button";
import { Label } from "../ui/Label";
import { RoundedBox } from "../ui/RoundedBox";
import { WebSDKIntegration, utils } from "../../webSDKIntegration";

/**
 * Demo screen showcasing Web SDK UI functionalities integrated with PixiJS
 * This demonstrates how to use advanced UI components and utilities from the Web SDK packages
 */
export class WebSDKUIDemo extends Container {
  /** Assets bundles required by this screen */
  public static assetBundles = ["main"];

  private mainContainer: Container;
  private backButton: FancyButton;
  private demoContainer: Container;
  private title: Label;
  private infoPanel: RoundedBox;
  private counterDisplay: Label;
  private counter = 0;

  // Demo UI components
  private incrementButton: Button;
  private decrementButton: Button;
  private randomizeButton: Button;
  private animateButton: Button;

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
      text: "Web SDK UI Demo",
      style: {
        fontSize: 48,
        fill: 0xffffff,
        fontWeight: "bold",
      },
    });
    this.title.y = -250;
    this.demoContainer.addChild(this.title);

    // Info panel background
    this.infoPanel = new RoundedBox({
      width: 600,
      height: 400,
      color: 0x1a1a2e,
      shadow: true,
      shadowColor: 0x16213e,
      shadowOffset: 10,
    });
    this.demoContainer.addChild(this.infoPanel);

    // Counter display
    this.counterDisplay = new Label({
      text: `Counter: ${this.counter}`,
      style: {
        fontSize: 32,
        fill: 0x0f3460,
        fontWeight: "bold",
      },
    });
    this.counterDisplay.y = -120;
    this.demoContainer.addChild(this.counterDisplay);

    // Increment button
    this.incrementButton = new Button({
      text: "+1",
      width: 120,
      height: 80,
      fontSize: 24,
    });
    this.incrementButton.x = -140;
    this.incrementButton.y = -40;
    this.demoContainer.addChild(this.incrementButton);

    // Decrement button
    this.decrementButton = new Button({
      text: "-1",
      width: 120,
      height: 80,
      fontSize: 24,
    });
    this.decrementButton.x = 140;
    this.decrementButton.y = -40;
    this.demoContainer.addChild(this.decrementButton);

    // Randomize button (demonstrates Web SDK utilities)
    this.randomizeButton = new Button({
      text: "Random",
      width: 150,
      height: 80,
      fontSize: 20,
    });
    this.randomizeButton.x = -100;
    this.randomizeButton.y = 60;
    this.demoContainer.addChild(this.randomizeButton);

    // Animate button
    this.animateButton = new Button({
      text: "Animate",
      width: 150,
      height: 80,
      fontSize: 20,
    });
    this.animateButton.x = 100;
    this.animateButton.y = 60;
    this.demoContainer.addChild(this.animateButton);

    // Back button
    this.backButton = new FancyButton({
      defaultView: "rounded-rectangle.png",
      text: new Label({
        text: "← Back",
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
      text: "Responsive: Loading...",
      style: {
        fontSize: 18,
        fill: 0x00ff88,
        fontStyle: "italic",
      },
    });
    this.responsiveContainer.addChild(this.responsiveText);

    this.updateResponsiveInfo();
  }

  private setupInteractions() {
    // Increment counter
    this.incrementButton.onPress.connect(() => {
      this.counter++;
      this.updateCounter();
      this.playButtonFeedback();
    });

    // Decrement counter
    this.decrementButton.onPress.connect(() => {
      this.counter--;
      this.updateCounter();
      this.playButtonFeedback();
    });

    // Randomize using Web SDK utilities
    this.randomizeButton.onPress.connect(async () => {
      // Use Web SDK random utilities
      const randomValue = utils.randomInteger({ min: -50, max: 50 });
      this.counter = randomValue;
      
      // Show loading effect
      this.counterDisplay.text = "Generating...";
      
      // Use Web SDK timing utilities
      await utils.waitForTimeout(500);
      
      this.updateCounter();
      this.playButtonFeedback();
    });

    // Animate button
    this.animateButton.onPress.connect(() => {
      this.performAnimation();
      this.playButtonFeedback();
    });

    // Back button
    this.backButton.onPress.connect(() => {
      // Import MainScreen dynamically to avoid circular dependency
      import("./main/MainScreen").then(({ MainScreen }) => {
        engine().navigation.showScreen(MainScreen);
      });
    });
  }

  private updateCounter() {
    this.counterDisplay.text = `Counter: ${this.counter}`;
    
    // Add color feedback based on value
    if (this.counter > 0) {
      this.counterDisplay.style.fill = 0x00ff88; // Green
    } else if (this.counter < 0) {
      this.counterDisplay.style.fill = 0xff4444; // Red
    } else {
      this.counterDisplay.style.fill = 0x0f3460; // Blue
    }
    
    // Small bounce animation
    animate(this.counterDisplay.scale, { x: 1.2, y: 1.2 }, { duration: 0.1 })
      .then(() => animate(this.counterDisplay.scale, { x: 1, y: 1 }, { duration: 0.1 }));
  }

  private async performAnimation() {
    // Demonstrate various animations
    const originalY = this.infoPanel.y;
    
    // Bounce animation
    await animate(this.infoPanel, { y: originalY - 20 }, { duration: 0.2, ease: "backOut" });
    await animate(this.infoPanel, { y: originalY }, { duration: 0.3, ease: "bounceOut" });
    
    // Color cycle animation
    const colors = [0x1a1a2e, 0x2a1a4e, 0x4a1a2e, 0x1a4a2e, 0x1a1a2e];
    for (const color of colors) {
      this.infoPanel.image.tint = color;
      await utils.waitForTimeout(100);
    }
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
    engine().audio.sfx.play("main/sounds/sfx-press.wav", { volume: 0.7 });
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
    // Fade in animation
    this.alpha = 0;
    await animate(this, { alpha: 1 }, { duration: 0.5, ease: "easeOut" });

    // Stagger animations for components
    const components = [
      this.title,
      this.infoPanel,
      this.counterDisplay,
      this.incrementButton,
      this.decrementButton,
      this.randomizeButton,
      this.animateButton,
    ];

    for (let i = 0; i < components.length; i++) {
      const component = components[i];
      component.alpha = 0;
      component.scale.set(0.8);
      
      animate(component, { alpha: 1 }, { duration: 0.3, delay: i * 0.1 });
      animate(component.scale, { x: 1, y: 1 }, { 
        duration: 0.4, 
        delay: i * 0.1, 
        ease: "backOut" 
      });
    }
  }

  /** Hide screen with animations */
  public async hide() {
    await animate(this, { alpha: 0 }, { duration: 0.3, ease: "easeIn" });
  }
}