import * as React from 'react';
import {
  Field,
  FieldProps,
  LabelProps,
  InfoLabel,
  InfoLabelProps,
  shorthands,
  mergeClasses,
  makeStyles,
} from '@fluentui/react-components';
import { forwardRef } from 'react';
import { useFormContext } from '../Form';
import { Controller, ControllerProps } from 'react-hook-form';
import { DatePicker, DatePickerProps } from '@fluentui/react-datepicker-compat';
import {
  TimePicker,
  TimePickerProps,
  formatDateToTimeString,
} from '@fluentui/react-timepicker-compat';
import { getControlAriaLabel, getVisibleFieldLabelText } from './accessibility';

export type TimePickerFieldProps = FieldProps &
  InfoLabelProps & {
    name: string;
    dateAnchorName: string;
    rules?: ControllerProps['rules'];
  } & TimePickerProps;

const useStyles = makeStyles({
  root: {
    maxWidth: '600px',
    width: '100%',
    marginBottom: '10px',
  },
  datePickerClass: {
    ...shorthands.flex(70),
  },
  timePickerClass: {
    ...shorthands.flex(30),
    minWidth: '130px',
  },
  timePickerInputClass: {
    minWidth: '100px',
  },
});

export const TimePickerField = forwardRef<
  HTMLInputElement,
  TimePickerFieldProps
>(({ name, dateAnchorName, rules, required, ...rest }, inputRef) => {
  const {
    form: { control, setValue, getValues, watch },
  } = useFormContext();

  const { ...fieldProps }: FieldProps = rest;
  const { ...timePickerProps }: TimePickerProps = rest;
  const { ...infoLabelProps }: InfoLabelProps = rest;

  const [timePickerValue, setTimePickerValue] = React.useState<string>(
    getValues(name) ? formatDateToTimeString(getValues(name)) : ''
  );
  const onTimeChange: TimePickerProps['onTimeChange'] = (_ev, data) => {
    setValue(name, data.selectedTime);
    setTimePickerValue(data.selectedTimeText ?? '');
  };
  const onTimePickerInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setTimePickerValue(ev.target.value);
  };

  const styles = useStyles();

  const dateAnchor = watch(dateAnchorName);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const { value = null, ref } = field;
        const fieldLabelText = getVisibleFieldLabelText(
          infoLabelProps.label,
          fieldProps.label
        );
        const timePickerAriaLabel = getControlAriaLabel({
          explicitAriaLabel: timePickerProps['aria-label'],
          visibleFieldLabel: fieldLabelText,
          placeholder: timePickerProps.placeholder,
          name,
        });

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
              <div style={{ display: 'flex' }}>
                <TimePicker
                  freeform
                  {...timePickerProps}
                  dateAnchor={
                    timePickerProps.dateAnchor || dateAnchor || new Date()
                  }
                  selectedTime={value || null}
                  onTimeChange={onTimeChange}
                  value={timePickerValue}
                  onInput={onTimePickerInput}
                  className={styles.timePickerClass}
                  hourCycle={'h11'}
                  input={{
                    className: styles.timePickerInputClass,
                  }}
                  {...fieldProps}
                  ref={inputRef || ref}
                  aria-label={timePickerAriaLabel}
                />
              </div>
            )}
          </Field>
        );
      }}
    />
  );
});

export const DateTimePickerField = forwardRef<
  HTMLInputElement,
  TimePickerFieldProps & { datePickerProps: DatePickerProps }
>(({ name, rules, required, ...rest }, inputRef) => {
  const {
    form: { control, setValue, getValues },
  } = useFormContext();

  const { ...fieldProps }: FieldProps = rest;
  const { datePickerProps } = rest;
  const { ...timePickerProps } = rest;
  const { ...infoLabelProps }: InfoLabelProps = rest;

  const styles = useStyles();

  const [selectedDate, setSelectedDate] = React.useState<
    Date | null | undefined
  >(getValues(name) ?? null);

  const [selectedTime, setSelectedTime] = React.useState<Date | null>(
    getValues(name) ?? null
  );
  const [timePickerValue, setTimePickerValue] = React.useState<string>(
    selectedTime ? formatDateToTimeString(selectedTime) : ''
  );

  const onSelectDate: DatePickerProps['onSelectDate'] = (date) => {
    setSelectedDate(date);
    if (date && selectedTime) {
      setSelectedTime(
        new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          selectedTime.getHours(),
          selectedTime.getMinutes()
        )
      );
    }
  };

  const onTimeChange: TimePickerProps['onTimeChange'] = (_ev, data) => {
    setSelectedTime(data.selectedTime);
    setTimePickerValue(data.selectedTimeText ?? '');
  };
  const onTimePickerInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setTimePickerValue(ev.target.value);
  };

  React.useEffect(() => {
    if (selectedDate && selectedTime) {
      const newDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes()
      );
      setValue(name, newDate);
    }
  }, [selectedDate, selectedTime, control, name, setValue]);

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
        const datePickerAriaLabel = getControlAriaLabel({
          explicitAriaLabel: datePickerProps['aria-label'],
          visibleFieldLabel: fieldLabelText,
          placeholder: datePickerProps.placeholder,
          name: `${name}-date`,
        });
        const timePickerAriaLabel = getControlAriaLabel({
          explicitAriaLabel: timePickerProps['aria-label'],
          visibleFieldLabel: fieldLabelText,
          placeholder: timePickerProps.placeholder,
          name: `${name}-time`,
        });
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
              <div style={{ display: 'flex' }}>
                <DatePicker
                  placeholder="Select a date..."
                  {...datePickerProps}
                  value={value ?? null}
                  onSelectDate={onSelectDate}
                  className={mergeClasses(
                    styles.datePickerClass,
                    datePickerProps?.className
                  )}
                  {...fieldProps}
                  ref={inputRef || ref}
                  aria-label={datePickerAriaLabel}
                />
                <TimePicker
                  placeholder="Select a time..."
                  freeform
                  {...timePickerProps}
                  dateAnchor={selectedDate ?? undefined}
                  selectedTime={selectedTime ?? undefined}
                  onTimeChange={onTimeChange}
                  value={timePickerValue}
                  onInput={onTimePickerInput}
                  className={styles.timePickerClass}
                  hourCycle={'h11'}
                  input={{
                    className: styles.timePickerInputClass,
                  }}
                  {...fieldProps}
                  aria-label={timePickerAriaLabel}
                />
              </div>
            )}
          </Field>
        );
      }}
    />
  );
});
