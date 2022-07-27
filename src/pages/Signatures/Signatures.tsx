import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import useSnackBar from '../../hooks/SnackBarHook';
import { Link } from 'wouter';
import { useEffect, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { deleteSignature, getSignaturesDocs } from '../../firebase/Firestore/SignaturesCollection';
import deletePhoto from '../../firebase/Storage/deletePhoto';
import DownloadIcon from '@mui/icons-material/Download';
import { decrementSignaturesCount } from '../../firebase/Firestore/SignaturesCountCollection';
const Signatures = () => {
    const { SnackBarComponent, setSnackBarValue } = useSnackBar();
    const [rows, setRows] = useState<any>([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const MatEdit = ({ id, personId }: any) => {
        const handleDeleteClick = () => {
            decrementSignaturesCount()
                .then(() => {
                    return deleteSignature(id)
                })
                .then(() => {
                    return deletePhoto(personId, 'peopleIds');
                })
                .then(() => {
                    setSnackBarValue({ message: "deleted signature", severity: "info" }, 2000);
                    setRefresh(!refresh);
                })
                .catch((e) => {
                    setSnackBarValue({ message: "Error with deleting signature", severity: "error" }, 2000);
                    console.error(e);
                })
        }

        return <>
            <Tooltip title="Delete signature">
                <IconButton color="error" aria-label="Delete Account" onClick={handleDeleteClick} >
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
        </>
    };

    const columns: GridColDef[] = [
        {
            field: 'personId',
            headerName: t('SignaturesPage.columnPersonId'),
            width: 240,
            editable: false,
        },
        {
            field: 'name',
            headerName: t('SignaturesPage.columnName'),
            width: 240,
            editable: false,
        },
        {
            field: 'email',
            headerName: t('SignaturesPage.columnEmail'),
            width: 220,
            editable: false,
        },
        {
            field: 'phonenumber',
            headerName: t('SignaturesPage.columnPhone'),
            width: 200,
            editable: false,
            type: "number"
        },
        {
            field: 'date',
            headerName: t('SignaturesPage.columnCreatedAt'),
            type: 'date',
            width: 240,
            editable: false,
        },
        {
            field: "fileURL", headerAlign: "center", headerName: t('SignaturesPage.columnFileURL'), disableColumnMenu: true, hideSortIcons: true, sortable: false, width: 150, renderCell: params => {
                return (
                    <Button onClick={() => {
                        console.log(params.row.fileURL);
                        const link = document.createElement("a");
                        link.target = "_blank";
                        link.href = params.row.fileURL;
                        link.download = params.row.name;
                        link.click();
                    }} variant="contained" endIcon={<DownloadIcon />}>{t('Download')}</Button>
                );
            }
        },
        {
            field: "Actions", headerAlign: "center", headerName: t('SignaturesPage.columnActions'), disableColumnMenu: true, align: "right", hideSortIcons: true, sortable: false, width: 100, renderCell: params => {
                return (
                    <div style={{ cursor: "pointer" }}>
                        <MatEdit id={params.id} personId={params.row.personId} />
                    </div>
                );
            }
        }
    ];

    useEffect(() => {
        setLoading(true);
        getSignaturesDocs()
            .then((data) => {
                setRows(data.docs.map(doc => { const data = doc.data(); return { ...data, date: data.date.toDate(), id: doc.id } }));
                setLoading(false);
            })
            .catch(error => {
                setSnackBarValue({ message: error.message, severity: "error" }, 3000);
                setLoading(false);
            })
    }, [refresh]);

    const toolBar = () => (
        <Box sx={{
            padding: 1
        }}>
            <Link to='/users/new'>
                <Button startIcon={<PersonAddIcon />} variant='contained'>{t('SignaturesPage.addUserButton')}</Button>
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
                }}
                rowHeight={65}
                pageSize={5}
                rowsPerPageOptions={[5]}
                loading={loading}
            />
        </Paper >
    )
}

export default Signatures;