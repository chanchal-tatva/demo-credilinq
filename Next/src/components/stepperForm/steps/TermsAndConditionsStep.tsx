'use client';
import TermsAndConditionCheckList from '@/components/UnorderedListing/TermsAndConditionCheckList';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import { useFormContext } from 'react-hook-form';

export default function TermsAndConditionsStep({ isDisabled }: { isDisabled: boolean }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Box>
      <FormControlLabel
        disabled={isDisabled}
        control={<Checkbox {...register('agreeToTerms')} />}
        label=" By ticking, you are confirming that you have understood and are agreeing to the details
        mentioned"
        sx={{ color: 'grey' }}
      />
      <TermsAndConditionCheckList />
    </Box>
  );
}
