import React from 'react';
import "./Editor.css";
import { FluentEditorRibbon } from './Ribbon';
import { Show } from '@prt-ts/react-control-flow';
import { mergeClasses, tokens } from '@fluentui/react-components';
import { FluentEditorProps } from './FluentEditorTypes';
import { useEditorStaticStyles, useEditorStyle } from './useFluentEditorStyles';
import { useFluentEditor } from './useFluentEditor'; 
import { IEditor } from 'roosterjs-content-model-types';

export const FluentEditor = React.forwardRef<HTMLDivElement, FluentEditorProps>((props, ref) => {

    const {
        id,
        editorDiv,
        textareaProps,
        fieldProps,
        showPlaceholder,
        hasFocus,
        handleChange,
        handleFocus,
        handleBlur,
        showRibbonAll,
        ribbonPosition,
        size,
        editor,
        internalValue, 
        disabled,
        readOnly,
    } = useFluentEditor(props, ref);

    const themeInfoStyles = {
        "--darkColor__ffffff" : tokens.colorNeutralBackground1,
        "--darkColor__000000" : tokens.colorNeutralForeground1,
        backgroundColor: tokens.colorNeutralBackground1,
        color: tokens.colorNeutralForeground1,
    } as React.CSSProperties;

    useEditorStaticStyles();
    const styles = useEditorStyle();
    return (
        <div className={mergeClasses(styles.root, hasFocus && styles.rootFocused, fieldProps['aria-invalid'] && !hasFocus && styles.invalid)}>
            <Show when={!!editor?.current && showRibbonAll && ribbonPosition === "top"}>
                <div className={mergeClasses(styles[ribbonPosition])} >
                    <FluentEditorRibbon editor={editor.current as IEditor} value={internalValue} handleChange={handleChange} />
                </div>
            </Show>
            <div
                {...textareaProps as unknown as React.HTMLAttributes<HTMLDivElement>}
                {...fieldProps}
                id={id}
                ref={editorDiv}
                tabIndex={0}
                className={mergeClasses(styles.editor, styles[size])}
                onBlur={handleBlur}
                onFocus={handleFocus}
                data-placeholder={!showPlaceholder || hasFocus ? "" : textareaProps.placeholder}
                contentEditable={!disabled && !readOnly}
                style={themeInfoStyles}
            />
            <Show when={!!editor?.current && showRibbonAll && ribbonPosition === "bottom"}>
                <div className={mergeClasses(styles[ribbonPosition])}>
                    <FluentEditorRibbon editor={editor.current as IEditor} value={internalValue} handleChange={handleChange} />
                </div>
            </Show>
        </div>
    );
});