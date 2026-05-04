import {
  Field,
  FieldProps,
  LabelProps,
  InfoLabel,
  InfoLabelProps,
} from '@fluentui/react-components';
import { forwardRef } from 'react';
import { useFormContext } from '../Form';
import { Controller, ControllerProps } from 'react-hook-form';
import { DatePicker, DatePickerProps } from '@fluentui/react-datepicker-compat';
import { getVisibleFieldLabelText } from './accessibility';

export type DatePickerFieldProps = FieldProps &
  InfoLabelProps &
  DatePickerProps & { name: string; rules?: ControllerProps['rules'] };

export const DatePickerField = forwardRef<
  HTMLInputElement,
  DatePickerFieldProps
>(({ name, rules, required, ...rest }, inputRef) => {
  const {
    form: { control },
  } = useFormContext();

  const { ...fieldProps }: FieldProps = rest;
  const { ...datePickerProps }: DatePickerProps = rest;
  const { ...infoLabelProps }: InfoLabelProps = rest;

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

        const handleOnChange: DatePickerProps['onSelectDate'] = (
          date: Date | null | undefined
        ) => {
          onChange(date || '');
          datePickerProps.onSelectDate?.(date);
        };

        const handleOnBlur = (ev: React.FocusEvent<HTMLInputElement>) => {
          onBlur();
          datePickerProps.onBlur?.(ev);
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
                      />
                    ),
                  } as unknown as InfoLabelProps)
                : undefined
            }
            validationState={fieldState.invalid ? 'error' : undefined}
            validationMessage={fieldState.error?.message}
            required={required}
          >
            <DatePicker
              allowTextInput
              {...datePickerProps}
              ref={inputRef || ref}
              name={name}
              onSelectDate={handleOnChange}
              onBlur={handleOnBlur}
              value={value || ''}
              required={false}
            />
          </Field>
        );
      }}
    />
  );
});
