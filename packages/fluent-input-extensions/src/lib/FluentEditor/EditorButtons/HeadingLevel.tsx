import { Dropdown, Option } from '@fluentui/react-components';
import React from 'react';
import { setHeadingLevel } from 'roosterjs-content-model-api';
import { useIconStyles } from './useIconStyles';
import { IEditor } from 'roosterjs-content-model-types';
import { For } from '@prt-ts/react-control-flow';
import { ChoiceOption } from '@prt-ts/types';

export interface HeadingLevelProps {
  editor: IEditor;
  handleChange: () => void;
  headingLevel: 0 | 1 | 2 | 3 | 4 | 5;
}

const headingLevelOptions: ChoiceOption[] = [
  { label: 'Normal', value: '0' },
  { label: 'Heading 1', value: '1' },
  { label: 'Heading 2', value: '2' },
  { label: 'Heading 3', value: '3' },
  { label: 'Heading 4', value: '4' },
  { label: 'Heading 5', value: '5' },
];

export const HeadingLevel: React.FC<HeadingLevelProps> = ({
  editor,
  headingLevel = '0',
  handleChange,
}) => {
  const dropdownRef = React.useRef<HTMLButtonElement>(null);
  const styles = useIconStyles();
  const value = React.useMemo(
    () => headingLevelOptions?.find((l) => +l.value === +headingLevel)?.label,
    [headingLevel]
  );
  return (
    <Dropdown
      ref={dropdownRef}
      size="small"
      appearance="filled-lighter"
      className={styles.dropdown}
      aria-label="Heading level"
      value={value || ''}
      selectedOptions={[headingLevel?.toString()]}
      onOptionSelect={(_, data) => {
        setHeadingLevel(
          editor,
          parseInt(data.optionValue ?? '0') as HeadingLevelProps['headingLevel']
        );
        handleChange?.();

        // remove focus from dropdown
        dropdownRef?.current?.blur();

        // set focus back to editor
        editor?.focus?.();
      }}
      button={{
        className: styles.buttonContent,
        'aria-label': 'Heading level',
      }}
      clearButton={{
        'aria-label': 'Clear heading level',
      }}
      aria-invalid={false}
    >
      <For each={headingLevelOptions}>
        {(option) => (
          <Option key={`${option.value}`} value={`${option.value}`}>
            {`${option.label ?? ''}`}
          </Option>
        )}
      </For>
    </Dropdown>
  );
};
