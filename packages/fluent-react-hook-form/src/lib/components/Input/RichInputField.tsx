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
import {
  FluentEditor,
  FluentEditorProps,
} from '@prt-ts/fluent-input-extensions';
import { getVisibleFieldLabelText } from './accessibility';

export type RichInputFieldProps = FieldProps &
  FluentEditorProps &
  InfoLabelProps & { name: string; rules?: ControllerProps['rules'] };

export const RichInputField = forwardRef<HTMLDivElement, RichInputFieldProps>(
  ({ name, rules, required, style, className, ...rest }, editorRef) => {
    const {
      form: { control },
    } = useFormContext();

    const { ...fieldProps }: FieldProps = rest as unknown as FieldProps;
    const { ...fluentEditorProps }: FluentEditorProps =
      rest as unknown as FluentEditorProps;
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
              {(fieldProps) => (
                <FluentEditor
                  {...fluentEditorProps}
                  ref={editorRef || ref}
                  value={value}
                  onChange={(value: string | undefined) => {
                    onChange(value);
                    fluentEditorProps.onChange?.(value);
                  }}
                  onBlur={onBlur}
                  {...fieldProps}
                  style={style}
                  className={className}
                />
              )}
            </Field>
          );
        }}
      />
    );
  }
);

// @deprecated
export const RichViewerField = forwardRef<HTMLDivElement, RichInputFieldProps>(
  ({ name, rules, required, ...rest }, editorProps) => {
    const {
      form: { control },
    } = useFormContext();

    const { ...fieldProps }: FieldProps = rest as unknown as FieldProps;
    const { ...fluentEditorProps }: FluentEditorProps =
      rest as unknown as FluentEditorProps;
    const { ...infoLabelProps }: InfoLabelProps =
      rest as unknown as InfoLabelProps;

    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => {
          const { value, onBlur, ref } = field;
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
              {(fieldProps) => (
                <FluentEditor
                  {...fluentEditorProps}
                  ref={editorProps || ref}
                  value={value}
                  onBlur={onBlur}
                  {...fieldProps}
                  // make it readonly
                  readOnly={true}
                  showRibbon={false}
                />
              )}
            </Field>
          );
        }}
      />
    );
  }
);
