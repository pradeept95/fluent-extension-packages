import { Button } from '@fluentui/react-components';
import { TagInput } from '@prt-ts/fluent-input-extensions';
import {
  Combobox,
  Form,
  Input,
  TagPicker,
  useForm,
  yupResolver,
} from '@prt-ts/fluent-react-hook-form';
import * as React from 'react';
import * as Yup from 'yup';

const options = [
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
];

const InputSchema = Yup.object().shape({
  field1: Yup.string().required('Field 1 is required'),
  field2: Yup.string().max(10, 'Field 2 must be less than 10 characters'),
  field3: Yup.string().min(5, 'Field 3 must be at least 5 characters'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .min(10, 'Phone number must be at least 10 characters')
    .max(15, 'Phone number must be at most 15 characters'),

  tagPicker: Yup.array().min(1, 'Tag Picker is required'),
  numberValue0: Yup.number(),
  numberValueNull: Yup.number().nullable(),
});

type InputFormValues = Yup.InferType<typeof InputSchema>;

export const InputExample: React.FC = () => {
  const form = useForm<InputFormValues>({
    values: {
      field1: '',
      field2: 'with initial value',
      field3: '',
      tagPicker: ['One'],

      numberValue0: 0,
      numberValueNull: null,
    },
    resolver: yupResolver(InputSchema),
  });

  const handleSubmit = (values: InputFormValues) => {
    console.log(values);
  };

  const pickerValue = form.watch('tagPicker');

  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  return (
    <div style={{ maxWidth: '400px', margin: '0px auto' }}>
      <Form form={form} onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Input
            name="field1"
            label="Small Field"
            placeholder={'field 1'}
            hint={<>Hint</>}
            info={<>Info</>}
            size={'small'}
            required
          />
          <Input
            name="field2"
            label="Medium Field"
            placeholder={'field 2'}
            hint={<>Hint</>}
            info={<>Info</>}
          />
          <Input
            name="field3"
            label="Large Field"
            placeholder={'field 3'}
            hint={<>Hint</>}
            info={<>Info</>}
            size={'large'}
          />
          <Input
            name="phoneNumber"
            fieldMask="phone"
            label="Phone Number"
            placeholder={'Phone Number'}
            hint={<>Enter number, it will automatically format</>}
            info={<>some phone number info</>}
          />
          <Input
            name="currency"
            fieldMask="currency"
            label="Currency Input"
            placeholder={'Currency Input'}
            hint={<>Enter number, it will automatically format</>}
            info={<>some phone number info</>}
          />

          <Input
            name="numberValue0"
            label="Number input with 0 default value"
            placeholder={'Number Input'}
          />

          <Input
            name="numberValueNull"
            label="Number input with null default value"
            placeholder={'Number Input'}
          />

          <TagPicker
            name="tagPicker"
            label="Tag Picker"
            placeholder={'Tag Picker'}
            hint={<>No freeform, No multiselect</>}
            info={<>some phone number info</>}
            // freeform={false}
            // multiselect={false}
            suggestions={options}
            disabled
          />
          <TagPicker
            name="tagPicker1"
            label="Tag Picker"
            placeholder={'Enter tag'}
            hint={<>Freeform, No multiselect</>}
            info={<>some phone number info</>}
            freeform={true}
            multiselect={false}
            suggestions={options}
          />
          <TagPicker
            name="tagPicker3"
            label="Tag Picker"
            placeholder={'Tag Picker'}
            hint={<>No freeform, Multiselect</>}
            info={<>some phone number info</>}
            freeform={false}
            multiselect={true}
            suggestions={options}
          />
          <TagPicker
            name="tagPicker2"
            label="Tag Picker"
            placeholder={'Tag Picker'}
            hint={<>Freeform, Multiselect</>}
            info={<>some phone number info</>}
            freeform={true}
            multiselect={true}
            suggestions={options}
            appearance="filled-darker"
          />

          <TagInput
            placeholder={'Tag Input'}
            value={selectedTags}
            onTagSelect={(tags) => setSelectedTags(tags)}
            suggestions={options}
          />

          <Combobox
            name="combobox"
            label="Combobox"
            placeholder={'Combobox'}
            hint={<>Hint</>}
            info={<>Info</>}
            options={[
              { value: '1', label: 'One' },
              { value: '2', label: 'Two' },
              { value: '3', label: 'Three' },
            ]}
            multiselect
          />

          <Button type="submit" appearance="primary">
            Submit
          </Button>

          <pre>{JSON.stringify(pickerValue, null, 2)}</pre>
        </div>
      </Form>
    </div>
  );
};
