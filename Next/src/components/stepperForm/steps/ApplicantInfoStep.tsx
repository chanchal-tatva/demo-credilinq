"use client";
import { Box, TextField } from "@mui/material";
import Grid from "@mui/system/Grid";
import MuiPhoneNumber from "material-ui-phone-number-2";
import { Controller, useFormContext } from "react-hook-form";

export default function ApplicantInfoStep() {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Box
      component={"section"}
      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, value, ref } }) => (
              <TextField
                onChange={onChange}
                value={value || ""}
                inputRef={ref}
                id="fullname"
                label="Full Name"
                type="text"
                fullWidth
                error={!!errors.fullName}
                helperText={errors.fullName?.message?.toString()}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            control={control}
            name="position"
            render={({ field: { onChange, value, ref } }) => (
              <TextField
                onChange={onChange}
                value={value || ""}
                inputRef={ref}
                id="position"
                label="Position within company"
                type="text"
                fullWidth
                error={!!errors.position}
                helperText={errors.position?.message?.toString()}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            control={control}
            name="emailAddress"
            render={({ field: { onChange, value, ref } }) => (
              <TextField
                onChange={onChange}
                value={value || ""}
                inputRef={ref}
                id="emailAddress"
                label="Email Address"
                type="email"
                fullWidth
                error={!!errors.emailAddress}
                helperText={errors.emailAddress?.message?.toString()}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            control={control}
            name="reEnterEmailAddress"
            render={({ field: { onChange, value, ref } }) => (
              <TextField
                onChange={onChange}
                value={value || ""}
                inputRef={ref}
                id="reEnterEmailAddress"
                label="Re-enter Email Address"
                type="email"
                fullWidth
                error={!!errors.reEnterEmailAddress}
                helperText={errors.reEnterEmailAddress?.message?.toString()}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            control={control}
            name="mobileNumber"
            render={({
              field: { onChange, value, ref },
              fieldState: { isTouched },
            }) => (
              <MuiPhoneNumber
                onChange={onChange}
                value={value}
                inputProps={{ ref }}
                autoFormat={false}
                defaultCountry="sg"
                onlyCountries={["sg"]}
                label="Mobile Number"
                variant="outlined"
                fullWidth
                error={!!errors.mobileNumber || isTouched}
                helperText={errors.mobileNumber?.message?.toString()}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
