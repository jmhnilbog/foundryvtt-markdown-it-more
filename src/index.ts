// Get the sass related to the module.
import "./markdown.scss";

import EasyMDE from "easymde";
import { Editor } from "tinymce";

const log = (...rest) => console.log(`MKD_IT_MORE: `, { ...rest })

Hooks.once('init', async function () {
    log('init');
    TextEditor.create = async (options: TextEditor.Options, content: string) => {
        const editor = new EasyMDE({ ...options } as EasyMDE.Options);
        editor.value(content);

        return editor as unknown as Editor;
    }
});

Hooks.once('ready', async function () {
    log('ready')
});