
export const backgroundMusic = new Audio("../../assets/audio/bg_audio.mp3");

backgroundMusic.loop = true;        
backgroundMusic.volume = 0.5;       

export function playBackgroundMusic() {
  backgroundMusic.play().catch((err) => {
    console.warn("Background music failed to play:", err);
  });
}

export function stopBackgroundMusic() {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
}
