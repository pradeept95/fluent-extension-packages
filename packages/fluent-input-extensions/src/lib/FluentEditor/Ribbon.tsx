import * as React from "react";
import { Divider, Toolbar, ToggleButton, makeStyles, tokens, Tooltip, Button, shorthands } from "@fluentui/react-components";
import type { ContentModelFormatState, IEditor } from 'roosterjs-content-model-types';
import {
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleStrikethrough,
    toggleCode,
    toggleNumbering,
    toggleBullet,
    toggleBlockQuote,
    clearFormat,
    setIndentation,
    toggleSuperscript,
    toggleSubscript,
} from 'roosterjs-content-model-api';

import {
    TextBoldRegular,
    TextItalicRegular,
    TextUnderlineRegular,
    TextStrikethroughRegular,
    CodeFilled,
    ClearFormattingRegular,
    TextNumberListLtrRegular,
    TextBulletListRegular,
    TextQuoteRegular,
    TextGrammarArrowLeftFilled,
    TextGrammarArrowRightFilled,
    TextSubscriptFilled,
    TextSuperscriptFilled,
    ArrowUndoRegular,
    ArrowRedoRegular
} from "@fluentui/react-icons";
import { ChooseFontColor, ChooseHighlightColor, HeadingLevel, InsertImageButton, InsertLinkButton, InsertTableButton, SetFontSizeFormatter, TextAlign, TextCapitalization } from "./EditorButtons";
import { useFormatState } from "./useFormatState";
import { redo, undo } from "roosterjs-content-model-core";
import { DocPopover } from "./EditorButtons/DocPopover";

/* eslint-disable */
type FluentEditorRibbonProps = {
    editor?: IEditor;
    value?: string | undefined;
    handleChange: () => void;
};

const useRibbonStyle = makeStyles({
    toolbar: {
        display: "flex",
        alignContent: "center",
        flexWrap: "wrap",
        ...shorthands.gap(tokens.spacingVerticalXXS, tokens.spacingVerticalXXS)
    },
    icon: {
        fontSize: tokens.fontSizeBase300
    },
    divider: {
        width: tokens.spacingHorizontalM,
        height: "100%",
    },
    menuPopover: {
        minWidth: tokens.spacingHorizontalM,
    },
    dropdown: {
        minWidth: tokens.spacingHorizontalM,
    }
})

