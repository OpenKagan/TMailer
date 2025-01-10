import {
    ClassicEditor,
    Alignment,
    Autoformat,
    AutoImage,
    Autosave,
    BalloonToolbar,
    Bold,
    Essentials,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    GeneralHtmlSupport,
    HorizontalLine,
    ImageBlock,
    ImageCaption,
    ImageInline,
    ImageInsert,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    MediaEmbed,
    Paragraph,
    PasteFromOffice,
    SelectAll,
    ShowBlocks,
    SpecialCharacters,
    SpecialCharactersArrows,
    SpecialCharactersCurrency,
    SpecialCharactersEssentials,
    SpecialCharactersLatin,
    SpecialCharactersMathematical,
    SpecialCharactersText,
    Strikethrough,
    Subscript,
    Superscript,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextTransformation,
    TodoList,
    Underline,
    Undo
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

export {
    Editor
};

function Editor(element) {
    return ClassicEditor.create(element, getDefaultEditorConfig());
}

function getDefaultEditorConfig() {
    const presetColorOptions = [
        {
            color: '#000000',
            label: 'Black'
        },
        {
            color: '#4d4d4d',
            label: 'Dim grey'
        },
        {
            color: '#999999',
            label: 'Grey'
        },
        {
            color: '#E6E6E6',
            label: 'Light grey'
        },
        {
            color: '#FFFFFF',
            label: 'White',
            hasBorder: true
        },
        {
            color: '#E64C4C',
            label: 'Red'
        },
        {
            color: '#E6994C',
            label: 'Orange'
        },
        {
            color: '#E6E64C',
            label: 'Yellow'
        },
        {
            color: '#99E64C',
            label: 'Light green'
        },
        {
            color: '#4CE64C',
            label: 'Green'
        },
        {
            color: '#4CE699',
            label: 'Aquamarine'
        },
        {
            color: '#4CE6E6',
            label: 'Turquoise'
        },
        {
            color: '#4C99E6',
            label: 'Light blue'
        },
        {
            color: '#4C4CE6',
            label: 'Blue'
        },
        {
            color: '#994CE6',
            label: 'Purple'
        }
    ];

    return {
        toolbar: {
            items: [
                'undo',
                'redo',
                '|',
                'showBlocks',
                'selectAll',
                '|',
                'fontSize',
                'fontFamily',
                'fontColor',
                'fontBackgroundColor',
                '|',
                'bold',
                'italic',
                'underline',
                'strikethrough',
                'subscript',
                'superscript',
                '|',
                'specialCharacters',
                'horizontalLine',
                'link',
                'insertImage',
                'mediaEmbed',
                'insertTable',
                '|',
                'alignment',
                '|',
                'bulletedList',
                'numberedList',
                'todoList',
                'outdent',
                'indent'
            ],
            shouldNotGroupWhenFull: true
        },
        plugins: [
            Alignment,
            Autoformat,
            AutoImage,
            Autosave,
            BalloonToolbar,
            Bold,
            Essentials,
            FontBackgroundColor,
            FontColor,
            FontFamily,
            FontSize,
            GeneralHtmlSupport,
            HorizontalLine,
            ImageBlock,
            ImageCaption,
            ImageInline,
            ImageInsert,
            ImageInsertViaUrl,
            ImageResize,
            ImageStyle,
            ImageTextAlternative,
            ImageToolbar,
            ImageUpload,
            Indent,
            IndentBlock,
            Italic,
            Link,
            LinkImage,
            List,
            ListProperties,
            MediaEmbed,
            Paragraph,
            PasteFromOffice,
            SelectAll,
            ShowBlocks,
            SpecialCharacters,
            SpecialCharactersArrows,
            SpecialCharactersCurrency,
            SpecialCharactersEssentials,
            SpecialCharactersLatin,
            SpecialCharactersMathematical,
            SpecialCharactersText,
            Strikethrough,
            Subscript,
            Superscript,
            Table,
            TableCaption,
            TableCellProperties,
            TableColumnResize,
            TableProperties,
            TableToolbar,
            TextTransformation,
            TodoList,
            Underline,
            Undo
        ],
        balloonToolbar: ['bold', 'italic', 'underline', '|', 'link', '|', 'fontColor', 'fontBackgroundColor'],
        fontFamily: {
            supportAllValues: true
        },
        fontSize: {
            options: [10, 12, 14, 'default', 18, 20, 22],
            supportAllValues: true
        },
        fontColor: {
            colors: presetColorOptions,
            colorPicker: {
                format: 'hex'
            }
        },
        fontBackgroundColor: {
            colors: presetColorOptions,
            colorPicker: {
                format: 'hex'
            }
        },
        htmlSupport: {
            allow: [
                {
                    name: /^.*$/,
                    styles: true,
                    attributes: true,
                    classes: true
                }
            ]
        },
        image: {
            toolbar: [
                'toggleImageCaption',
                'imageTextAlternative',
                '|',
                'imageStyle:inline',
                'imageStyle:wrapText',
                'imageStyle:breakText',
                '|',
                'resizeImage'
            ]
        },
        link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
            decorators: {
                toggleDownloadable: {
                    mode: 'manual',
                    label: 'Downloadable',
                    attributes: {
                        download: 'file'
                    }
                }
            }
        },
        list: {
            properties: {
                styles: true,
                startIndex: true,
                reversed: true
            }
        },
        placeholder: '',
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
        }
    };
}
