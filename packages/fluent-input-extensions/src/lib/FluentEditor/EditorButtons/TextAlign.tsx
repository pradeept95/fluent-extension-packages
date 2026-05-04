import { Button, Menu, MenuItemRadio, MenuList, MenuPopover, MenuTrigger, Tooltip } from '@fluentui/react-components';
import { TextAlignCenterRegular, TextAlignJustifyRegular, TextAlignLeftRegular, TextAlignRightRegular } from '@fluentui/react-icons';
import React from 'react';
import { setAlignment } from 'roosterjs-content-model-api';
import { useIconStyles } from './useIconStyles';
import { IEditor } from 'roosterjs-content-model-types';
import { Case, Switch } from '@prt-ts/react-control-flow';

export type TextAlignProps = {
    editor: IEditor;
    handleChange: () => void;
    textAlign: "left" | "center" | "right" | "justify";
}

export const TextAlign: React.FC<TextAlignProps> = ({ editor, handleChange, textAlign }) => {

    const styles = useIconStyles();
    return (
        <Menu
            checkedValues={{
                alignment: [textAlign || "left"]
            }}
            onCheckedValueChange={(_, data) => {
                const alignmentText = data.checkedItems?.[0] as TextAlignProps["textAlign"];
                setAlignment(editor, alignmentText);
            }}>
            <MenuTrigger disableButtonEnhancement>
                <Tooltip content={<>Text Alignment</>} relationship='label'>
                    <Button icon={{
                        children: (
                            <Switch when={textAlign} >
                                <Case value={["left", "start"]}>
                                    <TextAlignLeftRegular className={styles.icon} />
                                </Case>
                                <Case value={"center"}>
                                    <TextAlignCenterRegular className={styles.icon} />
                                </Case>
                                <Case value={"end"}>
                                    <TextAlignRightRegular className={styles.icon} />
                                </Case>
                                <Case value={"justify"}>
                                    <TextAlignJustifyRegular className={styles.icon} />
                                </Case>
                            </Switch>
                        ),
                    }}
                        size="small"
                        appearance="subtle"
                        aria-label="Text alignment"
                    />
                </Tooltip>
            </MenuTrigger>
            <MenuPopover className={styles.menuPopover}>
                <MenuList>
                    <Tooltip content={<>Justify Content</>} relationship='label'>
                        <MenuItemRadio
                            aria-label="Justify Content"
                            icon={<TextAlignJustifyRegular className={styles.icon} />}
                            name={"alignment"}
                            value={"justify"}
                        >
                            Justify
                        </MenuItemRadio>
                    </Tooltip>
                    <Tooltip content={<>Align Left</>} relationship='label'>
                        <MenuItemRadio
                            aria-label="Align Left"
                            icon={<TextAlignLeftRegular className={styles.icon} />}
                            name={"alignment"}
                            value={"left"}
                        >
                            Left
                        </MenuItemRadio>
                    </Tooltip>
                    <Tooltip content={<>Align Center</>} relationship='label'>
                        <MenuItemRadio
                            aria-label="Align Center"
                            icon={<TextAlignCenterRegular className={styles.icon} />}
                            name={"alignment"}
                            value={"center"}
                        >
                            Center
                        </MenuItemRadio>
                    </Tooltip>
                    <Tooltip content={<>Align Right</>} relationship='label'>
                        <MenuItemRadio
                            aria-label="Align Right"
                            icon={<TextAlignRightRegular className={styles.icon} />}
                            name={"alignment"}
                            value={"right"}
                        >
                            Right
                        </MenuItemRadio>
                    </Tooltip>
                </MenuList>
            </MenuPopover>
        </Menu>
    );

}
