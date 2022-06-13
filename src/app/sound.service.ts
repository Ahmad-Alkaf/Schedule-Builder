import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService implements OnInit{
  readonly notification = new Audio('../assets/sound/Windows Background.wav');
  readonly error = new Audio('../assets/sound/Windows Critical Stop.wav');
  constructor() { }
  ngOnInit(): void {
    this.notification.load();
    // this.error.load();
    this.error.volume = 0;
    this.error.load()
  }
  /**
   * better than audioELement.play()
   * because if sound is playing then it won't play. but this function will play the sound again even if it is not finished
   */
  play(audio:HTMLAudioElement) {
    audio.currentTime = 0;
    audio.play()
  }
  
}
