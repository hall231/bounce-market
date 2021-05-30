import { Box, Dialog, Typography } from '@material-ui/core';
import { Mutation, useDispatchRequest } from '@redux-requests/react';
import { uploadFile, IUploadFileArgs, UploadFileType } from 'modules/common/actions/uploadFile';
import { Bytes, convertBytesToMegabytes } from 'modules/common/types/unit';
import { UploadFileField } from 'modules/form/components/UploadFileField';
import { FormErrors } from 'modules/form/utils/FormErrors';
import { t } from 'modules/i18n/utils/intl';
import { Button } from 'modules/uiKit/Button';
import { ModalCloseBtn } from 'modules/uiKit/ModalCloseBtn';
import React, { useCallback } from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { useSetBgImgModalStyles } from './useSetBgImgModalStyles';

const MAX_SIZE: Bytes = 31457280;
const FILE_ACCEPTS: string[] = [
  'image/png',
  'image/jpeg',
  'image/jp2',
  'image/jpm',
];

export interface ISetBgImgValues {
  bgImg: File;
}

const validateForm = (payload: ISetBgImgValues) => {
  const errors: FormErrors<ISetBgImgValues> = {};

  if (!payload.bgImg) {
    errors.bgImg = t('validation.required');
  } else if (!FILE_ACCEPTS.includes(payload.bgImg.type)) {
    errors.bgImg = t('validation.invalid-type');
  } else if (payload.bgImg.size > MAX_SIZE) {
    errors.bgImg = t('validation.max-size', {
      value: convertBytesToMegabytes(MAX_SIZE),
    });
  }

  return errors;
};

interface ISetBgImgModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  fileType: UploadFileType;
  brandId?: number;
}

export const SetBgImgModal = ({
  onClose,
  isOpen = false,
  fileType,
  brandId,
}: ISetBgImgModalProps) => {
  const classes = useSetBgImgModalStyles();
  const dispatch = useDispatchRequest();

  const onSubmit = useCallback(
    (payload: ISetBgImgValues) => {
      const data: IUploadFileArgs = {
        file: payload.bgImg,
        fileType: fileType,
      }
      if (fileType === UploadFileType.BrandImg) {
        data.brandId = brandId
      }
      dispatch(uploadFile(data)).then(
        ({ error }) => {
          if (!error && typeof onClose === 'function') {
            onClose();
          }
        },
      );
    },
    [fileType, brandId, dispatch, onClose],
  );

  const renderForm = ({
    handleSubmit,
    dirty,
  }: FormRenderProps<ISetBgImgValues>) => {
    return (
      <Mutation type={uploadFile.toString()}>
        {({ loading }) => (
          <Box component="form" onSubmit={handleSubmit}>
            <Box mb={5}>
              <Field
                component={UploadFileField}
                name="bgImg"
                disabled={loading}
                acceptsHint={['PNG', 'JPG', 'JPEG2000']}
                accepts={FILE_ACCEPTS}
                className={classes.fileBox}
                cropper={true}
                cropperAspect={16 / 2}
              />
            </Box>

            <Box>
              <Button
                size="large"
                type="submit"
                fullWidth
                disabled={loading || !dirty}
              >
                {loading
                  ? t('common.submitting')
                  : t('profile.edit.save-changes')}
              </Button>
            </Box>
          </Box>
        )}
      </Mutation>
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xl">
      <Box mb={3} textAlign="center">
        <Typography variant="h2">{t('profile.edit-cover')}</Typography>
      </Box>

      <Form onSubmit={onSubmit} render={renderForm} validate={validateForm} />

      <ModalCloseBtn onClick={onClose} />
    </Dialog>
  );
};