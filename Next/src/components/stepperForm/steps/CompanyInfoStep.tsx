"use client";

import { Box, TextField } from "@mui/material";
import { Grid } from "@mui/system";
import { Controller, useFormContext } from "react-hook-form";

export default function CompanyInfoStep({
  isDisabled,
}: {
  isDisabled: boolean;
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            control={control}
            name="companyUEN"
            render={({
              field: { onChange, value, ref },
              fieldState: { isTouched },
            }) => (
              <TextField
                disabled={isDisabled}
                onChange={onChange}
                value={value || ""}
                inputRef={ref}
                id="company-uen"
                label="Company UEN"
                type="text"
                fullWidth
                error={!!errors.companyUEN || isTouched}
                helperText={errors.companyUEN?.message?.toString()}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            control={control}
            name="companyName"
            render={({ field: { onChange, value, ref } }) => (
              <TextField
                disabled={isDisabled}
                onChange={onChange}
                value={value || ""}
                inputRef={ref}
                id="company-name"
                label="Company Name"
                type="text"
                fullWidth
                error={!!errors.companyName}
                helperText={errors.companyName?.message?.toString()}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
