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
import { Calendar } from '@fluentui/react-calendar-compat';
import type { CalendarProps } from '@fluentui/react-calendar-compat';
import { getVisibleFieldLabelText } from './accessibility';

export {
  DateRangeType,
  DayOfWeek,
  addDays,
  getDateRangeArray,
  getMonthEnd,
  getMonthStart,
  getStartDateOfWeek,
  getWeekNumbersInMonth,
} from '@fluentui/react-calendar-compat';

export type CalendarFieldProps = FieldProps &
  InfoLabelProps &
  CalendarProps & { name: string; rules?: ControllerProps['rules'] };

export const CalendarField = forwardRef<HTMLInputElement, CalendarFieldProps>(
  ({ name, rules, required, ...rest }, inputRef) => {
    const {
      form: { control, setValue },
    } = useFormContext();

    const { ...fieldProps }: FieldProps = rest;
    const { ...calendarProps }: CalendarProps = rest;
    const { ...infoLabelProps }: InfoLabelProps = rest;

    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => {
          const { onChange, value, ref } = field;
          const fieldLabelText = getVisibleFieldLabelText(
            infoLabelProps.label,
            fieldProps.label
          );

          const handleOnChange: CalendarProps['onSelectDate'] = (
            date: Date | null,
            selectedDateRangeArray?: Date[] | undefined
          ) => {
            // const validDateValue = isNaN(date?.getTime() || 0) ? null : date;

            onChange(date || '');
            calendarProps.onSelectDate?.(date as Date, selectedDateRangeArray);

            if (selectedDateRangeArray) {
              setValue(
                `${name}_selectedDateRangeArray`,
                selectedDateRangeArray
              );
            }
          };

          // const handleOnBlur = (ev: React.FocusEvent<HTMLInputElement>) => {
          //   onBlur();
          // };

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
              <Calendar
                {...calendarProps}
                ref={inputRef || ref}
                onSelectDate={handleOnChange}
                value={value || new Date()}
              />
            </Field>
          );
        }}
      />
    );
  }
);
