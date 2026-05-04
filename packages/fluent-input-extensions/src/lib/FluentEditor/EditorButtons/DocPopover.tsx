import React from 'react';
import { EditorShortcutDoc } from '../EditorShortcutDoc/EditorShortcutDoc';
import { Button, Popover, PopoverSurface, PopoverTrigger, Tooltip } from '@fluentui/react-components';
import { InfoRegular } from '@fluentui/react-icons';

export const DocPopover: React.FC = () => {
    return (
        <Popover withArrow>
            <PopoverTrigger disableButtonEnhancement>
                <Tooltip content="Keyboard Shortcuts" relationship='label'>
                    <Button
                        aria-label="Keyboard shortcuts"
                        icon={<InfoRegular />}
                        appearance='subtle'
                        size='small'
                    />
                </Tooltip>
            </PopoverTrigger>

            <PopoverSurface tabIndex={-1} style={{ maxHeight: "400px", overflowY: "auto"}}> 
                <EditorShortcutDoc />
            </PopoverSurface>
        </Popover>
    );
};
