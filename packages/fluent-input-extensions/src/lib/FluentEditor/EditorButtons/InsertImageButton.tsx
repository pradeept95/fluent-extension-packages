import { Popover, Button, PopoverSurface, Input, tokens, MenuButtonProps, SplitButton, PositioningImperativeRef, Menu, MenuTrigger, MenuPopover, MenuList, MenuItem, Tooltip } from '@fluentui/react-components';
import { ImageRegular } from '@fluentui/react-icons';
import React from 'react';
import { insertImage, setImageBorder } from 'roosterjs-content-model-api';
import { useIconStyles } from './useIconStyles';
import { IEditor, ImageFormatState } from 'roosterjs-content-model-types';

export interface InsertImageButtonProps {
    editor: IEditor;
    handleChange: () => void;
    imageFormat?: ImageFormatState;
}

export const InsertImageButton: React.FC<InsertImageButtonProps> = ({ editor, handleChange, imageFormat }) => {

    const [isLinkImporterOpen, setIsLinkImporterOpen] = React.useState(false);

    const popoverTriggerButtonRef = React.useRef<HTMLButtonElement>(null);
    const popoverPositioningRef = React.useRef<PositioningImperativeRef>(null);
    React.useEffect(() => {
        if (popoverTriggerButtonRef.current) {
            popoverPositioningRef.current?.setTarget(popoverTriggerButtonRef.current);
        }
    }, [popoverPositioningRef, popoverTriggerButtonRef]);

    const imageUrlRef = React.useRef<HTMLInputElement>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const styles = useIconStyles();
    return (
        <>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => {
                    const selectedFile = Array.from(e.target.files ?? []);
                    if (selectedFile?.length) {
                        for (const file of selectedFile) {
                            const reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = () => {
                                insertImage(editor, reader.result as string);
                                handleChange?.();
                            };
                        }
                        // clear the input file
                        setTimeout(() => {
                            if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                            }
                        }, 2000);
                    }
                }} />

            <Menu positioning="below-end">
                <MenuTrigger disableButtonEnhancement>
                    {(triggerProps: MenuButtonProps) => (
                        <Tooltip content={<>Image actions</>} relationship='label'>
                            <SplitButton
                                appearance="subtle"
                                aria-label="Image actions"
                                menuButton={{
                                    ...triggerProps,
                                    'aria-label': 'Open image actions menu',
                                }}
                                primaryActionButton={{
                                    icon: <ImageRegular className={styles.icon} />,
                                    'aria-label': 'Upload image from device',
                                    size: 'small',
                                    onClick: () => {
                                        if (fileInputRef.current) {
                                            fileInputRef.current.click();
                                        }
                                    },
                                    ref: popoverTriggerButtonRef
                                }}
                            />
                        </Tooltip>
                    )}
                </MenuTrigger>

                <MenuPopover>
                    <MenuList>
                        <MenuItem onClick={() => setIsLinkImporterOpen(true)}>Import image</MenuItem>
                        <MenuItem 
                            disabled={!imageFormat || imageFormat?.borderWidth === "1px"}
                            onClick={() => {
                            setImageBorder(editor, {
                                style: "solid",
                                width: "1px",
                                color: "black"
                            });
                        }}>Set border</MenuItem>
                        <MenuItem
                            disabled={!imageFormat || imageFormat?.borderWidth !== "1px"}
                            onClick={() => {
                                setImageBorder(editor, {
                                    style: "solid",
                                    width: "0px",
                                    color: "black"
                                });
                            }}>Remove border</MenuItem>
                    </MenuList>
                </MenuPopover>
            </Menu>


            <Popover trapFocus
                open={isLinkImporterOpen}
                onOpenChange={(_, data) => setIsLinkImporterOpen(data.open)}
                positioning={{ positioningRef: popoverPositioningRef }}
            >

                <PopoverSurface>
                    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacingHorizontalS }}>
                        <Input
                            ref={imageUrlRef}
                            type="text"
                            placeholder="Image URL"
                            aria-label="Image URL"
                        />
                        <Button
                            size='small'
                            aria-label="Load image from web"
                            onClick={() => {
                                const imageUrl = imageUrlRef.current?.value;
                                if (imageUrl) {
                                    insertImage(editor, imageUrl);
                                    handleChange?.();
                                    imageUrlRef.current && (imageUrlRef.current.value = "");
                                    setIsLinkImporterOpen(false);
                                }
                            }}>Load image from web</Button>
                    </div>
                </PopoverSurface>
            </Popover>
        </>
    );
}
