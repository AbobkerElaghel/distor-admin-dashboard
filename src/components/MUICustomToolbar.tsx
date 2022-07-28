import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarExport } from '@mui/x-data-grid'
import React from 'react'

const MUICustomToolbar = () => {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarDensitySelector />
            <GridToolbarFilterButton />
            <GridToolbarExport csvOptions={{ utf8WithBom: true }} />
        </GridToolbarContainer>
    )
}

export default MUICustomToolbar