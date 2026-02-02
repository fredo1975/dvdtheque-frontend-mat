import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RxStompService } from '../init/rx-stomp.service';
import { JmsStatus } from '../model/jms-status';
import { JmsStatusMessage } from '../model/jms-status-message';
import { FilmService } from '../services/film.service';
import { Message } from '@stomp/stompjs';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-film-import',
  templateUrl: './film-import.component.html',
  styleUrls: ['./film-import.component.css']
})
export class FilmImportComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput', { static: true }) inputEl: ElementRef
  buttonDisabled = false
  loading = false
  loadingStatus = false
  time = 0
  formdata: FormData
  // @ts-ignore, to suppress warning related to being undefined
  private topicSubscription: Subscription;
  TOPIC = '/topic/*'
  messageHistory: JmsStatusMessage<any>[] = []
  receivedMessages: Message[] = []
  form: FormGroup
  errorOccured: boolean;
  displayedColumns: string[] = ['status'];
  completedStatus: string;
  completedNumber: number = 0;
  dataSource = new MatTableDataSource(this.messageHistory);
  constructor(private filmService: FilmService, private rxStompService: RxStompService) {
    //this.messageHistory = [];
  }
  ngOnInit() {
    //console.log(this.rxStompService)
    this.topicSubscription = this.rxStompService.watch(this.TOPIC).subscribe({

      next: (message: Message) => {
        //console.log('message', message)
        const jmsStatusMessage: JmsStatusMessage<any> = JmsStatusMessage.fromJson(JSON.parse(message.body))
        this.parseJmsMessage(jmsStatusMessage);
        
      },
      error: (e) => {
        this.errorOccured = true;
        this.loading = false;
        console.error(e);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  ngOnDestroy() {
    this.topicSubscription.unsubscribe()
  }

  private parseJmsMessage(jmsStatusMessage: JmsStatusMessage<any>){
    //console.log('jmsStatusMessage', jmsStatusMessage)

    if (JmsStatus[jmsStatusMessage.getStatus()].toString() === JmsStatus.FILE_ITEM_READER_COMPLETED.toString()) {
      this.messageHistory.splice(1, 1);
      this.messageHistory.splice(1, 0, jmsStatusMessage);
    } else if (JmsStatus[jmsStatusMessage.getStatus()].toString() === JmsStatus.FILM_CSV_LINE_MAPPER_COMPLETED.toString()) {
      this.messageHistory.splice(2, 1);
      this.messageHistory.splice(2, 0, jmsStatusMessage);
      // tslint:disable-next-line:max-line-length
    } else if (JmsStatus[jmsStatusMessage.getStatus()].toString() === JmsStatus.IMPORT_COMPLETED_SUCCESS.toString() || JmsStatus[jmsStatusMessage.getStatus()].toString() === JmsStatus.IMPORT_COMPLETED_ERROR.toString()) {
      //console.log('subscribeTopic end', JSON.parse(message.body));
      this.buttonDisabled = false;
      this.loading = false;
      this.time = jmsStatusMessage.getTiming();
      // this.messageHistory.unshift(jmsStatusMessage);
      if (JmsStatus[jmsStatusMessage.getStatus()].toString() === JmsStatus.IMPORT_COMPLETED_SUCCESS.toString()) {
        this.completedStatus = 'OK';
      } else {
        this.completedStatus = 'KO';
      }
    } else if (JmsStatus[jmsStatusMessage.getStatus()].toString() === JmsStatus.IMPORT_INIT.toString()) {
      /*this.messageHistory = [];
      this.messageHistory.unshift(jmsStatusMessage);*/
    } else {
      if (jmsStatusMessage.getStatusValue() === 1) {
        this.messageHistory.shift();
      }
      this.messageHistory.unshift(jmsStatusMessage);
      if(JmsStatus[jmsStatusMessage.getStatus()].toString() === JmsStatus.DB_FILM_WRITER_COMPLETED.toString()){
        this.completedNumber++
      }
    }
  }
  loadFile() {
    // console.log('loadFile event', event);
    const inputEl: HTMLInputElement = this.inputEl.nativeElement
    // @ts-ignore, to suppress warning related to being undefined
    const fileCount: number = inputEl.files.length
    if (fileCount === 1) {
      this.formdata = new FormData()
      // @ts-ignore, to suppress warning related to being undefined
      this.formdata.append('file', inputEl.files.item(0))
    }
  }


  importFilmList() {
    const fileBrowser = this.inputEl.nativeElement;

    if (fileBrowser.files && fileBrowser.files[0]) {
      this.loading = true;
      this.loadingStatus = true;

      // 1. Create FormData locally
      const formData = new FormData();

      // 2. Append the file (ensure key 'file' matches Backend @RequestPart)
      formData.append('file', fileBrowser.files[0]);

      // 3. Send THIS specific instance
      this.filmService.importFilmList(formData).subscribe({
        next: (data) => {
          console.log("Upload successful", data);
        },
        error: (err) => {
          console.error("Upload failed", err);
          this.loading = false;
        }
      });
    }
  }
}
