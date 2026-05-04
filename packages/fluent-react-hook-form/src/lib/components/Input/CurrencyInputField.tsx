import {
  Field,
  FieldProps,
  Input,
  InputOnChangeData,
  InputProps,
  LabelProps,
  InfoLabel,
  InfoLabelProps,
} from '@fluentui/react-components';
import { forwardRef } from 'react';
import { useFormContext } from '../Form';
import { Controller, ControllerProps } from 'react-hook-form';
import { getVisibleFieldLabelText } from './accessibility';

export type InputFieldProps = FieldProps &
  InputProps &
  InfoLabelProps & { name: string; rules?: ControllerProps['rules'] };

export const formatCurrency = (
  value: string | number,
  format = 'en-US',
  currency = 'USD',
  minimumFractionDigits = 2
): string => {
  try {
    const numberOnlyFromValue = `${value || ''}`
      ?.replace(/,/g, '')
      ?.replace(/^[^-0-9]*/g, '');
    let numberInNumber = Number(numberOnlyFromValue);
    if (isNaN(numberInNumber)) {
      numberInNumber = 0;
    }
    return numberInNumber
      .toLocaleString(format, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: minimumFractionDigits,
      })
      ?.replace('$', '');
  } catch (error) {
    const fakeNumber = Number(0);
    return fakeNumber
      .toLocaleString(format, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: minimumFractionDigits,
      })
      ?.replace('$', '');
  }
};

export const CurrencyInputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ name, rules, required, ...rest }, inputRef) => {
    const {
      form: { control },
    } = useFormContext();

    const { ...fieldProps }: FieldProps = rest;
    const { ...inputProps }: InputProps = rest;
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

          const handleOnChange = (
            ev: React.ChangeEvent<HTMLInputElement>,
            data: InputOnChangeData
          ) => {
            onChange(data.value);
            inputProps.onChange?.(ev, data);
          };

          const handleOnBlur = (ev: React.FocusEvent<HTMLInputElement>) => {
            const currencyValue = formatCurrency(value);
            onBlur();
            onChange(currencyValue);
            inputProps.onBlur?.(ev);
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
              <Input
                {...inputProps}
                ref={inputRef || ref}
                name={name}
                onChange={handleOnChange}
                onBlur={handleOnBlur}
                onFocus={(event) => event.target.select()}
                value={value || ''}
                required={false}
              />
            </Field>
          );
        }}
      />
    );
  }
);
