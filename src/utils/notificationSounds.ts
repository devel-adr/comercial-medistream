
// Simple sound generation for different notification types
let currentAudio: AudioContext | null = null;
let isPlaying = false;
let playStartTime = 0;

export const generateTone = (frequency: number, duration: number, volume: number = 0.5) => {
  // Stop any currently playing audio
  if (currentAudio) {
    try {
      currentAudio.close();
    } catch (e) {
      // Context might already be closed
    }
  }

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  currentAudio = audioContext;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
  
  return new Promise(resolve => {
    oscillator.onended = () => {
      try {
        audioContext.close();
      } catch (e) {
        // Context might already be closed
      }
      currentAudio = null;
      resolve(undefined);
    };
  });
};

export const playNotificationSound = async (soundType: string, volume: number) => {
  const now = Date.now();
  
  // Prevent multiple simultaneous sound playbacks with stricter timing
  if (isPlaying && (now - playStartTime) < 3000) {
    console.log('Sound already playing or played recently, skipping...');
    return;
  }

  isPlaying = true;
  playStartTime = now;
  console.log('Playing notification sound:', soundType, 'with volume:', volume);
  
  try {
    switch (soundType) {
      case 'chime':
        // Play a chime-like sequence
        await generateTone(523.25, 0.2, volume); // C5
        await new Promise(resolve => setTimeout(resolve, 50));
        await generateTone(659.25, 0.2, volume); // E5
        await new Promise(resolve => setTimeout(resolve, 50));
        await generateTone(783.99, 0.3, volume); // G5
        break;
        
      case 'ding':
        // Play a single ding
        await generateTone(800, 0.5, volume);
        break;
        
      case 'notification':
        // Play a notification beep sequence
        await generateTone(440, 0.1, volume); // A4
        await new Promise(resolve => setTimeout(resolve, 100));
        await generateTone(440, 0.1, volume); // A4
        break;
        
      default:
        // Default sound - simple beep
        await generateTone(600, 0.3, volume);
        break;
    }
  } catch (error) {
    console.error('Error playing notification sound:', error);
  } finally {
    // Reset flag after a longer delay to ensure sounds don't overlap
    setTimeout(() => {
      isPlaying = false;
    }, 1500);
  }
};
