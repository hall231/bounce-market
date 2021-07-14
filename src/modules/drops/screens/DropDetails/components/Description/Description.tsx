import { Box } from '@material-ui/core';
import { useQuery } from '@redux-requests/react';
import { IDropDetails } from 'modules/api/getOneDropsDetail/mappers';
import { ShareIcon } from 'modules/common/components/Icons/ShareIcon';
import { Social } from 'modules/common/components/Social';
import { SocialShare } from 'modules/common/components/SocialShare';
import { getDropDetails } from 'modules/drops/actions/getDropDetails';
import { DropsOwner } from 'modules/drops/components/DropsOwner';
import { NothingFound } from 'modules/drops/components/NothingFound';
import { t } from 'modules/i18n/utils/intl';
import { ProfileRoutesConfig } from 'modules/profile/ProfileRoutes';
import { Button } from 'modules/uiKit/Button';
import React from 'react';
import { Timer } from '../Timer';
import { DescriptionComponent } from './DescriptionComponent';
import { DescriptionSkeleton } from './DescriptionSkeleton';
import { useDescriptionStyles } from './useDescriptionStyles';

export const Description = () => {
  const classes = useDescriptionStyles();

  const { data, loading, pristine } = useQuery<IDropDetails | null>({
    type: getDropDetails.toString(),
  });

  return (
    <Box mb={{ xs: 8, md: 12 }}>
      {loading && <DescriptionSkeleton />}

      {!loading && !pristine && !data && <NothingFound />}

      {!loading && data && (
        <DescriptionComponent
          timer={<Timer endDate={data.dropDate} />}
          title={data.title}
          text={data.description}
          creator={
            <DropsOwner
              title={data.creator}
              avatar={data.avatar}
              href={ProfileRoutesConfig.OtherProfile.generatePath(
                data.accountAddress,
              )}
            />
          }
          share={
            <SocialShare
              // TODO: make the relevant description for sharing
              titleString={`Fangible Drop: ${data.title}`}
              buttonContent={
                <Button
                  className={classes.shareBtn}
                  variant="outlined"
                  rounded
                  startIcon={<ShareIcon />}
                >
                  {t('social.share')}
                </Button>
              }
            />
          }
          social={
            (data.twitter || data.instagram) && (
              <Social twitter={data.twitter} instagram={data.instagram} />
            )
          }
        />
      )}
    </Box>
  );
};