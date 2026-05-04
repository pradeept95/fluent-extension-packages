import {
  Field,
  FieldProps,
  SpinButton,
  SpinButtonOnChangeData,
  SpinButtonProps,
  LabelProps,
  SpinButtonChangeEvent,
  InfoLabel,
  InfoLabelProps,
} from '@fluentui/react-components';
import { forwardRef } from 'react';
import { useFormContext } from '../Form';
import { Controller, ControllerProps } from 'react-hook-form';
import { getVisibleFieldLabelText } from './accessibility';

export type SpinButtonFieldProps = FieldProps &
  SpinButtonProps &
  InfoLabelProps & { name: string; rules?: ControllerProps['rules'] };

export const SpinButtonField = forwardRef<
  HTMLInputElement,
  SpinButtonFieldProps
>(({ name, rules, required, ...rest }, spinButtonRef) => {
  const {
    form: { control },
  } = useFormContext();

  const { ...fieldProps }: FieldProps = rest;
  const { ...spinButtonProps }: SpinButtonProps = rest;
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

        const handleOnChange: SpinButtonProps['onChange'] = (
          ev: SpinButtonChangeEvent,
          data: SpinButtonOnChangeData
        ) => {
          if (data.value !== undefined) {
            onChange(data.value);
          } else if (data.displayValue !== undefined) {
            const newValue = parseFloat(data.displayValue);
            if (!Number.isNaN(newValue)) {
              onChange(newValue);
            } else {
              console.error(`Cannot parse "${data.displayValue}" as a number.`);
            }
          }
          spinButtonProps.onChange?.(ev, data);
        };

        const handleOnBlur: SpinButtonProps['onBlur'] = (
          ev: React.FocusEvent<HTMLInputElement>
        ) => {
          onBlur();
          spinButtonProps.onBlur?.(ev);
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
            <SpinButton
              {...spinButtonProps}
              ref={spinButtonRef || ref}
              name={name}
              onChange={handleOnChange}
              onBlur={handleOnBlur}
              value={value || 0}
              required={false}
            />
          </Field>
        );
      }}
    />
  );
});
