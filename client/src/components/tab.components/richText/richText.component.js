// Компонент richText
import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function RichTextComponent({value, onChange}) {
    const editorRef = useRef(null);
    
    return (
        <>
            <Editor
                apiKey={null}
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={value}
                onEditorChange={newText => onChange(newText)}
                init={{
                    height: 500,
                    menubar: false,
                    selector: '#editor',
                    plugins: [
                        'advlist autolink lists link charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste image code wordcount'
                    ],
                    toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code',
                    image_title: true,
                    content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
                }}
            />
        </>
    );
}