import {
  Field,
  FieldProps,
  RadioGroup,
  RadioGroupOnChangeData,
  RadioGroupProps,
  LabelProps,
  Radio,
  RadioProps,
  useId,
  InfoLabel,
  InfoLabelProps,
  RadioOnChangeData,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import { ReactNode, forwardRef, isValidElement } from 'react';
import { useFormContext } from '../Form';
import { Controller, ControllerProps } from 'react-hook-form';
import { ChoiceOption } from '@prt-ts/types';

const getAccessibleLabelText = (label: unknown): string | undefined => {
  if (typeof label === 'string') {
    const trimmedLabel = label.trim();
    return trimmedLabel.length > 0 ? trimmedLabel : undefined;
  }

  if (typeof label === 'number') {
    return `${label}`;
  }

  if (Array.isArray(label)) {
    const mergedLabel = label
      .map((item) => getAccessibleLabelText(item))
      .filter((item): item is string => !!item)
      .join(' ')
      .trim();
    return mergedLabel.length > 0 ? mergedLabel : undefined;
  }

  if (isValidElement<{ children?: unknown }>(label)) {
    return getAccessibleLabelText(label.props.children);
  }

  if (label && typeof label === 'object' && 'children' in label) {
    return getAccessibleLabelText((label as { children?: unknown }).children);
  }

  return undefined;
};

const useRadioStyles = makeStyles({
  root: {
    flexWrap: 'wrap',
  },
  disabledOptionContrast: {
    '--colorNeutralForegroundDisabled': tokens.colorNeutralForeground4,
    '--colorNeutralStrokeDisabled': tokens.colorNeutralStrokeAccessible,
  },
});

export type RadioChoiceOption = {
  radioProps?: Partial<RadioProps> | undefined;
} & ChoiceOption;

export type RadioGroupFieldProps = FieldProps &
  RadioGroupProps &
  InfoLabelProps & {
    name: string;
    rules?: ControllerProps['rules'];
    options: RadioChoiceOption[];
  };

export const RadioGroupField = forwardRef<HTMLDivElement, RadioGroupFieldProps>(
  ({ name, options, rules, required, ...rest }, radioGroupRef) => {
    const labelId = useId('radio-input');
    const styles = useRadioStyles();
    const {
      form: { control },
    } = useFormContext();

    const { ...fieldProps }: FieldProps = rest as unknown as FieldProps;
    const { ...radioGroupProps }: RadioGroupProps =
      rest as unknown as RadioGroupProps;
    const { ...infoLabelProps }: InfoLabelProps =
      rest as unknown as InfoLabelProps;

    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => {
          const { onChange, onBlur, value, ref } = field;
          const visibleGroupLabelText =
            getAccessibleLabelText(infoLabelProps.label) ??
            getAccessibleLabelText(fieldProps.label);
          const groupLabelText = visibleGroupLabelText ?? name;
          const ariaLabelledBy =
            radioGroupProps['aria-labelledby'] ||
            (visibleGroupLabelText ? labelId : undefined);
          const ariaLabel =
            radioGroupProps['aria-label'] ||
            (ariaLabelledBy ? undefined : groupLabelText);

          const handleOnChange: RadioGroupProps['onChange'] = (
            ev: React.FormEvent<HTMLDivElement>,
            data: RadioGroupOnChangeData
          ) => {
            const selectedOption = options?.find(
              (option) => `${option.value}` === `${data.value}`
            );

            // remove the radioProps from the selectedOption
            delete selectedOption?.radioProps;

            onChange(selectedOption);
            radioGroupProps.onChange?.(ev, data);
          };

          const handleOnBlur: RadioGroupProps['onBlur'] = (
            ev: React.FocusEvent<HTMLDivElement, Element>
          ) => {
            onBlur();
            radioGroupProps.onBlur?.(ev);
          };

          return (
            <Field
              {...fieldProps}
              label={
                {
                  children: (_: unknown, props: LabelProps) => (
                    <InfoLabel
                      id={labelId}
                      weight="semibold"
                      {...props}
                      {...infoLabelProps}
                    />
                  ),
                } as unknown as InfoLabelProps
              }
              validationState={fieldState.invalid ? 'error' : undefined}
              validationMessage={fieldState.error?.message}
              required={required}
            >
              <RadioGroup
                {...radioGroupProps}
                ref={radioGroupRef || ref}
                onBlur={handleOnBlur}
                value={`${value?.value}` || ''}
                onChange={handleOnChange}
                aria-labelledby={ariaLabelledBy}
                aria-label={ariaLabel}
                required={false}
                className={mergeClasses(styles.root, radioGroupProps.className)}
              >
                {(options || []).map(
                  (
                    { radioProps = {}, ...option }: RadioChoiceOption,
                    index: number
                  ) => {
                    const isDisabled =
                      !!radioGroupProps.disabled || !!radioProps.disabled;
                    const optionAriaLabel =
                      radioProps['aria-label'] ||
                      getAccessibleLabelText(radioProps.label) ||
                      getAccessibleLabelText(option.label) ||
                      groupLabelText;

                    return (
                      <Radio
                        key={`${option.value}-${index}`}
                        value={`${option.value}`}
                        /*eslint-disable-next-line*/
                        label={{
                          children: option.label,
                        }}
                        aria-label={optionAriaLabel}
                        className={mergeClasses(
                          radioProps.className,
                          isDisabled && styles.disabledOptionContrast
                        )}
                        {...radioProps}
                      />
                    );
                  }
                )}
              </RadioGroup>
            </Field>
          );
        }}
      />
    );
  }
);

export type RadioFieldProps = FieldProps &
  Omit<RadioProps, 'value'> &
  InfoLabelProps & {
    name: string;
    rules?: ControllerProps['rules'];
    radioLabel?: ReactNode;
    value: string | number | boolean;
  };

export const RadioField = forwardRef<HTMLInputElement, RadioFieldProps>(
  ({ name, value, radioLabel, rules, required, ...rest }, radioRef) => {
    const {
      form: { control },
    } = useFormContext();

    const { ...fieldProps }: FieldProps = rest;
    const { ...radioProps }: RadioProps = rest as unknown as RadioProps;
    const { ...infoLabelProps }: InfoLabelProps = rest;

    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => {
          const { onChange, onBlur, value, ref } = field;

          const handleOnChange = (
            ev: React.ChangeEvent<HTMLInputElement>,
            data: RadioOnChangeData
          ) => {
            onChange(value);
            radioProps.onChange?.(ev, data);
          };

          const handleOnBlur = (ev: React.FocusEvent<HTMLInputElement>) => {
            onBlur();
            radioProps.onBlur?.(ev);
          };

          return (
            <Field
              {...fieldProps}
              label={
                {
                  children: (_: unknown, props: LabelProps) => (
                    <InfoLabel
                      weight="semibold"
                      {...props}
                      {...infoLabelProps}
                    />
                  ),
                } as unknown as InfoLabelProps
              }
              validationState={fieldState.invalid ? 'error' : undefined}
              validationMessage={fieldState.error?.message}
              required={required}
            >
              <Radio
                {...radioProps}
                ref={radioRef || ref}
                name={name}
                value={`${value}` || ''}
                onChange={handleOnChange}
                onBlur={handleOnBlur}
                /* eslint-disable-next-line */
                label={<>{radioLabel || `${value}`}</>}
                required={false}
              />
            </Field>
          );
        }}
      />
    );
  }
);
