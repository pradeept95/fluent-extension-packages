import {
  Field,
  FieldProps,
  Combobox,
  ComboboxProps,
  Option,
  LabelProps,
  OptionProps,
  useId,
  InfoLabel,
  InfoLabelProps,
} from '@fluentui/react-components';
import { forwardRef } from 'react';
import { useFormContext } from '../Form';
import { Controller, ControllerProps } from 'react-hook-form';
import { getControlAriaLabel, getVisibleFieldLabelText } from './accessibility';

export type ComboboxChoiceOption = {
  label: string;
  value: string;

  optionProps?: Partial<OptionProps> | undefined;
};

type OptionOnly = Omit<ComboboxChoiceOption, 'optionProps'>;

export type ComboboxFieldProps = FieldProps &
  ComboboxProps &
  InfoLabelProps & {
    name: string;
    options: ComboboxChoiceOption[];
    rules?: ControllerProps['rules'];
  };

export const ComboboxField = forwardRef<HTMLInputElement, ComboboxFieldProps>(
  ({ name, options, rules, required, ...rest }, comboboxRef) => {
    const comboboxId = useId('Combobox');
    const {
      form: { control },
    } = useFormContext();

    const { ...fieldProps }: FieldProps = rest as unknown as FieldProps;
    const { ...comboboxProps }: ComboboxProps =
      rest as unknown as ComboboxProps;
    const { ...infoLabelProps }: InfoLabelProps =
      rest as unknown as InfoLabelProps;

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
          const comboboxAriaLabel = getControlAriaLabel({
            explicitAriaLabel: comboboxProps['aria-label'],
            visibleFieldLabel: fieldLabelText,
            placeholder: comboboxProps.placeholder,
            name,
          });

          const displayValue =
            (value as OptionOnly[])?.map((v) => v.label)?.join(', ') || '';
          const selectedOptions =
            (value as OptionOnly[])?.map((v) => v.value) || [];

          const handleOnChange: ComboboxProps['onOptionSelect'] = (
            ev,
            data
          ) => {
            const mappedOptions = [...options]?.map(
              (option) =>
                ({ label: option.label, value: option.value } as OptionOnly)
            );
            const selectedOptions = mappedOptions?.filter((option) =>
              data?.selectedOptions?.includes(option.value)
            );
            onChange(selectedOptions);
            comboboxProps?.onOptionSelect?.(ev, data);
          };

          const handleOnBlur: ComboboxProps['onBlur'] = (ev) => {
            onBlur();
            comboboxProps?.onBlur?.(ev);
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
                          htmlFor={comboboxId}
                        />
                      ),
                    } as unknown as InfoLabelProps)
                  : undefined
              }
              validationState={fieldState.invalid ? 'error' : undefined}
              validationMessage={fieldState.error?.message}
              required={required}
            >
              <Combobox
                {...comboboxProps}
                id={comboboxId}
                ref={comboboxRef || ref}
                name={name}
                value={displayValue}
                selectedOptions={selectedOptions}
                onOptionSelect={handleOnChange}
                onBlur={handleOnBlur}
                aria-label={comboboxAriaLabel}
              >
                {(options || []).map(
                  (option: ComboboxChoiceOption, index: number) => (
                    <Option
                      key={`${comboboxId}-${option.value || '__'}-${index}`}
                      {...(option?.optionProps || {})}
                      value={option?.value}
                    >
                      {option?.label}
                    </Option>
                  )
                )}
              </Combobox>
            </Field>
          );
        }}
      />
    );
  }
);
