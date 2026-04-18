/**
 * Utility to play standard UI feedback sounds.
 */
export const playSound = (type = 'success') => {
  const sounds = {
    success: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
    error: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
    notification: 'https://assets.mixkit.co/active_storage/sfx/2357/2357-preview.mp3'
  };

  const audio = new Audio(sounds[type] || sounds.success);
  audio.play().catch(err => console.debug('Sound play blocked by browser:', err));
};
