// Компонент richText
import React, { useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {Spin} from "antd";

import "./richText.css";

export default function RichTextComponent({value, onChange}) {
    const [loading, setLoading] = useState(true);
    const editorRef = useRef(null);
    
    return (
        <>
            {
                loading && <div className="spinner"><Spin size="large" /></div>
            }
            <Editor
                apiKey="35k64jju1g8typeu4r9de9ohcwob28g99idslkr1zik224ww"
                onInit={(_, editor) => {
                    setLoading(false);
                    editorRef.current = editor;
                }}
                initialValue={value}
                scriptLoading={{ async: true }}
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
                    content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    language: "ru"
                }}
            />
        </>
    );
}