export const FluentEditorRibbon: React.FC<FluentEditorRibbonProps> = (props) => {
    const { editor, value, handleChange } = props;

    const {
        isBold,
        isItalic,
        isUnderline,
        isStrikeThrough,
        isSubscript,
        isSuperscript,
        isNumbering,
        isBullet,
        isBlockQuote,
        isCodeBlock,
        fontSize,
        textColor,
        backgroundColor,
        textAlign,
        headingLevel,
        imageFormat,
        canUndo,
        canRedo,
        canUnlink,
        canAddImageAltText
    }: ContentModelFormatState = useFormatState(editor!, value!);
    const styles = useRibbonStyle()
    return (
        <div style={{ display: "flex", alignContent: "center", flexWrap: "wrap" }}>
            <Toolbar
                aria-label="Text Formatting Toolbar"
                className={styles.toolbar}
            >
                <Tooltip content={<>Toggle Bold (ctrl + B)</>} relationship='label'>
                    <ToggleButton
                        aria-label="Bold"
                        appearance="subtle"
                        icon={<TextBoldRegular className={styles.icon} />}
                        checked={isBold}
                        onClick={async () => {
                            await toggleBold(editor!);
                            handleChange?.();
                        }}
                        size="small"
                    />
                </Tooltip>
                <Tooltip content={<>Toggle Italic (ctrl + I)</>} relationship='label'>
                    <ToggleButton
                        aria-label="Italic"
                        appearance="subtle"
                        icon={<TextItalicRegular className={styles.icon} />}
                        checked={isItalic}
                        onClick={() => {
                            toggleItalic(editor!);
                            handleChange?.();
                        }}
                        size="small"
                    />
                </Tooltip>
                <Tooltip content={<>Toggle Underline (ctrl + U)</>} relationship='label'>
                    <ToggleButton
                        aria-label="Underline"
                        appearance="subtle"
                        icon={<TextUnderlineRegular className={styles.icon} />}
                        checked={isUnderline}
                        onClick={() => {
                            toggleUnderline(editor!);
                            handleChange?.();
                        }}
                        size="small"
                    />
                </Tooltip>
                <Tooltip content={<>Toggle Strike Through</>} relationship='label'>
                    <ToggleButton
                        aria-label="Strikethrough"
                        appearance="subtle"
                        icon={<TextStrikethroughRegular className={styles.icon} />}
                        checked={isStrikeThrough}
                        onClick={() => {
                            toggleStrikethrough(editor!);
                            handleChange?.();
                        }}
                        size="small"
                    />
                </Tooltip>

                <SetFontSizeFormatter editor={editor!} handleChange={handleChange} fontSize={fontSize || "14"} />

                <div aria-hidden="true">
                    <Divider vertical className={styles.divider} role="presentation" />
                </div>

                {/* font color */}
                <ChooseFontColor editor={editor!} handleChange={handleChange} fontColor={textColor || "#000000"} />

                {/* highlight color */}
                <ChooseHighlightColor editor={editor!} handleChange={handleChange} fontColor={textColor || "#000000"} backgroundColor={backgroundColor || ""} />


                {/* text align */}
                <TextAlign editor={editor!} handleChange={handleChange} textAlign={textAlign as any} />

                <TextCapitalization editor={editor!} handleChange={handleChange} />

                <HeadingLevel editor={editor!} handleChange={handleChange} headingLevel={headingLevel as any} />

                <div aria-hidden="true">
                    <Divider vertical className={styles.divider} role="presentation" />
                </div>

                <Tooltip content={<>Increase Indent</>} relationship='label'>
                    <ToggleButton
                        aria-label="Increase indentation"
                        appearance="subtle"
                        icon={<TextGrammarArrowLeftFilled className={styles.icon} />}
                        onClick={() => {
                            setIndentation(editor!, "indent");
                            handleChange?.();
                        }}
                        size="small"
                    />
                </Tooltip>
                <Tooltip content={<>Decrease Indent</>} relationship='label'>
                    <ToggleButton
                        aria-label="Decrease Indent"
                        appearance="subtle"
                        icon={<TextGrammarArrowRightFilled className={styles.icon} />}
                        onClick={() => {
                            setIndentation(editor!, "outdent");
                            handleChange?.();
                        }}
                        size="small"
                    />
                </Tooltip>

                <Tooltip content={<>Number List</>} relationship='label'>
                    <ToggleButton
                        aria-label="Number List"
                        appearance="subtle"
                        icon={<TextNumberListLtrRegular className={styles.icon} />}
                        checked={isNumbering}
                        onClick={() => {
                            toggleNumbering(editor!);
                            handleChange?.();
                        }}
                        size="small"
                    />
                </Tooltip>

                <Tooltip content={<>Bullet List</>} relationship='label'>
                    <ToggleButton
                        aria-label="Bullet List"
                        appearance="subtle"
                        icon={<TextBulletListRegular className={styles.icon} />}
                        checked={isBullet}
                        onClick={() => {
                            toggleBullet(editor!);
                            handleChange?.();
                        }}
                        size="small"
                    />
                </Tooltip>

                <Tooltip content={<>Superscript</>} relationship='label'>
                    <ToggleButton
                        aria-label="Superscript"
                        appearance="subtle"
                        icon={<TextSuperscriptFilled className={styles.icon} />}
                        checked={isSuperscript}
                        onClick={() => {
                            toggleSuperscript(editor!);
                            handleChange?.();
                        }}
                        size="small"
                    />
                </Tooltip>

                <Tooltip content={<>Subscript</>} relationship='label'>
                    <ToggleButton
                        aria-label="Subscript"
                        appearance="subtle"
                        icon={<TextSubscriptFilled className={styles.icon} />}
                        checked={isSubscript}
                        onClick={() => {
                            toggleSubscript(editor!);
                            handleChange?.();
                        }}
                        size="small"
                    />
                </Tooltip>

                <div aria-hidden="true">
                    <Divider vertical className={styles.divider} role="presentation" />
                </div>

                {/* insert image */}
                <InsertImageButton editor={editor!} handleChange={handleChange} imageFormat={imageFormat} /> 

                {/* insert link */}
                <InsertLinkButton editor={editor!} handleChange={handleChange} canUnlink={canUnlink}/>

                <Tooltip content={<>Block Quote</>} relationship='label'>
                    <ToggleButton
                        aria-label="Block Quote"
                        appearance="subtle"
                        icon={<TextQuoteRegular className={styles.icon} />}
                        checked={isBlockQuote}
                        onClick={() => {
                            toggleBlockQuote(editor!);
                            handleChange?.();
                        }}
                        size="small"
                    />
                </Tooltip>

                {/* insert table */}
                <InsertTableButton editor={editor!} handleChange={handleChange} />

                <Tooltip content={<>Code Block</>} relationship='label'>
                    <ToggleButton
                        aria-label="Code Block"
                        appearance="subtle"
                        icon={<CodeFilled className={styles.icon} />}
                        checked={isCodeBlock}
                        onClick={() => {
                            toggleCode(editor!);
                            handleChange?.();
                        }}
                        size="small"
                    />
                </Tooltip>

                <Tooltip content={<>Clear Format</>} relationship='label'>
                    <Button
                        aria-label="Clear Format"
                        appearance="subtle"
                        icon={<ClearFormattingRegular className={styles.icon} />}
                        onClick={() => {
                            clearFormat(editor!);
                            handleChange?.();
                        }}
                        size="small"
                    />
                </Tooltip>

                <div aria-hidden="true">
                    <Divider vertical className={styles.divider} role="presentation" />
                </div>
                
                <Tooltip content={<>Undo</>} relationship='label'>
                    <Button
                        aria-label="Undo"
                        appearance="subtle"
                        icon={<ArrowUndoRegular className={styles.icon} />}
                        disabled={!canUndo}
                        onClick={async () => {
                           undo(editor!);
                        }}
                        size="small"
                    />
                </Tooltip>
                <Tooltip content={<>Redo</>} relationship='label'>
                    <Button
                        aria-label="Redo"
                        appearance="subtle"
                        icon={<ArrowRedoRegular className={styles.icon} />}
                        disabled={!canRedo}
                        onClick={() => {
                            redo(editor!);
                        }}
                        size="small"
                    />
                </Tooltip>

                <DocPopover />
                
            </Toolbar>

        </div>
    );
}
