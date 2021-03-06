import { Component, OnInit,  NgZone, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})
export class GoalsComponent implements OnInit {
  files = [];
  final_files = [];
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  constructor(private fb: FormBuilder, private _ngZone: NgZone, private slider: HomeService) { }
  goalsForm = this.fb.group({
    header: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    sub_header: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    text_content:['', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]],
    files: ['', [Validators.required]]
  });

  public onChange( { editor }: ChangeEvent ) {
      const data = editor.getData();
      console.log( data );
  }

  ngOnInit(): void {
  }
  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }
  uploadFile(event) {
    console.log('events', event);
    if(event.length <=1){
      for (let index = 0; index < event.length; index++) {
        const element = event[index];
        this.files.push(element.name); 
        this.final_files.push(event[index]);
      }
    }
  }
  deleteAttachment(index) {
    this.files.splice(index, 1);
    this.final_files.splice(index, 1)
    if(!this.files.length) {
      this.goalsForm.get('files').setValue('');
    }
  }

  savegoalSLider() {
    const formData = new FormData();
    //console.log(this.final_files);
    //let images = [];
    for(let i=0; i< this.final_files.length; i++) {
      formData.append(`images`, this.final_files[i]);
    }
    //formData.append(`images`, JSON.stringify(this.final_files));
    formData.append('header', this.goalsForm.get('header').value);
    formData.append('sub_header', this.goalsForm.get('sub_header').value);
    formData.append('text_content', this.goalsForm.get('text_content').value);
    console.log(this.goalsForm.value);
    this.slider.goalSlider(formData).subscribe( res =>{
      console.log(res);
    });
  }
}
