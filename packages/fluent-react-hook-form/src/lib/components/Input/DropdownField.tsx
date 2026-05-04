import {
  Field,
  FieldProps,
  Dropdown,
  DropdownProps,
  Option,
  OptionGroup,
  LabelProps,
  OptionProps,
  useId,
  InfoLabel,
  InfoLabelProps,
  makeStyles,
  OptionGroupProps,
} from '@fluentui/react-components';
import { forwardRef, useMemo } from 'react';
import { useFormContext } from '../Form';
import { Controller, ControllerProps } from 'react-hook-form';
import { Show } from '@prt-ts/react-control-flow';
import { ChoiceOption } from '@prt-ts/types';
import { getControlAriaLabel, getVisibleFieldLabelText } from './accessibility';

export type DropdownChoiceOption = {
  optionProps?: Partial<OptionProps> | undefined;
} & ChoiceOption;

export type DropdownChoiceGroup = {
  label: string;
  optionGroupProps?: OptionGroupProps;
  options: DropdownChoiceOption[];
};

type OptionOnly = Omit<DropdownChoiceOption, 'optionProps'>;
export type DropdownFieldProps = FieldProps &
  DropdownProps &
  InfoLabelProps & {
    name: string;
    options: DropdownChoiceOption[] | DropdownChoiceGroup[];
    rules?: ControllerProps['rules'];
    readOnly?: boolean;
  };

const useDropdownStyles = makeStyles({
  listbox: {
    maxHeight: '500px',
  },
});

export const DropdownField = forwardRef<HTMLButtonElement, DropdownFieldProps>(
  ({ name, options, rules, required, readOnly, ...rest }, dropdownRef) => {
    const dropdownId = useId('dropdown');
    const {
      form: { control },
    } = useFormContext();

    const { ...fieldProps }: FieldProps = rest as unknown as FieldProps;
    const { ...dropdownProps }: DropdownProps =
      rest as unknown as DropdownProps;
    const { ...infoLabelProps }: InfoLabelProps =
      rest as unknown as InfoLabelProps;

    const flatOptions = useMemo(() => {
      if (options.some((option) => 'options' in option)) {
        return (options as DropdownChoiceGroup[]).reduce(
          (acc, group) => [...acc, ...group.options],
          [] as DropdownChoiceOption[]
        );
      }
      return options as DropdownChoiceOption[];
    }, [options]);

    const dropdownOptions = useMemo(() => {
      if (options.some((option) => 'options' in option)) {
        return (options as DropdownChoiceGroup[]).map((group, index) => (
          <OptionGroup
            key={`${group.label}_${index}`}
            label={group.label}
            {...(group.optionGroupProps || {})}
          >
            {group.options.map((option) => (
              <Option
                key={`${dropdownId}-${option.value || '__'}-${index}`}
                {...(option?.optionProps || {})}
                value={`${option?.value}`}
              >
                {option?.label}
              </Option>
            ))}
          </OptionGroup>
        ));
      }

      return ((options || []) as DropdownChoiceOption[]).map(
        (option: DropdownChoiceOption, index: number) => (
          <Option
            key={`${dropdownId}-${option.value || '__'}-${index}`}
            {...(option?.optionProps || {})}
            value={`${option?.value}`}
          >
            {option?.label}
          </Option>
        )
      );
    }, [options, dropdownId]);

    const styles = useDropdownStyles();
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => {
          const { onChange, onBlur, value, ref } = field;
          const fieldLabelText = getVisibleFieldLabelText(
            infoLabelProps.label,
            fieldProps.label
          );
          const dropdownAriaLabel = getControlAriaLabel({
            explicitAriaLabel: dropdownProps['aria-label'],
            visibleFieldLabel: fieldLabelText,
            placeholder: dropdownProps.placeholder,
            name,
          });

          const displayValue =
            (value as OptionOnly[])?.map((v) => v.label)?.join(', ') || '';
          const selectedOptions =
            (value as OptionOnly[])?.map((v) => `${v.value}`) || [];

          const handleOnChange: DropdownProps['onOptionSelect'] = (
            ev,
            data
          ) => {
            const mappedOptions = [...flatOptions]?.map(
              (option) =>
                ({
                  label: option.label,
                  value: option.value,
                  meta: option.meta,
                } as OptionOnly)
            );
            const selectedOptions = mappedOptions?.filter((option) =>
              data?.selectedOptions?.includes(`${option.value}`)
            );
            onChange(selectedOptions);
            dropdownProps?.onOptionSelect?.(ev, data);
          };

          const handleOnBlur: DropdownProps['onBlur'] = (ev) => {
            onBlur();
            dropdownProps?.onBlur?.(ev);
          };

          return (
            <Field
              {...fieldProps}
              label={
                fieldLabelText
                  ? ({
                      children: (_: unknown, props: LabelProps) => (
                        <InfoLabel
                          weight="semibold"
                          {...props}
                          {...infoLabelProps}
                          htmlFor={dropdownId}
                        />
                      ),
                    } as unknown as InfoLabelProps)
                  : undefined
              }
              validationState={fieldState.invalid ? 'error' : undefined}
              validationMessage={fieldState.error?.message}
              required={required}
            >
              <Dropdown
                listbox={{
                  className: styles.listbox,
                  children: dropdownOptions,
                }}
                {...dropdownProps}
                id={dropdownId}
                ref={dropdownRef || ref}
                name={name}
                value={displayValue}
                selectedOptions={selectedOptions}
                onOptionSelect={handleOnChange}
                onBlur={handleOnBlur}
                aria-label={dropdownAriaLabel}
              >
                <Show when={!readOnly}>{dropdownOptions}</Show>
              </Dropdown>
            </Field>
          );
        }}
      />
    );
  }
);
