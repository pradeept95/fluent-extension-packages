import { Button, Dropdown, Option, Tooltip } from '@fluentui/react-components';
import React from 'react';
import { changeFontSize, setFontSize, setSpacing } from 'roosterjs-content-model-api';
import { useIconStyles } from './useIconStyles';
import { IEditor } from 'roosterjs-content-model-types';
import { For } from '@prt-ts/react-control-flow';
import { FontDecreaseFilled, FontIncreaseFilled } from '@fluentui/react-icons';

export interface HeadingLevelProps {
    editor: IEditor;
    handleChange: () => void;
    fontSize: string;
}

const FontSizesOptions = ["8pt", "9pt", "10pt", "11pt", "12pt", "14pt", "16pt", "18pt", "20pt", "24pt", "36pt", "54pt", "72pt"];

export const SetFontSizeFormatter: React.FC<HeadingLevelProps> = ({ editor, fontSize = "12pt", handleChange }) => {
    const styles = useIconStyles();
    const [selectedFontSize, setSelectedFontSize] = React.useState<string[]>([fontSize]);

    React.useEffect(() => {
        if (fontSize) {
            setSelectedFontSize([fontSize]);
        }
    }, [fontSize]);

    const selectedValue = selectedFontSize?.[0] || "12pt";

    return (
        <>
            <Dropdown
                size="small"
                appearance="filled-lighter"
                className={styles.dropdown}
                aria-label="Font size"
                value={selectedValue}
                selectedOptions={selectedFontSize}
                onOptionSelect={(_, data) => {
                    setSelectedFontSize([`${data.optionValue}`]);
                    // setSpacing(editor, `${data.optionValue}`);
                    setFontSize(editor, `${data.optionValue}`); 

                    editor?.focus?.();
                }}
                listbox={{
                    style: {
                        maxHeight: "200px", 
                        overflowY: "auto",
                    },

                }}
                button={{
                    className : styles.buttonContent,
                    'aria-label': 'Font size',
                }}
                clearButton={{
                    'aria-label': 'Clear font size',
                }}
                aria-invalid={false}
            >
                <For each={FontSizesOptions}>
                    {
                        (fontSizeOption) => (<Option key={fontSizeOption} value={`${fontSizeOption}`} text={`${fontSizeOption}`}>{fontSizeOption}</Option>)
                    }
                </For>
            </Dropdown>
            <Tooltip content={<>Increase font size</>} relationship='label'>
            <Button
                aria-label="increase font size"
                icon={<FontIncreaseFilled className={styles.icon} />}
                onClick={() => {
                    changeFontSize(editor, "increase"); 
                    setSpacing(editor, selectedValue);

                    // focus
                    editor?.focus?.();
                }}
                size="small"
                appearance="subtle"
            />
            </Tooltip>

            <Tooltip content={<>Decrease font size</>} relationship='label'>
            <Button
                aria-label="decrease font size"
                icon={<FontDecreaseFilled className={styles.icon} />}
                onClick={() => {
                    changeFontSize(editor, "decrease"); 
                    setSpacing(editor, selectedValue);

                    // focus
                    editor?.focus?.();
                }}
                size="small"
                appearance="subtle"
            />
            </Tooltip>
        </>
    );

}
