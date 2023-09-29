/* eslint-disable */
import {
  Card,
  CardPreview,
  CardHeader,
  Caption1,
  Button,
  Text,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import {
  PresenceBlocked24Regular,
} from '@fluentui/react-icons';
import * as React from 'react';

export const AccessDenied: React.FC<{
  additionalInfo?: React.ReactNode;
}> = ({ additionalInfo }) => {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <CardHeader
        image={<PresenceBlocked24Regular className={styles.headerImage} />}
        header={
          <Text weight="semibold" className={styles.text}>
            Access Denied!!!
          </Text>
        }
        description={
          <Caption1 className={styles.caption}>
            You don't have enough permission to access this page. Please contact
            your administrator.
          </Caption1>
        }
      />
      <CardPreview>
        <pre className={styles.cardPreview}>{additionalInfo}</pre>
      </CardPreview>
    </Card>
  );
};

const useStyles = makeStyles({
  card: {
    width: '100%',
    maxWidth: '100%',
    height: 'fit-content',
  },

  headerImage: {
    ...shorthands.borderRadius('4px'),
    maxWidth: '44px',
    maxHeight: '44px',
    width: '44px',
    height: '44px',
    color: tokens.colorPaletteRedForeground1,
  },

  cardPreview: {
    ...shorthands.margin('10px'),
    color: tokens.colorPaletteRedForeground1,
  },

  caption: {
    color: tokens.colorPaletteRedForeground3,
  },

  text: {
    ...shorthands.margin(0),
    color: tokens.colorPaletteRedForeground1,
  },
});
