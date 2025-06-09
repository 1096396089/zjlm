// 使用Web Audio API创建温柔的背景音乐
class BackgroundMusicGenerator {
  constructor() {
    this.audioContext = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.currentMelodyTimeout = null;
  }

  async init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.1; // 音量设置为较低
      return true;
    } catch (error) {
      console.error('音频上下文初始化失败:', error);
      return false;
    }
  }

  // 创建音符
  createNote(frequency, duration, delay = 0, volume = 0.1) {
    if (!this.audioContext) return;

    setTimeout(() => {
      if (!this.isPlaying) return;

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();

      // 设置滤波器让声音更柔和
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      filter.Q.value = 1;

      // 连接音频节点
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.masterGain);

      // 设置振荡器
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = 'sine'; // 使用正弦波，声音更柔和

      // 设置音量包络
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

      // 播放音符
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    }, delay);
  }

  // 温柔的和弦
  playChord(frequencies, duration, delay = 0) {
    frequencies.forEach((freq, index) => {
      this.createNote(freq, duration, delay + index * 10, 0.05); // 每个音符略微错开
    });
  }

  // 播放主旋律
  playMelody() {
    if (!this.isPlaying) return;

    // C大调的温柔旋律
    const notes = {
      C4: 261.63,
      D4: 293.66,
      E4: 329.63,
      F4: 349.23,
      G4: 392.00,
      A4: 440.00,
      B4: 493.88,
      C5: 523.25,
      D5: 587.33,
      E5: 659.25
    };

    // 温柔的旋律序列
    const melody = [
      { note: 'C4', duration: 2 },
      { note: 'E4', duration: 1.5 },
      { note: 'G4', duration: 1.5 },
      { note: 'C5', duration: 2 },
      { note: 'B4', duration: 1.5 },
      { note: 'A4', duration: 1.5 },
      { note: 'G4', duration: 2 },
      { note: 'F4', duration: 1.5 },
      { note: 'E4', duration: 1.5 },
      { note: 'D4', duration: 2 },
      { note: 'C4', duration: 3 }
    ];

    let currentTime = 0;
    
    melody.forEach((item, index) => {
      this.createNote(notes[item.note], item.duration, currentTime * 1000);
      currentTime += item.duration + 0.5; // 音符间隔
    });

    // 添加和弦背景
    const chords = [
      [notes.C4, notes.E4, notes.G4], // C大调
      [notes.F4, notes.A4, notes.C5], // F大调
      [notes.G4, notes.B4, notes.D5], // G大调
      [notes.C4, notes.E4, notes.G4]  // 回到C大调
    ];

    chords.forEach((chord, index) => {
      this.playChord(chord, 4, index * 4000);
    });

    // 循环播放
    this.currentMelodyTimeout = setTimeout(() => {
      if (this.isPlaying) {
        this.playMelody();
      }
    }, currentTime * 1000 + 2000); // 旋律结束后稍等再循环
  }

  // 开始播放
  async start() {
    if (!this.audioContext) {
      const initSuccess = await this.init();
      if (!initSuccess) return false;
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    this.isPlaying = true;
    this.playMelody();
    return true;
  }

  // 停止播放
  stop() {
    this.isPlaying = false;
    if (this.currentMelodyTimeout) {
      clearTimeout(this.currentMelodyTimeout);
      this.currentMelodyTimeout = null;
    }
  }

  // 设置音量
  setVolume(volume) {
    if (this.masterGain) {
      this.masterGain.gain.value = volume;
    }
  }
}

// 导出为全局变量供Vue组件使用
window.BackgroundMusicGenerator = BackgroundMusicGenerator; 