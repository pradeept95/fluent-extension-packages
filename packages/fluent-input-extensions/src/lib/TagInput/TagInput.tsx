import React from 'react';
import { TagInputProps, TagInputRef } from './TagInputProps';
import {
  Tag,
  TagPicker,
  TagPickerControl,
  TagPickerGroup,
  TagPickerInput,
  TagPickerList,
  TagPickerOption,
  TagPickerOptionGroup,
  TagPickerProps,
  useId,
  useTagPickerFilter,
} from '@fluentui/react-components';
import { Tag20Regular } from '@fluentui/react-icons';
import { For, Show } from '@prt-ts/react-control-flow';

/* eslint-disable */
function capitalizeFirstLetterRegex(string: string): string {
  return string.replace(/^\w/, (match) => match.toUpperCase());
}

export function useTagInputImperativeHandle(
  value: string[] | undefined,
  ref: React.ForwardedRef<TagInputRef>,
  onTagSelect: TagInputProps['onTagSelect']
) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(
    ref,
    () => ({
      value: value || [],
      reset: () => onTagSelect?.([]),
      setValue: (values: string[]) => onTagSelect?.(values),
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
    }),
    [value, inputRef]
  );

  return inputRef;
}

export const TagInput = React.forwardRef<TagInputRef, TagInputProps>(
  (props, ref) => {
    const {
      value = [],
      onTagSelect,
      onBlur,
      suggestions,
      freeform = true,
      multiselect = true,
      id,
      ['aria-label']: ariaLabel,
      ['aria-labelledby']: ariaLabelledBy,
      ['aria-describedby']: ariaDescribedBy,
      placeholder,
    } = props;

    const { size, appearance, disabled }: Omit<TagPickerProps, 'children'> =
      props;

    const inputProps = useTagInputImperativeHandle(value, ref, onTagSelect);
    const fieldId = id || useId('tag-input-field');

    const [query, setQuery] = React.useState('');

    const onOptionSelect: TagPickerProps['onOptionSelect'] = (_, data) => {
      const newValue = data.value === '__UNKNOWN__' ? query : data.value;

      // handle four cases:
      // 1. single select, freeform off
      // 2. single select, freeform on
      // 3. multi select, freeform off
      // 4. multi select, freeform on
      let selectedOptions: string[] = (
        (data.selectedOptions || [])?.map((option) => {
          if (option !== '__UNKNOWN__') {
            return capitalizeFirstLetterRegex(option);
          }
          if (option === '__UNKNOWN__' && freeform) {
            return capitalizeFirstLetterRegex(query);
          }
          return undefined;
        }) || []
      )?.filter(Boolean) as string[];

      if (!multiselect) {
        selectedOptions = selectedOptions.slice(-1);
      }

      const uniqueOptions = Array.from(new Set(selectedOptions));
      onTagSelect?.(uniqueOptions);
      setQuery('');
    };

    const children = useTagPickerFilter({
      query,
      options: suggestions || [],
      noOptionsElement: (
        <TagPickerOption value={'__UNKNOWN__'} text={query}>
          <Show when={freeform && query?.length} fallback={<>No match found</>}>
            Add{' '}
            <Tag
              shape="circular"
              size="extra-small"
              appearance="brand"
              type="button" 
            >
              {capitalizeFirstLetterRegex(query)}
            </Tag>
          </Show>
        </TagPickerOption>
      ),
      renderOption: (option: string) => (
        <TagPickerOption key={option} value={option} text={option}>
          {option}
        </TagPickerOption>
      ),
      filter: (suggestion: string) => {
        const selectedValues = (value || []) as string[];
        return (
          !selectedValues?.includes(suggestion) &&
          suggestion.toLowerCase().includes(query.toLowerCase())
        );
      },
    });

    return (
      <TagPicker
        selectedOptions={value || []}
        onOptionSelect={onOptionSelect}
        size={size}
        appearance={appearance}
        disabled={disabled}
      >
        <TagPickerControl expandIcon={<Tag20Regular />}>
          <TagPickerGroup>
            <For each={value || []}>
              {(tag: string, index) => (
                <Tag
                  key={index}
                  value={`${tag}`}
                  shape="circular"
                  size="extra-small"
                  appearance="brand"
                  type="button"

                >
                  {tag}
                </Tag>
              )}
            </For>
          </TagPickerGroup>
          <TagPickerInput
            value={query}
            onChange={(e) => {
              const data = e.target;
              setQuery(data.value);
            }}
            id={fieldId}
            ref={inputProps}
            onBlur={onBlur}
            placeholder={placeholder}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            required={false}
          />
        </TagPickerControl>
        <TagPickerList style={{ maxHeight: '300px' }}>
          <TagPickerOptionGroup label="Suggestions">
            {children}
          </TagPickerOptionGroup>
        </TagPickerList>
      </TagPicker>
    );
  }
);
