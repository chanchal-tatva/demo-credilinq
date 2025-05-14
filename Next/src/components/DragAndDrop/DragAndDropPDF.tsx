import { removeAllUploadedFiles, saveUploadFilesData } from '@/services/company-info';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box, Button, Chip, Typography } from '@mui/material';
import { Grid } from '@mui/system';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import FileUploadChecklist from '../UnorderedListing/FileUploadChecklist';
import { UploadedFile } from '../stepperForm';

type Props = {
  disabled?: boolean;
  onChange: (files: File[]) => void;
  fileType?: string;
  uploadedFilesData?: UploadedFile[];
  submittedFormIdLocal?: string;
};
const DragAndDropPDF = ({ disabled, onChange, uploadedFilesData, submittedFormIdLocal }: Props) => {
  const searchParams = useSearchParams();
  const submittedFormId = searchParams.get('formId');
  const [displayFiles, setDisplayFiles] = useState([] as UploadedFile[]);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > 6) {
        setError('You can only upload up to 6 files');
        return;
      }
      try {
        const resFile = await saveUploadFilesData(
          submittedFormId || (submittedFormIdLocal as string),
          {
            files: acceptedFiles,
          }
        );
        // TODO:
        // const uploadedFiles = acceptedFiles.map((file) => ({
        //   originalname: file.name,
        //   mimetype: file.type,
        //   size: file.size,
        // }));
        setDisplayFiles((prevFiles) => [...prevFiles, ...resFile]);
      } catch (error) {}
      onChange(acceptedFiles);
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      setError('');
    },
    [files]
  );

  useEffect(() => {
    if (uploadedFilesData?.length) {
      setDisplayFiles(uploadedFilesData);

      // Optional: simulate empty File[] to satisfy form APIs
      const simulatedFiles = uploadedFilesData.map((f) => {
        return new File([''], f.originalname, { type: f.mimetype });
      });

      onChange(simulatedFiles);
    }
  }, [uploadedFilesData]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': [],
    },
    disabled: disabled,
    onDrop,
  });

  const handleDelete = (index: number) => {
    const filteredFiles = displayFiles?.filter((_, i) => i !== index);
    setDisplayFiles(filteredFiles as UploadedFile[]);
    // setFiles(updatedFiles);
    // onChange(updatedFiles); // Sync with RHF
  };

  const removeAllChips = async () => {
    setFiles([]);
    onChange([]); // Sync with RHF
    setDisplayFiles([]);
    try {
      await removeAllUploadedFiles(submittedFormId || (submittedFormIdLocal as string));
    } catch (error) {
      console.log({ error });
    }
  };

  const displayFilesList = displayFiles?.map((file, index) => {
    if (file?.mimetype?.includes('application/pdf')) {
      return (
        <Grid
          key={index}
          sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}
          size={{ xs: 'auto' }}
        >
          <Chip
            label={file.originalname}
            variant="outlined"
            onClick={() => {}}
            onDelete={file.error ? () => handleDelete(index) : undefined}
            color={file.error ? 'error' : 'success'}
            icon={<RestartAltIcon />}
            sx={{
              height: 45,
              width: 'auto',
              fontSize: '1rem',
              '.MuiChip-icon': {
                fontSize: 24, // icon size
              },
              borderRadius: 200,
            }}
          />
          {file.error && (
            <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
              {file.error_message}
            </Typography>
          )}
        </Grid>
      );
    } else {
      return <></>;
    }
  });

  return (
    <Grid sx={{ paddingLeft: '8px' }} container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Box
          sx={{
            pointerEvents: disabled ? 'none' : 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '40px',
            borderWidth: '1px',
            borderRadius: '4px',
            borderColor: 'lightgray',
            borderStyle: ' dashed',
            backgroundColor: '#fafafa',
            color: '#bdbdbd',
            outline: 'none',
            transition: 'border 0.24s ease-in-out',
          }}
          {...getRootProps({ className: 'dropzone' })}
        >
          <input {...getInputProps()} />
          <UploadFileIcon color="primary" fontSize="large" />
          <Typography color="primary" sx={{ mt: 1 }}>
            <u>Click to upload</u> or drag and drop Bank Statements
          </Typography>
        </Box>
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Box sx={{ mt: 2 }}>
          <Grid size={{ xs: 12 }}>
            <FileUploadChecklist />
          </Grid>
        </Box>
      </Grid>
      <Grid size={{ xs: 12 }} container spacing={2}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>{displayFilesList}</Box>
          {displayFiles?.length ? (
            <Button
              type="button"
              onClick={() => removeAllChips()}
              sx={{ marginTop: '1rem' }}
              variant="text"
            >
              REMOVE ALL
            </Button>
          ) : null}
        </Box>
      </Grid>
    </Grid>
  );
};

export default DragAndDropPDF;
