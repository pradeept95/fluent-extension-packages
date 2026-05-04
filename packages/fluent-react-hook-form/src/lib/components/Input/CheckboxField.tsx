import {
  Field,
  FieldProps,
  Checkbox,
  CheckboxOnChangeData,
  CheckboxProps,
  LabelProps,
  InfoLabel,
  InfoLabelProps,
  makeStyles,
  mergeClasses,
  tokens,
  useArrowNavigationGroup,
} from '@fluentui/react-components';
import { ReactNode, forwardRef, isValidElement } from 'react';
import { useFormContext } from '../Form';
import { Controller, ControllerProps } from 'react-hook-form';

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

export type CheckboxFieldProps = FieldProps &
  CheckboxProps &
  InfoLabelProps & {
    name: string;
    rules?: ControllerProps['rules'];
    checkedLabel?: string;
    uncheckedLabel?: string;
  };

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({ name, rules, required, ...rest }, CheckboxRef) => {
    const {
      form: { control },
    } = useFormContext();

    const { ...fieldProps }: FieldProps = rest;
    const { ...checkboxProps }: CheckboxProps = rest;
    const { ...infoLabelProps }: InfoLabelProps = rest;

    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => {
          const { onChange, onBlur, value, ref } = field;
          const fieldLabelText =
            getAccessibleLabelText(infoLabelProps.label) ??
            getAccessibleLabelText(fieldProps.label);
          const checkboxLabel =
            checkboxProps.label ??
            (value ? rest.checkedLabel : rest.uncheckedLabel) ??
            fieldLabelText;

          const handleOnChange = (
            ev: React.ChangeEvent<HTMLInputElement>,
            data: CheckboxOnChangeData
          ) => {
            onChange(data.checked);
            checkboxProps.onChange?.(ev, data);
          };

          const handleOnBlur = (ev: React.FocusEvent<HTMLInputElement>) => {
            onBlur();
            checkboxProps.onBlur?.(ev);
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
              <Checkbox
                {...checkboxProps}
                ref={CheckboxRef || ref}
                name={name}
                onChange={handleOnChange}
                onBlur={handleOnBlur}
                checked={value || false}
                label={checkboxLabel}
                aria-label={
                  checkboxProps['aria-label'] ||
                  getAccessibleLabelText(checkboxLabel) ||
                  fieldLabelText ||
                  name
                }
                required={false}
              />
            </Field>
          );
        }}
      />
    );
  }
);

export type CheckboxChoiceOption = {
  label: ReactNode;
  value: string | number | boolean;
  checkboxProps?: CheckboxProps;
  meta?: Record<string, unknown>;
};

export type CheckboxGroupFieldProps = FieldProps &
  InfoLabelProps & {
    name: string;
    layout?: 'horizontal' | 'vertical' | 'both';
    numberOfColumns?: number;
    rules?: ControllerProps['rules'];
    options: CheckboxChoiceOption[];
    onChange?: (value: CheckboxChoiceOption[]) => void;
  };

export const useCheckboxGroupStyles = makeStyles({
  root: {
    display: 'flex',
    rowGap: 0,
    columnGap: tokens.spacingHorizontalS,
  },
  horizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  vertical: {
    flexDirection: 'column',
  },
  both: {
    // show show fix column row grid
    flexDirection: 'row',
    flexWrap: 'wrap',
    '& > *': {
      width: 'calc(100% / var(--max-columns, 4))',
      flex: '1 1 auto',

      // for medium screens
      '@media (max-width: 1024px)': {
        width: 'calc(100% / (var(--max-columns, 3) - 1))',
      },

      // for small screens
      '@media (max-width: 768px)': {
        width: '100%',
      },
    },
  },

  checkboxLabel: {
    alignSelf: 'start',
  },
});

export const CheckboxGroupField = forwardRef<
  HTMLDivElement,
  CheckboxGroupFieldProps
>(
  (
    {
      name,
      rules,
      options,
      required,
      layout = 'both',
      numberOfColumns = 3,
      onChange: _onChange,
      ...rest
    },
    CheckboxRef
  ) => {
    const {
      form: { control },
    } = useFormContext();

    const { ...fieldProps }: FieldProps = rest;
    const { ...infoLabelProps }: InfoLabelProps = rest;

    const attributes = useArrowNavigationGroup({
      axis: layout,
      circular: true,
      memorizeCurrent: true,
    });
    const styles = useCheckboxGroupStyles();

    const styleContext = {
      '--max-columns': numberOfColumns + 1,
    } as React.CSSProperties;

    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => {
          const { onChange, onBlur, value, ref } = field;
          const groupLabelText =
            getAccessibleLabelText(infoLabelProps.label) ??
            getAccessibleLabelText(fieldProps.label) ??
            name;
          const selectedValues = (value || [])?.map(
            (v: CheckboxChoiceOption) => v.value
          );

          const handleOnChange = (
            ev: React.ChangeEvent<HTMLInputElement>,
            data: CheckboxOnChangeData,
            option: CheckboxChoiceOption
          ) => {
            const newValue = data.checked
              ? [...(value || []), option]
              : [...(value || [])].filter((op) => op.value !== option.value);
            onChange(newValue);

            if (_onChange) {
              _onChange(newValue);
            }
          };

          const handleOnBlur = (ev: React.FocusEvent<HTMLInputElement>) => {
            onBlur();
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
              <div
                {...attributes}
                ref={ref}
                className={mergeClasses(styles.root, styles[layout])}
                style={styleContext}
              >
                {(options || []).map((option) => {
                  const { checkboxProps, ...optionRest } = option;
                  const optionAriaLabel =
                    checkboxProps?.['aria-label'] ||
                    getAccessibleLabelText(checkboxProps?.label) ||
                    getAccessibleLabelText(option.label) ||
                    groupLabelText;
                  return (
                    <Checkbox
                      {...checkboxProps}
                      key={`${name}-${option.value}`}
                      id={`${name}-${option.value}`}
                      onChange={(e, data) =>
                        handleOnChange(e, data, optionRest)
                      }
                      onBlur={handleOnBlur}
                      checked={(selectedValues || []).includes(option.value)}
                      aria-label={optionAriaLabel}
                      /* eslint-disable-next-line*/
                      label={{
                        className: styles.checkboxLabel,
                        children: option.label,
                      }}
                      required={false}
                    />
                  );
                })}
              </div>
            </Field>
          );
        }}
      />
    );
  }
);
