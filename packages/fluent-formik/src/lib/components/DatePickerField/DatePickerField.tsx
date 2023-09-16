import * as React from 'react';
import {
   useId,
   LabelProps,
   FieldProps,
   Field,
} from '@fluentui/react-components';
import { DatePicker, DatePickerProps } from '@fluentui/react-datepicker-compat';
import type { InfoLabelProps } from '@fluentui/react-components/unstable';
import { InfoLabel } from '@fluentui/react-components/unstable';
import { useField, ErrorMessage } from 'formik';
import { useDatePickerStyles } from './useDatePickerField.style';

type DatePickerFieldProps = DatePickerProps &
   FieldProps &
   InfoLabelProps & {
      name: string;
      label?: string;
   };

export const DatePickerField = (props: DatePickerFieldProps) => {
   const inputId = useId('date');
   const { label, name, info, required, ...rest } = props;

   const { ...fieldPros }: FieldProps = rest;
   const { ...infoLabelProps }: InfoLabelProps = rest;
   const { ...datePickerProps }: DatePickerProps = rest;

   const styles = useDatePickerStyles();
   const [_, {value, touched, error }, { setValue, setTouched }] = useField(name);

   const hasError = React.useMemo(
      () => touched && error,
      [touched, error],
   );

   const handleOnChange = React.useCallback(
      (date: Date | null | undefined) => {
         console.log('date', date);
         setValue(date, true);

         props.onSelectDate && props.onSelectDate(date);
      },
      [setValue],
   );

   const handleOnBlur = React.useCallback(() => {
      setTouched(true, true);
   }, [setTouched]);

   return (
      <div className={styles.root}>
         <Field
            {...fieldPros}
            label={
               {
                  children: (_: unknown, props: LabelProps) => (
                     <InfoLabel
                        {...infoLabelProps}
                        htmlFor={inputId}
                        info={info}
                        required={required}
                     >
                        <strong>{label}</strong>
                     </InfoLabel>
                  ),
               } as any
            }
            validationState={hasError ? 'error' : undefined}
            validationMessage={
               hasError ? <ErrorMessage name={name} /> : undefined
            }
         >
            <DatePicker
               {...datePickerProps}
               id={inputId}
               name={name}
               value={(value || null)}
               onSelectDate={(date: Date | null | undefined) => handleOnChange(date)}
               onBlur={handleOnBlur}
            />
         </Field>
      </div>
   );
};

