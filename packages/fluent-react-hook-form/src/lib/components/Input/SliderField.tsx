import {
  Field,
  FieldProps,
  Slider,
  SliderOnChangeData,
  SliderProps,
  LabelProps,
  InfoLabel,
  InfoLabelProps,
} from '@fluentui/react-components';
import { forwardRef } from 'react';
import { useFormContext } from '../Form';
import { Controller, ControllerProps } from 'react-hook-form';
import { getVisibleFieldLabelText } from './accessibility';

export type SliderFieldProps = FieldProps &
  SliderProps &
  InfoLabelProps & {
    name: string;
    rules?: ControllerProps['rules'];
  };

export const SliderField = forwardRef<HTMLInputElement, SliderFieldProps>(
  ({ name, rules, required, ...rest }, SliderRef) => {
    const {
      form: { control },
    } = useFormContext();

    const { ...fieldProps }: FieldProps = rest;
    const { ...sliderProps }: SliderProps = rest;
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

          const handleOnChange: SliderProps['onChange'] = (
            ev: React.ChangeEvent<HTMLInputElement>,
            data: SliderOnChangeData
          ) => {
            onChange(data.value);
            sliderProps.onChange?.(ev, data);
          };

          const handleOnBlur: SliderProps['onBlur'] = (
            ev: React.FocusEvent<HTMLInputElement>
          ) => {
            onBlur();
            sliderProps.onBlur?.(ev);
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
              <Slider
                {...sliderProps}
                ref={SliderRef || ref}
                name={name}
                onChange={handleOnChange}
                onBlur={handleOnBlur}
                value={+(value || 0)}
                required={false}
              />
            </Field>
          );
        }}
      />
    );
  }
);
