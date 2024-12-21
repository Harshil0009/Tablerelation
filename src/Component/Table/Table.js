import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

const GroupedDataTable = () => {
  // State to manage data
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]); // Filtered rows for the DataGrid
  const [loading, setLoading] = useState(true); // Loading state
  const [relationshipFilter, setRelationshipFilter] = useState(""); // Filter state
  const [relationshipOptions, setRelationshipOptions] = useState([]); // Dropdown options

  // Columns definition
  const columns = [
    { field: "SEQ", headerName: "SEQ", width: 150 },
    { field: "SOLVEORDER", headerName: "Solve Order", width: 150 },
    { field: "ID", headerName: "ID", width: 150 },
    { field: "EVDESCRIPTION", headerName: "Description", width: 200 },
    { field: "RELATIONSHIP", headerName: "Relationship", width: 150 },
    { field: "TENANT_ID", headerName: "Tenant ID", width: 150 },
    { field: "END_COSMO", headerName: "End Cosmo", width: 150 },
    { field: "LEASE_NAME", headerName: "Lease Name", width: 200 },
    { field: "INV_TYPE", headerName: "Investment Type", width: 150 },
    { field: "FACILITY_TYPE", headerName: "Facility Type", width: 150 },
    { field: "LEASE_ADMIN_NAME", headerName: "Lease Admin Name", width: 200 },
    { field: "ASSET_MGR_NAME", headerName: "Asset Manager Name", width: 200 },
    { field: "INV_MANAGER_NAME", headerName: "Investment Manager Name", width: 200 },
    { field: "INV_ASSOCIATE_NAME", headerName: "Investment Associate Name", width: 200 },
    { field: "STATE", headerName: "State", width: 100 },
    { field: "DATE_ACQUIRED", headerName: "Date Acquired", width: 150 },
    { field: "DATE_TRANSITIONED", headerName: "Date Transitioned", width: 180 },
    { field: "FORMER_RELATIONSHIP", headerName: "Former Relationship", width: 200 },
  ];

  // Fetch JSON data from Op.json
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/Op.json"); // Fetch from public directory
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        // Ensure each field is either filled with data or empty string
        const formattedData = data.map((item, index) => ({
          id: index, // Add unique id for DataGrid
          SEQ: item.SEQ || "",
          SOLVEORDER: item.SOLVEORDER || "",
          ID: item.ID || "",
          EVDESCRIPTION: item.EVDESCRIPTION || "",
          RELATIONSHIP: item.RELATIONSHIP || "",
          TENANT_ID: item.TENANT_ID || "",
          END_COSMO: item.END_COSMO || "",
          LEASE_NAME: item.LEASE_NAME || "",
          INV_TYPE: item.INV_TYPE || "",
          FACILITY_TYPE: item.FACILITY_TYPE || "",
          LEASE_ADMIN_NAME: item.LEASE_ADMIN_NAME || "",
          ASSET_MGR_NAME: item.ASSET_MGR_NAME || "",
          INV_MANAGER_NAME: item.INV_MANAGER_NAME || "",
          INV_ASSOCIATE_NAME: item.INV_ASSOCIATE_NAME || "",
          STATE: item.STATE || "",
          DATE_ACQUIRED: item.DATE_ACQUIRED || "",
          DATE_TRANSITIONED: item.DATE_TRANSITIONED || "",
          FORMER_RELATIONSHIP: item.FORMER_RELATIONSHIP || "",
        }));

        // Extract unique options for the dropdown
        const uniqueRelationships = [
          ...new Set(formattedData.map((row) => row.RELATIONSHIP).filter((val) => val)),
        ];

        setRows(formattedData);
        setFilteredRows(formattedData); // Initially show all rows
        setRelationshipOptions(uniqueRelationships); // Set dropdown options
        setLoading(false);
      } catch (error) {
        console.error("Error fetching JSON data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle dropdown filter change
  const handleFilterChange = (event) => {
    const value = event.target.value;
    setRelationshipFilter(value);

    // Filter rows based on selected relationship
    if (value) {
      setFilteredRows(rows.filter((row) => row.RELATIONSHIP === value));
    } else {
      setFilteredRows(rows); // Show all rows if no filter
    }
  };

  return (
    <Box style={{ width: "100%" }}>
      {/* Filter Dropdown */}
      <FormControl style={{ minWidth: "200px", marginBottom: "16px" }}>
        <InputLabel id="relationship-filter-label">Filter by Relationship</InputLabel>
        <Select
          labelId="relationship-filter-label"
          value={relationshipFilter}
          onChange={handleFilterChange}
          displayEmpty
        >
          <MenuItem value="">All</MenuItem>
          {relationshipOptions.map((relationship) => (
            <MenuItem key={relationship} value={relationship}>
              {relationship || "Unknown"}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Data Grid */}
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={filteredRows} // Use filtered rows
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          loading={loading} // Show loading spinner
          disableSelectionOnClick
        />
      </div>
    </Box>
  );
};

export default GroupedDataTable;