import Phaser from 'phaser';
import { AVAILABLE_MUSIC_TRACKS } from '../config/currencies';

export interface GameSettings {
  currency: 'BGN' | 'EUR';
  musicTrack: string;
}

export default class SettingsScene extends Phaser.Scene {
  private selectedCurrency: 'BGN' | 'EUR' = 'BGN';
  private selectedMusic: string = 'song1';
  
  private currencyButtons: Map<string, Phaser.GameObjects.Container> = new Map();
  private musicButtons: Map<string, Phaser.GameObjects.Container> = new Map();

  constructor() {
    super('SettingsScene');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background
    this.cameras.main.setBackgroundColor('#87CEEB');

    // Load saved settings
    this.loadSettings();

    // Title
    const title = this.add.text(width / 2, 60, 'Настройки', {
      fontSize: '32px',
      color: '#FFD700',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6
    });
    title.setOrigin(0.5);

    // Currency Selection Section
    this.add.text(width / 2, 140, 'Избери валута:', {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Currency buttons - 2 currencies side by side
    this.createCurrencyButton('BGN', 'ЛЕВ', width / 2 - 70, 190);
    this.createCurrencyButton('EUR', 'ЕВРО', width / 2 + 70, 190);

    // Music Selection Section
    this.add.text(width / 2, 280, 'Избери музика:', {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Dynamically create music buttons based on available tracks
    this.createDynamicMusicButtons(width, 330);

    // Back button - positioned higher to avoid Safari bottom bar
    // Safari's bottom bar is ~44px on iPhone, so we add extra padding
    const backButtonY = height - 100; // Changed from height - 60 to height - 100
    const backButton = this.add.rectangle(width / 2, backButtonY, 180, 50, 0x4CAF50)
      .setStrokeStyle(4, 0xFFFFFF)
      .setInteractive({ useHandCursor: true });

    const backText = this.add.text(width / 2, backButtonY, 'НАЗАД', {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    });
    backText.setOrigin(0.5);

    backButton.on('pointerover', () => {
      backButton.setFillStyle(0x45a049);
      backButton.setScale(1.05);
    });

    backButton.on('pointerout', () => {
      backButton.setFillStyle(0x4CAF50);
      backButton.setScale(1);
    });

    backButton.on('pointerdown', () => {
      backButton.setFillStyle(0x3d8b40);
    });

    backButton.on('pointerup', () => {
      backButton.setFillStyle(0x4CAF50);
      this.saveSettings();
      this.scene.start('MenuScene');
    });

    // Update initial selection visuals
    this.updateCurrencySelection();
    this.updateMusicSelection();
  }

  createDynamicMusicButtons(width: number, startY: number) {
    const tracks = AVAILABLE_MUSIC_TRACKS;
    const buttonsPerRow = 3;
    const spacingX = 110;
    const spacingY = 75;
    
    tracks.forEach((trackNum, index) => {
      const row = Math.floor(index / buttonsPerRow);
      const col = index % buttonsPerRow;
      
      // Center the buttons
      const offsetX = (buttonsPerRow - 1) * spacingX / 2;
      const x = width / 2 - offsetX + col * spacingX;
      const y = startY + row * spacingY;
      
      const songId = `song${trackNum}`;
      this.createMusicButton(songId, `♪ ${trackNum}`, x, y);
    });
  }

  createCurrencyButton(id: string, label: string, x: number, y: number) {
    const container = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 100, 70, 0x4a4a4a)
      .setStrokeStyle(3, 0xffffff);

    const text = this.add.text(0, 0, label, {
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold',
      align: 'center'
    });
    text.setOrigin(0.5);

    container.add([bg, text]);
    container.setSize(100, 70);
    container.setInteractive({ useHandCursor: true });

    container.on('pointerdown', () => {
      this.selectedCurrency = id as 'BGN' | 'EUR';
      this.updateCurrencySelection();
    });

    container.on('pointerover', () => {
      bg.setFillStyle(0x5a5a5a);
    });

    container.on('pointerout', () => {
      bg.setFillStyle(0x4a4a4a);
    });

    this.currencyButtons.set(id, container);
  }

  createMusicButton(id: string, label: string, x: number, y: number) {
    const container = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 90, 55, 0xFF6B35)
      .setStrokeStyle(3, 0xffffff);

    const text = this.add.text(0, 0, label, {
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    });
    text.setOrigin(0.5);

    container.add([bg, text]);
    container.setSize(90, 55);
    container.setInteractive({ useHandCursor: true });

    container.on('pointerdown', () => {
      this.selectedMusic = id;
      this.updateMusicSelection();
      
      // Stop all sounds to prevent any music from playing
      this.sound.stopAll();
    });

    container.on('pointerover', () => {
      bg.setFillStyle(0xFF8C55);
      container.setScale(1.1);
    });

    container.on('pointerout', () => {
      bg.setFillStyle(0xFF6B35);
      container.setScale(1);
    });

    this.musicButtons.set(id, container);
  }

  updateCurrencySelection() {
    this.currencyButtons.forEach((container, id) => {
      const bg = container.list[0] as Phaser.GameObjects.Rectangle;
      if (id === this.selectedCurrency) {
        bg.setFillStyle(0x4CAF50);
        bg.setStrokeStyle(4, 0xFFD700);
      } else {
        bg.setFillStyle(0x4a4a4a);
        bg.setStrokeStyle(3, 0xffffff);
      }
    });
  }

  updateMusicSelection() {
    this.musicButtons.forEach((container, id) => {
      const bg = container.list[0] as Phaser.GameObjects.Rectangle;
      const text = container.list[1] as Phaser.GameObjects.Text;
      if (id === this.selectedMusic) {
        bg.setFillStyle(0x4CAF50);
        bg.setStrokeStyle(4, 0xFFD700);
        text.setColor('#FFD700');
      } else {
        bg.setFillStyle(0xFF6B35);
        bg.setStrokeStyle(3, 0xffffff);
        text.setColor('#ffffff');
      }
    });
  }

  loadSettings() {
    const settings = localStorage.getItem('gameSettings');
    if (settings) {
      const parsed: GameSettings = JSON.parse(settings);
      this.selectedCurrency = parsed.currency || 'BGN';
      this.selectedMusic = parsed.musicTrack || 'song1';
    }
  }

  saveSettings() {
    const settings: GameSettings = {
      currency: this.selectedCurrency,
      musicTrack: this.selectedMusic
    };
    localStorage.setItem('gameSettings', JSON.stringify(settings));
    console.log('Настройките са запазени:', settings);
  }
}
