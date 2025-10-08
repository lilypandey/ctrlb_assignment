import React, { useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, TextField, Button, 
  Stack, IconButton, TableSortLabel, TablePagination, } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

function descendingComparator(a, b, orderBy) {
  const aValue = isNaN(a[orderBy]) ? a[orderBy] : Number(a[orderBy]);
  const bValue = isNaN(b[orderBy]) ? b[orderBy] : Number(b[orderBy]);

  if (bValue < aValue) return -1;
  if (bValue > aValue) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilized = array.map((el, index) => [el, index]);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}

const TablePanel = ({ title = "Table", rows, setRows, theme }) => {
  const [editingRowId, setEditingRowId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [order, setOrder] = useState(() => sessionStorage.getItem("tableOrder") || null);
  const [orderBy, setOrderBy] = useState(() => sessionStorage.getItem("tableOrderBy") || null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const tableContainerRef = useRef(null);

  React.useEffect(() => {
    if (orderBy) {
      sessionStorage.setItem("tableOrder", order);
      sessionStorage.setItem("tableOrderBy", orderBy);
    }
  }, [order, orderBy]);

  const isDark = theme === "dark";
  const colors = {
    bg: isDark ? "#0F172A" : "#ffffff",
    surface: isDark ? "#1E293B" : "#f9fafb",
    border: isDark ? "#334155" : "#e5e7eb",
    text: isDark ? "#E2E8F0" : "#111827",
    muted: isDark ? "#94A3B8" : "#6b7280",
    hover: isDark ? "#273549" : "#f3f4f6",
    accent: "#6366F1",
    selected: isDark ? "#312E81" : "rgba(99,102,241,0.08)",
  };

  const handleAddRow = () => {
    const newRow = {
      id: crypto.randomUUID(),
      name: "New Month",
      uv: 0,
      pv: 0,
      amt: 0,
      selected: false,
    };

    const newRows = [...rows, newRow];
    setRows(newRows);

    const totalPages = Math.ceil(newRows.length / rowsPerPage);
    setPage(totalPages - 1);

    setTimeout(() => {
      if (tableContainerRef.current) {
        tableContainerRef.current.scrollTo({
          top: tableContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  const handleDeleteRow = (id) => setRows(rows.filter((r) => r.id !== id));

  const handleDeleteSelected = () => setRows(rows.filter((r) => !r.selected));

  const handleToggleSelect = (id) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r)));

  const handleToggleSelectAll = (e) =>
    setRows(rows.map((r) => ({ ...r, selected: e.target.checked })));

  const handleEdit = (row) => {
    setEditingRowId(row.id);
    setEditValues({ name: row.name, uv: row.uv, pv: row.pv });
  };
  
  const handleSave = (id) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, ...editValues } : r)));
    setEditingRowId(null);
    setEditValues({});
  };

  const handleRequestSort = (property) => {
    if (orderBy === property) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setOrder("asc");
      setOrderBy(property);
    }
  };

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const visibleRows = stableSort(rows, getComparator(order, orderBy))
  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div
      className="p-4 rounded-2xl shadow-sm transition-colors duration-300"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <h3 style={{ fontWeight: 600 }}>{title}</h3>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: colors.accent,
              "&:hover": { backgroundColor: "#4F46E5" },
              textTransform: "none",
            }}
            startIcon={<AddIcon />}
            onClick={handleAddRow}
            size="small"
          >
            Add Row
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#DC2626",
              "&:hover": { backgroundColor: "#B91C1C" },
              textTransform: "none",
            }}
            startIcon={<DeleteIcon />}
            onClick={handleDeleteSelected}
            size="small"
          >
            Delete Selected
          </Button>

          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setOrder(null);
              setOrderBy(null);
              localStorage.removeItem("tableOrder");
              localStorage.removeItem("tableOrderBy");
            }}
            sx={{
              textTransform: "none",
              color: colors.text,
              borderColor: colors.border,
              "&:hover": {
                borderColor: colors.accent,
                color: colors.accent,
              },
            }}
          >
            Clear Sort
          </Button>
        </Stack>
      </Stack>

      {/* Table */}
      <TableContainer
        ref={tableContainerRef}
        component={Paper}
        sx={{
          backgroundColor: colors.surface,
          color: colors.text,
          borderRadius: "12px",
          border: `1px solid ${colors.border}`,
          transition: "all 0.3s ease",
          boxShadow: isDark ? "0 0 10px rgba(0,0,0,0.4)" : "none",
          maxHeight: 400,
          overflowY: "auto",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ color: colors.text }}>
                <Checkbox
                  onChange={handleToggleSelectAll}
                  sx={{
                    color: colors.text,
                    "&.Mui-checked": { color: colors.accent },
                  }}
                />
              </TableCell>

              {["name", "uv", "pv"].map((col) => (
                <TableCell
                  key={col}
                  align={col === "name" ? "left" : "right"}
                  sortDirection={orderBy === col ? order : false}
                  sx={{
                    color: isDark ? "#FFFFFF" : colors.text,
                    fontWeight: isDark ? 700 : 600,
                  }}
                >
                  <TableSortLabel
                    active={orderBy === col}
                    direction={orderBy === col ? order : "asc"}
                    onClick={() => handleRequestSort(col)}
                    sx={{
                      color: isDark ? "#FFFFFF !important" : colors.text,
                      fontWeight: isDark ? 700 : 600,
                      "&.Mui-active": { color: colors.accent },
                      "& svg": {
                        color: isDark ? "#FFFFFF !important" : colors.text,
                      },
                    }}
                  >
                    {col.toUpperCase()}
                  </TableSortLabel>
                </TableCell>
              ))}

              <TableCell align="center" sx={{ color: colors.text }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: colors.muted }}>
                  No rows available
                </TableCell>
              </TableRow>
            ) : (
              visibleRows.map((row) => {
                const isEditing = editingRowId === row.id;
                return (
                  <TableRow
                    key={row.id}
                    sx={{
                      backgroundColor: row.selected
                        ? colors.selected
                        : "transparent",
                      "&:hover": { backgroundColor: colors.hover },
                      transition: "background 0.2s ease",
                    }}
                  >
                    {/* Select */}
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={row.selected}
                        onChange={() => handleToggleSelect(row.id)}
                        sx={{
                          color: colors.text,
                          "&.Mui-checked": { color: colors.accent },
                        }}
                      />
                    </TableCell>

                    {/* Name */}
                    <TableCell sx={{ color: isDark ? "#FFFFFF" : colors.text }}>
                      {isEditing ? (
                        <TextField
                          value={editValues.name}
                          onChange={(e) =>
                            setEditValues({ ...editValues, name: e.target.value })
                          }
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{
                            input: {
                              color: colors.text,
                              backgroundColor: colors.bg,
                            },
                          }}
                        />
                      ) : (
                        row.name
                      )}
                    </TableCell>

                    {/* UV */}
                    <TableCell
                      align="right"
                      sx={{ color: isDark ? "#FFFFFF" : colors.text }}
                    >
                      {isEditing ? (
                        <TextField
                          type="number"
                          value={editValues.uv}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              uv: Number(e.target.value),
                            })
                          }
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{
                            input: {
                              color: colors.text,
                              backgroundColor: colors.bg,
                            },
                          }}
                        />
                      ) : (
                        row.uv
                      )}
                    </TableCell>

                    {/* PV */}
                    <TableCell
                      align="right"
                      sx={{ color: isDark ? "#FFFFFF" : colors.text }}
                    >
                      {isEditing ? (
                        <TextField
                          type="number"
                          value={editValues.pv}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              pv: Number(e.target.value),
                            })
                          }
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{
                            input: {
                              color: colors.text,
                              backgroundColor: colors.bg,
                            },
                          }}
                        />
                      ) : (
                        row.pv
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="center">
                      {isEditing ? (
                        <IconButton color="success" onClick={() => handleSave(row.id)}>
                          <SaveIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          sx={{ color: colors.accent }}
                          onClick={() => handleEdit(row)}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      <IconButton
                        sx={{ color: "#DC2626" }}
                        onClick={() => handleDeleteRow(row.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 50, 100]} 
        sx={{
          color: colors.text,
          borderTop: `1px solid ${colors.border}`,
          '& .MuiTablePagination-selectIcon': {
          color: isDark ? '#FFFFFF' : colors.text,
        },
        '& .MuiSelect-select': {
          color: colors.text,
        },
        '& .MuiTablePagination-actions .MuiIconButton-root': {
          color: isDark ? '#FFFFFF' : colors.text,
          '&:hover': {
            backgroundColor: isDark ? colors.hover : '#f1f5f9',
          },
        },
        }}
      />
    </div>
  );
};

export default TablePanel;
