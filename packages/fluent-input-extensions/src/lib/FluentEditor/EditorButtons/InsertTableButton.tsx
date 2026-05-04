import { Popover, PopoverTrigger, Button, PopoverSurface, tokens, makeStyles, shorthands, mergeClasses, useArrowNavigationGroup, Tooltip } from '@fluentui/react-components';
import { TableRegular } from '@fluentui/react-icons';
import React from 'react';
import { useIconStyles } from './useIconStyles';
import { IEditor } from 'roosterjs-content-model-types';
import { insertTable } from 'roosterjs-content-model-api';
import { For } from '@prt-ts/react-control-flow';

export interface InsertTableButtonProps {
    editor: IEditor;
    handleChange: () => void;
}

const gridItems = Array.from({ length: 10 }, (_, i) => i + 1);

const useStyles = makeStyles({
    rowContainer: {
        display: "flex",
        flexDirection: "column",
        ...shorthands.gap(tokens.spacingHorizontalXS)
    },
    colContainer: {
        display: "flex",
        flexDirection: "row",
        ...shorthands.gap(tokens.spacingHorizontalXS)
    },
    sizeHandleButton: {
        width: "15px",
        height: "15px",
        minWidth: "15px",
        cursor: "pointer",
        ...shorthands.border(tokens.strokeWidthThin, "solid", tokens.colorNeutralStroke1),
        ...shorthands.borderRadius(0),

        "&:hover": {
            ...shorthands.border(tokens.strokeWidthThin, "solid", tokens.colorBrandBackground2Pressed),
            ...shorthands.borderRadius(0),
        }
    },

    sizeHandleButtonActive: {
        ...shorthands.border(tokens.strokeWidthThin, "solid", tokens.colorBrandBackground2Pressed),
    }


});

export const InsertTableButton: React.FC<InsertTableButtonProps> = ({ editor, handleChange }) => {

    const [rows, setRows] = React.useState(0);
    const [cols, setCols] = React.useState(0);

    const handleCreateTable = (numberOfRows: number, numberOfCols: number) => {
        insertTable(editor, numberOfCols, numberOfRows);
        handleChange?.();
    };

    const focusAttributes = useArrowNavigationGroup({ axis: "grid", circular: true });
    const styles = useIconStyles();
    const tableStyles = useStyles();
    return (
        <Popover trapFocus>
            <PopoverTrigger disableButtonEnhancement>
                <Tooltip content={<>Insert Table</>} relationship='label'>
                    <Button
                        appearance="subtle"
                        aria-label="Insert table"
                        icon={<TableRegular className={styles.icon} />}
                        name="additionalFormat"
                        value={"code"}

                        size="small"
                    />
                </Tooltip>
            </PopoverTrigger>

            <PopoverSurface>
                <div>{rows} x {cols} Table</div>
                <div className={tableStyles.rowContainer} {...focusAttributes}>
                    {/* create 10 by 10 grid using div */}
                    <For each={gridItems}>
                        {
                            (rowsNum) => (
                                <div key={`rows_${rowsNum}`} className={tableStyles.colContainer}>
                                    <For each={gridItems}>
                                        {
                                            (colsNum) => (
                                                <Button
                                                    key={`cols_${colsNum}`}
                                                    aria-label={`Select ${rowsNum} rows and ${colsNum} columns`}
                                                    onClick={() => {
                                                        handleCreateTable(rows, cols);
                                                    }}
                                                    onMouseOver={() => {
                                                        setRows(rowsNum);
                                                        setCols(colsNum);
                                                    }}
                                                    onFocus={() => {
                                                        setRows(rowsNum);
                                                        setCols(colsNum);
                                                    }
                                                    }
                                                    size="small"
                                                    appearance='transparent'
                                                    className={mergeClasses(tableStyles.sizeHandleButton, rowsNum <= rows && colsNum <= cols && tableStyles.sizeHandleButtonActive)}
                                                />
                                            )
                                        }
                                    </For>
                                </div>
                            )}
                    </For>
                </div>
            </PopoverSurface>
        </Popover>

    );
};
