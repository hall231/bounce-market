import { Box, Button, Grid, Typography } from '@material-ui/core';
import { LayersIcon } from 'modules/common/components/Icons/LayersIcon';
import { t } from 'modules/i18n/utils/intl';
import Truncate from 'react-truncate';
import { useInfoDescrStyles } from './useInfoDescrStyles';
import { useInfoDescrToggle } from './useInfoDescrToggle';

const DESCR_LINES = 3;

interface IInfoDescrProps {
  title: string;
  description: string;
  creator: JSX.Element;
  owner: JSX.Element;
  copiesCurrent?: string | number;
  copiesTotal?: string | number;
}

export const InfoDescr = ({
  title,
  description,
  creator,
  owner,
  copiesCurrent = 0,
  copiesTotal = 0,
}: IInfoDescrProps) => {
  const classes = useInfoDescrStyles();
  const {
    toggleExpanded,
    onTruncate,
    expanded,
    truncated,
  } = useInfoDescrToggle();

  return (
    <>
      <Box mb={3}>
        <Typography variant="h2" className={classes.title}>
          {title}
        </Typography>
      </Box>

      <Grid container spacing={3} alignItems="center">
        <Grid item xs>
          {creator}
        </Grid>

        <Grid item xs>
          {owner}
        </Grid>

        <Grid item xs="auto">
          <div className={classes.copies}>
            <LayersIcon className={classes.copiesIcon} />
            {`${copiesCurrent}/${copiesTotal}`}
          </div>
        </Grid>
      </Grid>

      <Box component="hr" className={classes.hr} my={3.5} />

      <Box className={classes.description}>
        <Truncate
          lines={!expanded && DESCR_LINES}
          onTruncate={onTruncate}
          ellipsis={
            <>
              ...
              <br />
              <Button
                className={classes.textToggle}
                variant="text"
                onClick={toggleExpanded(true)}
              >
                {t('details-nft.descr-full')} ⬇
              </Button>
            </>
          }
        >
          {description}
        </Truncate>

        {!truncated && expanded && (
          <Box>
            <Button
              className={classes.textToggle}
              variant="text"
              onClick={toggleExpanded(false)}
            >
              {t('details-nft.descr-short')} ⬇
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};