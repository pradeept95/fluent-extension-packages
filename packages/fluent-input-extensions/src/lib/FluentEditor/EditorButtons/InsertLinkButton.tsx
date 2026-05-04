import { Popover, Button, PopoverSurface, Input, tokens, Checkbox, useId, PositioningImperativeRef, SplitButton, MenuPopover, Menu, MenuTrigger, MenuButtonProps, MenuList, MenuItem, Tooltip } from '@fluentui/react-components';
import { LinkDismissRegular, LinkRegular } from '@fluentui/react-icons';
import React from 'react';
import { useIconStyles } from './useIconStyles';
import { IEditor } from 'roosterjs-content-model-types';
import { insertLink, removeLink } from 'roosterjs-content-model-api';

export interface InsertLinkButtonProps {
    editor: IEditor;
    canUnlink?: boolean;
    handleChange: () => void;
}

export const InsertLinkButton: React.FC<InsertLinkButtonProps> = ({ editor, canUnlink, handleChange }) => {

    const [isLinkEditorOpen, setIsLinkEditorOpen] = React.useState<boolean>(false);

    // const [link, setLink] = React.useState<string>("");
    // const [altText, setAltText] = React.useState<string>("");
    // const [title, setTitle] = React.useState<string>("");
    // const [inNewWindow, setInNewWindow] = React.useState<boolean>(true);

    const linkRef = React.useRef<HTMLInputElement>(null);
    const altTextRef = React.useRef<HTMLInputElement>(null);
    const titleRef = React.useRef<HTMLInputElement>(null);
    const inNewWindowRef = React.useRef<HTMLInputElement>(null);

    const id = useId("link");

    const popoverTriggerButtonRef = React.useRef<HTMLButtonElement>(null);
    const popoverPositioningRef = React.useRef<PositioningImperativeRef>(null);
    React.useEffect(() => {
        if (popoverTriggerButtonRef.current) {
            popoverPositioningRef.current?.setTarget(popoverTriggerButtonRef.current);
        }
    }, [popoverPositioningRef, popoverTriggerButtonRef]);

    const styles = useIconStyles();
    return (
        <>
            <Popover trapFocus
                positioning={{ positioningRef: popoverPositioningRef }}
                open={isLinkEditorOpen}
                onOpenChange={(_, data) => setIsLinkEditorOpen(data.open)}
            >
                <PopoverSurface>
                    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacingHorizontalS }}>
                        <Input size={"small"} type={"url"} placeholder='Link' aria-label="Link URL" ref={linkRef} />
                        <Input size={"small"} placeholder='Alt text' aria-label="Link alt text" ref={altTextRef} />
                        <Input size={"small"} placeholder='Display Title' aria-label="Link display title" ref={titleRef} />
                        <Checkbox id={id} defaultChecked={true} ref={inNewWindowRef} label={<>Open in new tab</>} />
                        <Button
                            appearance="subtle"
                            onClick={() => {
                                const link = linkRef.current?.value;
                                const altText = altTextRef.current?.value;
                                const title = titleRef.current?.value;
                                const inNewWindow = inNewWindowRef.current?.checked;
                                if (link) {
                                    insertLink(editor, link, altText, title, inNewWindow ? "_blank" : undefined);
                                    handleChange?.();

                                    // clear the input fields
                                    if (linkRef.current) linkRef.current.value = "";
                                    if (altTextRef.current) altTextRef.current.value = "";
                                    if (titleRef.current) titleRef.current.value = "";
                                    if (inNewWindowRef.current) inNewWindowRef.current.checked = true;

                                    setIsLinkEditorOpen(false);
                                }
                            }}
                            size='small'
                        >
                            Insert Link
                        </Button>
                    </div>
                </PopoverSurface>
            </Popover>
            <Menu positioning="above">
                <MenuTrigger disableButtonEnhancement>
                    {(triggerProps: MenuButtonProps) => (
                        <Tooltip content={<>Link actions</>} relationship='label'>
                            <SplitButton
                                appearance="subtle"
                                aria-label="Link actions"
                                menuButton={{
                                    ...triggerProps,
                                    'aria-label': 'Open link actions menu',
                                }}
                                primaryActionButton={{
                                    ref: popoverTriggerButtonRef,
                                    icon: <LinkRegular className={styles.icon} />,
                                    'aria-label': 'Insert or edit link',
                                    size: 'small',
                                    onClick: () => setIsLinkEditorOpen(true)
                                }}
                            />
                        </Tooltip>
                    )}
                </MenuTrigger>

                <MenuPopover>
                    <MenuList>
                        <MenuItem
                            onClick={() => {
                                removeLink(editor);
                                handleChange?.();
                            }}
                            icon={<LinkDismissRegular />}
                            disabled={!canUnlink}
                        >
                            Remove Link
                        </MenuItem>
                    </MenuList>
                </MenuPopover>
            </Menu>
        </>
    );
};
