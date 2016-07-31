import {Component, Output, Input, EventEmitter, OnChanges, SimpleChange, ElementRef} from '@angular/core';

declare var $;

require('!style!css!summernote/dist/bs4/summernote.css');
require('summernote/dist/bs4/summernote');

@Component({
    selector: 'wysiwyg',
    styles: [require('./edit-message.component.scss')],
    template: `<div></div>`
}) export class WysiwygComponent implements OnChanges {
    $summernoteDom;
    $editArea;

    cursorElement:Element;
    cursorPosition:number;

    @Input() editorHeight: number;
    @Input() content: string = '';

    @Output() public onKeyDown = new EventEmitter();
    @Output() public onClick = new EventEmitter();
    @Output() public onKeyUp = new EventEmitter();
    @Output() public onChange = new EventEmitter();

    constructor(private _elementRef:ElementRef) { }

    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
        let contentChange = changes['content'];

        if(contentChange) {
            this.setRawHtml(contentChange.currentValue);
        }
    }

    ngAfterViewInit() {
        let self = this;
        this.$editArea = $('.note-editable');
        this.$summernoteDom = $(this._elementRef.nativeElement);
        this.$summernoteDom.summernote({
            disableResizeEditor: false,
            disableDragAndDrop: true,
            height: this.editorHeight || 425,
            fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Georgia', 'Tahoma', 'Geneva', 'Helvetica', 
                        'Impact','Courier New', 'Monaco', 'Charcoal', 'Lucida Console', 'Lucida Grande', 'Palatino Linotype', 
                        'Book Antiqua', 'Palatino', 'Merriweather', 'Times New Roman', 'Verdana'],
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontname', ['fontname']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']]
            ]
        });

        this.$summernoteDom.on('summernote.keyup', (we, e) => {
            this.$summernoteDom.summernote('editor.saveRange');
            this.onKeyUp.emit(this.getRawHtml());
        });

        this.$summernoteDom.on('summernote.change', (we, contents) => {
            this.onChange.emit(contents);
        });

        this.$summernoteDom.on('summernote.keydown', (we, contents) => {
            this.onKeyDown.emit(contents);
        });

        document
            .querySelector('.note-editor')
            .addEventListener('click', () => {
                this.$summernoteDom.summernote('editor.saveRange');
            });
              
        this.setRawHtml(this.content);
    }

    getRawHtml() {
        return this.$summernoteDom.summernote('code');
    }

    setRawHtml(code) {
        if(this.$summernoteDom && code) {
            this.$summernoteDom.summernote('code', code);
        }
    }

    updateContent() {
        this.$summernoteDom.summernote('code', '');
        this.$summernoteDom.summernote('code', this.content);
    }

    insertAtCurrentLocation(value) {
        this.$summernoteDom.summernote('editor.restoreRange');
        this.$summernoteDom.summernote('editor.focus');
        this.$summernoteDom.summernote('editor.insertText', value);
    }

    clearContents() {
        this.$summernoteDom.summernote('reset');
    }

    setFocus() {
        let editableArea:any = document.querySelector('.note-editable');
        editableArea.focus();
    }
}
