import {
  Field,
  FieldProps,
  Rating,
  LabelProps,
  InfoLabel,
  InfoLabelProps,
  RatingProps,
  RatingOnChangeEventData,
  RatingDisplay,
  RatingDisplayProps,
} from '@fluentui/react-components';
import { SyntheticEvent, forwardRef } from 'react';
import { useFormContext } from '../Form';
import { Controller, ControllerProps } from 'react-hook-form';
import { getVisibleFieldLabelText } from './accessibility';

export type RatingFieldProps = FieldProps &
  InfoLabelProps &
  RatingProps & {
    name: string;
    rules?: ControllerProps['rules'];
  };

export const RatingField = forwardRef<HTMLInputElement, RatingFieldProps>(
  ({ name, rules, required, ...rest }, ratingRef) => {
    const {
      form: { control },
    } = useFormContext();

    const { ...fieldProps }: FieldProps = rest as unknown as FieldProps;
    const { ...ratingProps }: RatingProps = rest as unknown as RatingProps;
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

          const handleOnChange: RatingProps['onChange'] = (
            ev: Event | SyntheticEvent<Element, Event>,
            data: RatingOnChangeEventData
          ) => {
            onChange(data.value);
            ratingProps.onChange?.(ev, data);
          };

          const handleOnBlur = (ev: React.FocusEvent<HTMLInputElement>) => {
            onBlur();
            ratingProps.onBlur?.(ev);
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
              <Rating
                {...ratingProps}
                ref={ratingRef || ref}
                name={name}
                onChange={handleOnChange}
                onBlur={handleOnBlur}
                value={value || ''}
              />
            </Field>
          );
        }}
      />
    );
  }
);

export type RatingDisplayFieldProps = FieldProps &
  InfoLabelProps &
  RatingDisplayProps & {
    name: string;
    rules?: ControllerProps['rules'];
  };

export const RatingDisplayField = forwardRef<
  HTMLInputElement,
  RatingDisplayFieldProps
>(({ name, rules, required, ...rest }, ratingRef) => {
  const {
    form: { control },
  } = useFormContext();

  const { ...fieldProps }: FieldProps = rest as unknown as FieldProps;
  const { ...ratingProps }: RatingDisplayProps =
    rest as unknown as RatingDisplayProps;
  const { ...infoLabelProps }: InfoLabelProps =
    rest as unknown as InfoLabelProps;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const { value, ref } = field;
        const fieldLabelText = getVisibleFieldLabelText(
          infoLabelProps.label,
          fieldProps.label
        );

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
            <RatingDisplay
              {...ratingProps}
              ref={ratingRef || ref}
              value={value || 0}
            />
          </Field>
        );
      }}
    />
  );
});
