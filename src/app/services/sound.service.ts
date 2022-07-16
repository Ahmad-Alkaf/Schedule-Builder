import { Injectable, OnInit } from '@angular/core';
export type AvailableAudio = 'notification' | 'error';
@Injectable({
  providedIn: 'root'
})
export class SoundService implements OnInit {
  private readonly notification = new Audio('../assets/sound/Windows Background.wav');
  private readonly error = new Audio('../assets/sound/Windows Critical Stop.wav');
  constructor() { }
  ngOnInit(): void {
    this.notification.load();
    this.error.volume = 0;
    this.error.load()
  }
  /**
   * better than audioELement.play()
   * because if sound is playing then it won't play. but this function will play the sound again even if it is not finished
   */
  play(ava: AvailableAudio) {
    var audio;
    switch (ava) {
      case 'error': audio = this.error; break;
      case 'notification': audio = this.notification; break;
      default: return;
    }
    audio.currentTime = 0;
    audio.play();
  }

}
