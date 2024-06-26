import { makeStyles, shorthands, tokens } from '@fluentui/react-components';

export const useEditorStyle = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.borderTop(
      tokens.strokeWidthThin,
      'solid',
      tokens.colorNeutralStroke1Pressed
    ),
    ...shorthands.borderLeft(
      tokens.strokeWidthThin,
      'solid',
      tokens.colorNeutralStroke1Pressed
    ),
    ...shorthands.borderRight(
      tokens.strokeWidthThin,
      'solid',
      tokens.colorNeutralStroke1Pressed
    ),
    ...shorthands.borderBottom(
      tokens.strokeWidthThin,
      'solid',
      tokens.colorNeutralStrokeAccessiblePressed
    ),
    ...shorthands.borderRadius(
      tokens.borderRadiusMedium,
      tokens.borderRadiusMedium,
      tokens.borderRadiusMedium,
      tokens.borderRadiusMedium
    ),

    ':after': {
      content: "''",
      ...shorthands.borderBottom(
        tokens.strokeWidthThin,
        'solid',
        tokens.colorNeutralStroke1
      ),
      transform: 'scaleX(0)',
      transitionProperty: 'transform',
      transitionDuration: tokens.durationNormal,
      transitionDelay: tokens.curveDecelerateMid,
    },
  },
  rootFocused: {
    ':after': {
      content: "''",
      ...shorthands.borderBottom(
        tokens.strokeWidthThin,
        'solid',
        tokens.colorCompoundBrandStrokePressed
      ),
      transform: 'scaleX(1)',
      transitionProperty: 'transform',
      transitionDuration: tokens.durationNormal,
      transitionDelay: tokens.curveDecelerateMid,
    },
  },
  top: {
    ...shorthands.borderBottom(
      tokens.strokeWidthThin,
      'solid',
      tokens.colorNeutralStroke1
    ),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    boxShadow: tokens.shadow2,
  },
  bottom: {
    // ...shorthands.borderTop(tokens.strokeWidthThin, "solid", tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    boxShadow: tokens.shadow2,
  },

  editor: {
    display: 'block',
    width: `calc(100% - ${tokens.spacingHorizontalM} * 2)`,
    minWidth: '250px',
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border(0),

    backgroundColor: `${tokens.colorNeutralBackground1}!important`,
    color: `${tokens.colorNeutralForeground1}!important`,
    ...shorthands.outline(0, 'solid', 'transparent'),
  },

  small: {
    minHeight: '40px',
    // maxHeight: "30vh",
    // overflowY: "auto",
  },
  medium: {
    minHeight: '60px',
    // maxHeight: "50vh",
    // overflowY: "auto",
  },
  large: {
    minHeight: '100px',
    // maxHeight: "70vh",
    // overflowY: "auto",
  },

  invalid: {
    ...shorthands.border(
      tokens.strokeWidthThin,
      'solid',
      tokens.colorPaletteRedBorder2
    ),
  },
});
