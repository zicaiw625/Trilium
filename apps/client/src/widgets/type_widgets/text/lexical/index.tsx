import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import { useEffect } from 'preact/hooks';

import { useEditorSpacedUpdate } from '../../../react/hooks';
import { TypeWidgetProps } from "../../type_widget";

const theme = {
    // Theme styling goes here
    //...
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error) {
    console.error(error);
}

export default function LexicalText(props: TypeWidgetProps) {
    const initialConfig = {
        namespace: 'MyEditor',
        theme,
        onError,
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <RichTextPlugin
                contentEditable={
                    <ContentEditable
                        aria-placeholder={'Enter some text...'}
                        placeholder={<div>Enter some text...</div>}
                    />
                }
                ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <CustomEditorPersistencePlugin {...props} />
        </LexicalComposer>
    );
}

function CustomEditorPersistencePlugin({ note, noteContext }: TypeWidgetProps) {
    const [editor] = useLexicalComposerContext();
    const spacedUpdate = useEditorSpacedUpdate({
        note,
        noteContext,
        noteType: "text",
        getData() {
            return {
                content: JSON.stringify(editor.toJSON())
            };
        },
        onContentChange(newContent) {

        },
    });

    // Detect changes in content.
    useEffect(() => {
        return editor.registerUpdateListener(() => {
            spacedUpdate.scheduleUpdate();
        });
    }, [ spacedUpdate, editor ]);
}
