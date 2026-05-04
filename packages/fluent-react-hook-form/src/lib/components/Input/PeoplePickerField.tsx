/* eslint-disable  */
import * as React from 'react';
import {
  Field,
  FieldProps,
  LabelProps,
  tokens,
  useId,
} from '@fluentui/react-components';
import { InfoLabel, InfoLabelProps } from '@fluentui/react-components';
import { Controller } from 'react-hook-form';
import {
  PeopleInput,
  PeopleInputProps,
  PeopleInputRef,
} from '@prt-ts/fluent-input-extensions';
import { useFormContext } from '../Form';
import { getVisibleFieldLabelText } from './accessibility';

export type PeoplePickerProps = Omit<PeopleInputProps, 'value'> &
  InfoLabelProps &
  Omit<FieldProps, 'size'> & {
    name: string;
    rules?: any;
  };

export const PeoplePickerField = React.forwardRef<
  PeopleInputRef,
  PeoplePickerProps
>(({ name, label, rules, required, style, className, ...props }, ref) => {
  const { ...fieldsProps }: FieldProps = props;
  const { ...infoLabelProps }: InfoLabelProps = props;
  const { ...peoplePickerProps }: PeopleInputProps = props;

  const inputId = useId('people-picker');
  const {
    form: { control, setError, clearErrors },
  } = useFormContext();

  const onError = (errorMessage?: string) => {
    if (!errorMessage) {
      clearErrors(name);
      return;
    }
    setError(
      name,
      { type: 'manual', message: errorMessage },
      { shouldFocus: true }
    );
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const { value, onChange, onBlur, ref: fieldRef } = field;
        const fieldLabelText = getVisibleFieldLabelText(
          label,
          fieldsProps.label
        );
        return (
          <Field
            {...fieldsProps}
            label={
              fieldLabelText
                ? ({
                    children: (_: unknown, props: LabelProps) => (
                      <InfoLabel
                        weight="semibold"
                        {...infoLabelProps}
                        {...props}
                        htmlFor={inputId}
                        style={{
                          marginBottom: tokens.spacingVerticalXXS,
                          paddingBottom: tokens.spacingVerticalXXS,
                          paddingTop: tokens.spacingVerticalXXS,
                        }}
                      >
                        {fieldLabelText}
                      </InfoLabel>
                    ),
                  } as LabelProps)
                : undefined
            }
            validationState={fieldState.invalid ? 'error' : undefined}
            validationMessage={fieldState.error?.message}
            required={required}
            style={{ padding: 0, margin: 0 }}
          >
            <PeopleInput
              {...peoplePickerProps}
              id={inputId}
              value={value}
              onUserSelectionChange={(users) => {
                onChange(users);
                if (peoplePickerProps?.onUserSelectionChange) {
                  peoplePickerProps?.onUserSelectionChange?.(users);
                }
              }}
              onBlur={onBlur}
              onInternalError={onError}
              ref={ref || fieldRef}
              style={style}
              className={className}
            />
          </Field>
        );
      }}
    />
  );
});
