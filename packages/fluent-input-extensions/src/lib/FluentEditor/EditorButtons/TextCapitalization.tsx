import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, Tooltip } from '@fluentui/react-components';
import { TextCaseLowercaseFilled, TextCaseTitleFilled, TextCaseUppercaseFilled, TextEditStyleFilled, TextEffectsFilled } from '@fluentui/react-icons';
import React from 'react';
import { changeCapitalization } from 'roosterjs-content-model-api';
import { useIconStyles } from './useIconStyles';
import { IEditor } from 'roosterjs-content-model-types';

export interface TextCapitalizationProps {
    editor: IEditor;
    handleChange: () => void;
}

export const TextCapitalization: React.FC<TextCapitalizationProps> = ({ editor, handleChange }) => {

    const styles = useIconStyles();
    return (
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <Tooltip content={<>Text Capitalization</>} relationship='label'>
                    <Button
                        appearance="subtle"
                        aria-label="Text capitalization"
                        icon={{
                            children: (
                                <TextEditStyleFilled className={styles.icon} />
                            ),
                        }}
                        size="small"
                    />
                </Tooltip>
            </MenuTrigger>
            <MenuPopover className={styles.menuPopover}>
                <MenuList>
                    <Tooltip content={<>Capitalize sentence</>} relationship='label'>
                    <MenuItem
                        aria-label="Text Format Capitalize Sentence"
                        icon={<TextCaseTitleFilled className={styles.icon} />}
                        onClick={() => {
                            changeCapitalization(editor, "sentence", "en-US");
                            handleChange?.();
                        }}
                    >
                        Capitalize sentence
                    </MenuItem>
                    </Tooltip>
                    <Tooltip content={<>All uppercase</>} relationship='label'>
                    <MenuItem
                        aria-label="Text Format Upper Case"
                        icon={<TextCaseUppercaseFilled className={styles.icon} />}
                        onClick={() => {
                            changeCapitalization(editor, "upperCase", "en-US");
                            handleChange?.();
                        }}
                    >
                        Uppercase
                    </MenuItem>
                    </Tooltip>
                    <Tooltip content={<>All lowercase</>} relationship='label'>
                    <MenuItem
                        aria-label="Text Format Lower Case"
                        icon={<TextCaseLowercaseFilled className={styles.icon} />}
                        onClick={() => {
                            changeCapitalization(editor, "lowerCase", "en-US");
                            handleChange?.();
                        }}
                    >
                        Lowercase
                    </MenuItem>
                    </Tooltip>
                    <Tooltip content={<>Capitalize all words</>} relationship='label'>
                    <MenuItem
                        aria-label="Text Format Capitalize All Words"
                        icon={<TextEffectsFilled className={styles.icon} />}
                        onClick={() => {
                            changeCapitalization(editor, "capitalize", "en-US");
                            handleChange?.();
                        }}
                    >
                        Capitalize Words
                    </MenuItem>
                    </Tooltip>
                </MenuList>
            </MenuPopover>
        </Menu>
    );

}
