import { Popover, PopoverTrigger, Button, PopoverSurface, Input, tokens, Checkbox, useId } from '@fluentui/react-components';
import { LinkDismissRegular, LinkRegular } from '@fluentui/react-icons';
import React from 'react';
import { useIconStyles } from './useIconStyles';
import { IEditor } from 'roosterjs-content-model-types';
import { insertLink, removeLink } from 'roosterjs-content-model-api';

export interface InsertLinkButtonProps {
    editor: IEditor;
    handleChange: () => void;
}

export const InsertLinkButton: React.FC<InsertLinkButtonProps> = ({ editor, handleChange }) => {

    const [link, setLink] = React.useState<string>("");
    const [altText, setAltText] = React.useState<string>("");
    const [title, setTitle] = React.useState<string>("");
    const [inNewWindow, setInNewWindow] = React.useState<boolean>(true);

    const id = useId("link");

    const styles = useIconStyles();
    return (
        <>
            <Popover>
                <PopoverTrigger disableButtonEnhancement>
                    <Button
                        aria-label="Code Block"
                        icon={<LinkRegular className={styles.icon} />}
                        name="additionalFormat"
                        value={"code"}

                        size="small"
                    />
                </PopoverTrigger>

                <PopoverSurface tabIndex={-1}>
                    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacingHorizontalS }}>
                        <Input type={"url"} placeholder='Link' value={`${link}`} onChange={(e) => setLink(e.target.value)} />
                        <Input placeholder='Alt text' value={`${altText}`} onChange={(e) => setAltText(e.target.value)} />
                        <Input placeholder='Display Title' value={`${title}`} onChange={(e) => setTitle(e.target.value)} />
                        <Checkbox id={id} checked={inNewWindow} onChange={(e) => setInNewWindow(e.target.checked)} label={<>Open in new tab</>} />
                        <Button
                            onClick={() => {
                                if (link) {
                                    insertLink(editor, link, altText, title, inNewWindow ? "_blank" : undefined);
                                    handleChange?.();

                                    setLink("");
                                    setAltText("");
                                    setTitle("");
                                    setInNewWindow(true);
                                }
                            }}
                            size='small'
                        >
                            Insert Link
                        </Button>
                    </div>
                </PopoverSurface>
            </Popover>
            <Button
                onClick={() => {
                    removeLink(editor);
                    handleChange?.();
                }}
                size='small'
                icon={<LinkDismissRegular />}
            />
        </>

    );
};