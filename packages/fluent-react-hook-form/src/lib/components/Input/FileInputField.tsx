import {
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableCellActions,
  TableCellLayout,
  Button,
  Field,
  LabelProps,
  FieldProps,
  InfoLabel,
  InfoLabelProps,
  useFocusableGroup,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Tooltip,
  tokens,
  Link,
} from '@fluentui/react-components';
import { forwardRef } from 'react';
import { useFormContext } from '../Form';
import { Controller, ControllerProps } from 'react-hook-form';

import {
  ArrowDownloadFilled,
  DocumentCheckmark20Regular,
  DismissRegular,
} from '@fluentui/react-icons';
import { FileInfo } from '@prt-ts/types';
import { FilePicker, FilePickerProps } from '@prt-ts/fluent-input-extensions';
import { For, Show } from '@prt-ts/react-control-flow';
import { getVisibleFieldLabelText } from './accessibility';

export type FileInputFieldProps = FieldProps &
  InfoLabelProps &
  FilePickerProps & {
    name: string;
    savedFiles?: FileInfo[];
    onRemoveSavedFile?: (file: FileInfo) => void;
    rules?: ControllerProps['rules'];
    maxFilePreviewWindowHeight?: string;
  };

export const FileInputField = forwardRef<HTMLInputElement, FileInputFieldProps>(
  (
    {
      name,
      required,
      savedFiles = [],
      placeholder,
      onRemoveSavedFile,
      rules,
      maxFilePreviewWindowHeight = '200px',
      size = 'medium',
      ...rest
    },
    inputRef
  ) => {
    const {
      form: { control },
    } = useFormContext();

    const { ...fieldProps }: FieldProps = rest;
    const { ...filePickerProps }: FilePickerProps = rest;
    const { ...infoLabelProps }: InfoLabelProps = rest;

    const focusGroupAttributes = useFocusableGroup({ tabBehavior: 'limited' });

    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => {
          const { onChange, value = [], ref } = field;
          const fieldLabelText = getVisibleFieldLabelText(
            infoLabelProps.label,
            fieldProps.label
          );

          const validationMessage = fieldState.error?.message;
          const validationState =
            fieldState.invalid || validationMessage?.length
              ? 'error'
              : undefined;

          return (
            <>
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
                validationState={validationState}
                validationMessage={validationMessage}
                required={required}
              >
                <FilePicker
                  {...filePickerProps}
                  ref={inputRef || ref}
                  value={value}
                  onChange={(files: File[]) => {
                    onChange(files);
                  }}
                  invalid={validationState === 'error'}
                  placeholder={placeholder}
                />
              </Field>
              <Show when={savedFiles?.length > 0}>
                <div>
                  <Table aria-label="All Documents" size="extra-small">
                    <TableBody {...focusGroupAttributes} tabIndex={0}>
                      <For each={savedFiles}>
                        {(file, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <TableCellLayout
                                media={<DocumentCheckmark20Regular />}
                                appearance="primary"
                              >
                                <Link
                                  appearance="subtle"
                                  href={file.path}
                                  target="_blank"
                                  data-interception="off"
                                >
                                  <i>{file.name}</i>
                                </Link>
                              </TableCellLayout>
                              <TableCellActions>
                                <Button
                                  icon={<ArrowDownloadFilled />}
                                  appearance="subtle"
                                  onClick={() => {
                                    window.open(file.path);
                                  }}
                                />

                                {onRemoveSavedFile && (
                                  <Popover
                                    withArrow
                                    trapFocus
                                    positioning={'below-start'}
                                  >
                                    <PopoverTrigger disableButtonEnhancement>
                                      <Tooltip
                                        content={<>Remove file</>}
                                        relationship="description"
                                      >
                                        <Button
                                          icon={
                                            <DismissRegular
                                              primaryFill={
                                                tokens.colorPaletteRedForeground1
                                              }
                                            />
                                          }
                                          size="small"
                                          shape={'circular'}
                                          appearance="subtle"
                                        />
                                      </Tooltip>
                                    </PopoverTrigger>

                                    <PopoverSurface
                                      tabIndex={-1}
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '5px',
                                      }}
                                    >
                                      <b>
                                        <span role="img" aria-label="warning">
                                          ⚠️
                                        </span>{' '}
                                        Are you sure you want to remove this
                                        file?
                                      </b>
                                      <i>File: {file.name}</i>
                                      <div
                                        style={{
                                          display: 'flex',
                                          gap: '5px',
                                          alignItems: 'right',
                                          justifyContent: 'end',
                                        }}
                                      >
                                        <Button
                                          size="small"
                                          appearance="primary"
                                          onClick={() =>
                                            onRemoveSavedFile?.(file)
                                          }
                                        >
                                          Remove file
                                        </Button>
                                      </div>
                                    </PopoverSurface>
                                  </Popover>
                                )}
                              </TableCellActions>
                            </TableCell>
                          </TableRow>
                        )}
                      </For>
                    </TableBody>
                  </Table>
                </div>
              </Show>
            </>
          );
        }}
      />
    );
  }
);
