import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RxStompService } from '../init/rx-stomp.service';
import { JmsStatus } from '../model/jms-status';
import { JmsStatusMessage } from '../model/jms-status-message';
import { FilmService } from '../services/film.service';
import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-film-import',
    templateUrl: './film-import.component.html',
    styleUrls: ['./film-import.component.css'],
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule, MatIcon, MatButton, NgIf, MatProgressBar, NgFor, DecimalPipe]
})
export class FilmImportComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput', { static: true }) inputEl: ElementRef;
  
  buttonDisabled = false;
  loading = false;
  loadingStatus = false;
  time = 0;
  completedStatus: string = '';
  completedNumber: number = 0;
  errorOccured = false;
  
  messageHistory: JmsStatusMessage<any>[] = [];
  private topicSubscription: Subscription;
  readonly TOPIC = '/topic/*';

  constructor(private filmService: FilmService, private rxStompService: RxStompService) {}

  ngOnInit() {
    this.topicSubscription = this.rxStompService.watch(this.TOPIC).subscribe({
      next: (message: Message) => {
        const jmsMsg = JmsStatusMessage.fromJson(JSON.parse(message.body));
        this.parseJmsMessage(jmsMsg);
      },
      error: (e) => {
        this.errorOccured = true;
        console.error('WebSocket Error:', e);
      }
    });
  }

  ngOnDestroy() {
    if (this.topicSubscription) {
      this.topicSubscription.unsubscribe();
    }
  }

  private parseJmsMessage(jmsStatusMessage: JmsStatusMessage<any>) {
    const statusStr = JmsStatus[jmsStatusMessage.getStatus()].toString();

    // Logique de mise à jour de la liste de monitoring
    if (statusStr === JmsStatus.IMPORT_COMPLETED_SUCCESS.toString() || statusStr === JmsStatus.IMPORT_COMPLETED_ERROR.toString()) {
      this.buttonDisabled = false;
      this.loading = false;
      this.time = jmsStatusMessage.getTiming();
      this.completedStatus = (statusStr === JmsStatus.IMPORT_COMPLETED_SUCCESS.toString()) ? 'SUCCESS' : 'ERROR';
    } else {
      // On garde les 15 derniers messages pour la console
      this.messageHistory.unshift(jmsStatusMessage);
      if (this.messageHistory.length > 15) this.messageHistory.pop();

      if (statusStr === JmsStatus.DB_FILM_WRITER_COMPLETED.toString()) {
        this.completedNumber++;
      }
    }
  }

  importFilmList() {
    const fileBrowser = this.inputEl.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      this.loading = true;
      this.loadingStatus = true;
      this.completedNumber = 0;
      this.completedStatus = '';
      this.messageHistory = [];

      const formData = new FormData();
      formData.append('file', fileBrowser.files[0]);

      this.filmService.importFilmList(formData).subscribe({
        next: () => console.log("Upload démarré..."),
        error: (err) => {
          this.errorOccured = true;
          this.loading = false;
        }
      });
    }
  }
}