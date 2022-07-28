import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import useSnackBar from '../../hooks/SnackBarHook';
import { Link } from 'wouter';
import { useEffect, useState } from 'react';
import { Avatar, IconButton, Tooltip, Typography } from '@mui/material';
import { getEvents } from '../../firebase/Firestore/EventsCollection';
import { useLocation } from 'wouter';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import { deleteFirestoreDocument } from '../../firebase/Firestore/utils/DeleteDoc';

const Events = () => {
    const { SnackBarComponent, setSnackBarValue } = useSnackBar();
    const [rows, setRows] = useState<any>([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const [_, setLocation] = useLocation();

    const MatEdit = ({ id }: any) => {
        const handleDeleteClick = () => {
            if (window.confirm(t('Generics.areyousure'))) {

                deleteFirestoreDocument(id, 'events').then(() => {
                    setRefresh(!refresh);
                });
            }
        }

        const handleEditClick = () => {
            setLocation(`/events/edit/${id}`)
        }
        return <>
            <Tooltip title={t('EventPages.deleteEvent')}>
                <IconButton color="error" aria-label={t('EventPages.deleteEvent')} onClick={handleDeleteClick} >
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={t('EventPages.editEvent')}>
                <IconButton aria-label={t('EventPages.editEvent')} onClick={handleEditClick} >
                    <EditIcon />
                </IconButton>
            </Tooltip>
        </>
    };

    const columns: GridColDef[] = [
        {
            field: 'title',
            headerName: t('Generics.name'),
            width: 400,
            editable: false,
            renderCell: ({ row }) => {
                return <Box display={"flex"} >
                    <Avatar src={row.photoURL ? row.photoURL : undefined}>{row.title[0]}</Avatar>
                    <Box marginX={2}>
                        <Typography>{row.title}</Typography>
                        <Typography variant='caption'>{row.date.toLocaleDateString('en')}</Typography>
                    </Box>
                </Box>
            }
        },
        {
            field: 'excerpt',
            headerName: t('Generics.excerpt'),
            width: 220,
            editable: false,
        },
        {
            field: 'language',
            headerName: t('Generics.language'),
            width: 220,
            editable: false,
            renderCell: (params) => {
                return (
                    <div>
                        {t(`Generics.${params.row.language}`)}
                    </div>
                );
            }
        },
        {
            field: "Actions", headerAlign: "center", headerName: t('UsersPage.columnActions'), disableColumnMenu: true, align: "right", hideSortIcons: true, sortable: false, width: 100, renderCell: (params) => {
                return (
                    <div style={{ cursor: "pointer" }}>
                        <MatEdit id={params.row.id} />
                    </div>
                );
            }
        }
    ];

    useEffect(() => {
        setLoading(true);
        getEvents()
            .then(data => {
                setRows(data.docs.map(doc => { const data = doc.data(); return { ...data, date: data.date.toDate(), id: doc.id } }));
                setLoading(false);
            })
    }, [refresh]);

    const toolBar = () => (
        <Box sx={{
            padding: 1
        }}>
            <Link to='/events/new'>
                <Button startIcon={<PersonAddIcon />} variant='contained'>{t('EventPages.addEvent')}</Button>
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

export default Events