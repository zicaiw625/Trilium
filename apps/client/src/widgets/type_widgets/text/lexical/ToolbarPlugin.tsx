/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import "./ToolbarPlugin.css";

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {mergeRegister} from '@lexical/utils';
import {
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    COMMAND_PRIORITY_LOW,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
} from 'lexical';
import {useCallback, useEffect, useRef, useState} from 'react';

import ActionButton, { ActionButtonProps } from "../../../react/ActionButton";

function Divider() {
    return <div className="divider" />;
}

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);

    const $updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            // Update text format
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
        }
    }, []);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({editorState}) => {
                editorState.read(
                    () => {
                        $updateToolbar();
                    },
                    {editor},
                );
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, _newEditor) => {
                    $updateToolbar();
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
        );
    }, [editor, $updateToolbar]);

    return (
        <div className="toolbar" ref={toolbarRef}>
            <ToolbarButton
                disabled={!canUndo}
                onClick={() => {
                    editor.dispatchCommand(UNDO_COMMAND, undefined);
                }}
                text="Undo"
                icon="bx bx-undo"
            />
            <ToolbarButton
                disabled={!canRedo}
                onClick={() => {
                    editor.dispatchCommand(REDO_COMMAND, undefined);
                }}
                text="Redo"
                icon="bx bx-redo"
            />
            <Divider />
            <ToolbarButton
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                }}
                active={isBold}
                text="Format Bold"
                icon="bx bx-bold"
            />
            <ToolbarButton
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                }}
                active={isItalic}
                text="Format Italics"
                icon="bx bx-italic"
            />
            <ToolbarButton
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
                }}
                active={isUnderline}
                text="Format Underline"
                icon="bx bx-underline"
            />
            <ToolbarButton
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
                }}
                active={isStrikethrough}
                text="Format Strikethrough"
                icon="bx bx-strikethrough"
            />
            <Divider />
            <ToolbarButton
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
                }}
                text="Left Align"
                icon="bx bx-align-left"
            />
            <ToolbarButton
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
                }}
                text="Center Align"
                icon="bx bx-align-middle"
            />
            <ToolbarButton
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
                text="Right Align"
                icon="bx bx-align-right"
            />
            <ToolbarButton
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
                text="Justify Align"
                icon="bx bx-align-justify"
            />{' '}
        </div>
    );
}

function ToolbarButton(props: Pick<ActionButtonProps, "icon" | "disabled" | "onClick" | "text">) {
    return (
        <ActionButton
            className="toolbar-item"
            {...props}
        />
    );
}
