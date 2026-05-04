import { isValidElement } from 'react';

export const getAccessibleLabelText = (label: unknown): string | undefined => {
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

export const getVisibleFieldLabelText = (
  infoLabel: unknown,
  fieldLabel: unknown
): string | undefined => {
  return getAccessibleLabelText(infoLabel) ?? getAccessibleLabelText(fieldLabel);
};
