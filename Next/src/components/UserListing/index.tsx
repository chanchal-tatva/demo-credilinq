"use client";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  getCompanyDetails,
  getCompanyDetailsList,
} from "@/services/company-info";
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from "next/navigation";


// Types
interface UserData {
  id: string;
  companyUEN: string;
  companyName: string;
  fullName: string | null;
  position: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function CompanyDetailsTable() {
  const title = "Company Details";
  const rowsPerPageOptions = [5, 10, 25];
  const defaultRowsPerPage = 5;

  const router = useRouter()

  const [tableData, setTableData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  // Fetch data from API
  useEffect(() => {
    getCompanyDetailsList({ page: 1, limit: 100 })
      .then((response) => {
        const listResult = response.data;
        setTableData(listResult || []);
      })
      .catch((error) => console.log({ error }))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = tableData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Paper sx={{ width: "100%", mt: 2, p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden", mt: 2 }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ p: 2 }}>
            {title}
          </Typography>
          <Button variant="contained" sx={{ mr: 2 }} size="small" onClick={() => router.push('/')}>Add New</Button>
        </div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Company UEN</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Email</TableCell>
                {/* <TableCell>Action</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.length > 0 ? (
                visibleRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.companyUEN}</TableCell>
                    <TableCell>{row.companyName}</TableCell>
                    <TableCell>{row.fullName || "-"}</TableCell>
                    <TableCell>{row.position || "-"}</TableCell>
                    <TableCell>{row.email || "-"}</TableCell>
                    {/* <TableCell>
                      <Button
                        variant="outlined" // use "contained" or "text" as needed
                        startIcon={<EditIcon />}
                        color="primary"
                        size="small" // or "medium", "large"
                        onClick={() => {
                          const newSearchParams = new URLSearchParams(window.location.search);
                          newSearchParams.set("formId", row.id);
                          router.push(`/?${newSearchParams.toString()}`);
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell> */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
