import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import useSnackBar from '../../hooks/SnackBarHook';
import { Link } from 'wouter';
import { changeUserStatus, deleteUser, getAllUsers } from '../../firebase/functions';
import { useEffect, useState } from 'react';
import { Avatar, IconButton, Tooltip, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';

const Founders = () => {
    const { SnackBarComponent, setSnackBarValue } = useSnackBar();
    const [rows, setRows] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const MatEdit = ({ uid, status }: any) => {
        const handleDeleteClick = () => {
            if (!window.confirm(t('areyousure'))) {
                return;
            }
            deleteUser({ uid, status: !status })
                .then(() => {
                    setSnackBarValue({ message: "deleted user", severity: "info" }, 2000);
                    setRefresh(!refresh);
                })
                .catch((e) => {
                    setSnackBarValue({ message: "Error with deleting user", severity: "error" }, 2000);
                    console.error(e);
                })
        }

        const handleDisableEnableClick = () => {
            changeUserStatus({ uid, status: !status })
                .then(() => {
                    setSnackBarValue({ message: "Updated user status", severity: "info" }, 2000);
                    setRefresh(!refresh);
                })
                .catch((e) => {
                    setSnackBarValue({ message: "Error with updating user status", severity: "error" }, 2000);
                    console.error(e);
                })
        }
        return <>
            <Tooltip title="Delete User">
                <IconButton color="error" aria-label="Delete Account" onClick={handleDeleteClick} >
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Disable/Enable User Account">
                <IconButton color="warning" aria-label="Disable/Enable Account" onClick={handleDisableEnableClick} >
                    <BlockIcon />
                </IconButton>
            </Tooltip>
        </>
    };

    const columns: GridColDef[] = [
        {
            field: 'displayName',
            headerName: t('UsersPage.columnName'),
            width: 240,
            editable: false,
            renderCell: ({ row }) => {
                return <Box display={"flex"} >
                    <Avatar src={row.photoURL ? row.photoURL : undefined}>{row.displayName[0]}</Avatar>
                    <Box marginX={2}>
                        <Typography>{row.displayName}</Typography>
                        <Typography variant='caption'>{row.email}</Typography>
                    </Box>
                </Box>
            }
        },
        {
            field: 'email',
            headerName: t('UsersPage.columnEmail'),
            width: 220,
            editable: false,
        },
        {
            field: 'roles',
            headerName: t('UsersPage.columnRoles'),
            width: 200,
            editable: false,
            renderCell: ({ row }) => {
                const chips = [];
                for (const key in row.customClaims) {
                    if (row.customClaims[key]) {
                        chips.push(<Chip key={key} variant='filled' label={key} />)
                    }
                }
                return chips;
            }
        },
        {
            field: 'creationTime',
            headerName: t('UsersPage.columnCreatedAt'),
            type: 'date',
            width: 240,
            editable: false,
            renderCell: ({ row }) => row.metadata.creationTime
        },
        {
            field: 'lastSignIn',
            headerName: t('UsersPage.columnLastSignin'),
            type: 'date',
            width: 240,
            editable: false,
            renderCell: ({ row }) => row.metadata.lastSignInTime
        },
        {
            field: "Actions", headerAlign: "center", headerName: t('UsersPage.columnActions'), disableColumnMenu: true, align: "right", hideSortIcons: true, sortable: false, width: 100, renderCell: (params) => {
                return (
                    <div style={{ cursor: "pointer" }}>
                        <MatEdit uid={params.row.uid} status={params.row.disabled} />
                    </div>
                );
            }
        }
    ];



    useEffect(() => {
        setLoading(true);
        getAllUsers()
            .then(({ data }) => {
                const payload: any = data;
                setRows(payload.users);
                setLoading(false);
            })
            .catch(error => {
                setSnackBarValue({ message: error.message, severity: "error" }, 3000);
                setLoading(false);
            })
    }, [refresh])


    const toolBar = () => (
        <Box sx={{
            padding: 1
        }}>
            <Link to='/founders/new'>
                <Button startIcon={<PersonAddIcon />} variant='contained'>{t('UsersPage.addUserButton')}</Button>
            </Link>
        </Box>
    );
    return (
        <Paper sx={{
            height: "85vh",
            border: 'none',
        }}>
            <SnackBarComponent />
            <DataGrid
                sx={{
                    border: "none"
                }}
                rows={rows}
                columns={columns}
                components={{
                    Toolbar: toolBar
                }}
                rowHeight={65}
                pageSize={5}
                getRowId={(row) => row.uid}
                rowsPerPageOptions={[5]}
                loading={loading}
                getRowClassName={(params) => {
                    if (params.row.disabled) {
                        return "opacity-30";
                    }
                    return "";
                }}
                disableSelectionOnClick
            />
        </Paper >
    )
}

export default Founders