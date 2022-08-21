import { useTranslation } from 'react-i18next';
import { Box, Button, IconButton, Paper, Stack, Typography } from '@mui/material';
import transitionAllSX from '../../helpers/transitionAllSX';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'wouter';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { getQAs, deleteQA } from '../../firebase/Firestore/QAsCollection';
import { AuthContext } from '../../providers/AuthProvider';
import Masonry from '@mui/lab/Masonry';
import DeleteIcon from '@mui/icons-material/Delete';

const QAS = () => {
    const { t } = useTranslation();
    const [qas, setQAs] = useState<any[]>([]);
    const [_, setLocation] = useLocation();

    useEffect(() => {
        getQAs()
            .then((data) => {
                setQAs(data.docs.map(doc => { const data = doc.data(); return { ...data, date: data.date.toDate(), id: doc.id } }));
            })
    }, [])

    return (
        <>
            {/* START - Search bar */}
            <Stack justifyContent={"space-between"} sx={{ p: '2px 4px', }} direction={"row"}>
                <Link to='/qas/new'>
                    <Button color='primary' startIcon={<AddIcon />} variant='contained'>{t("Generics.add")}</Button>
                </Link>
            </Stack>

            <Masonry sx={{
                marginY: 2
            }} columns={{ sx: 1, sm: 1, md: 2, lg: 3 }} >
                {qas.map((qasItem, index) => (
                    <Paper onClick={() => {
                        setLocation(`/qas/edit/${qasItem.id}`)
                    }} sx={{
                        bgcolor: "background.paper",
                        color: "text.primary",
                        opacity: 0.75,
                        borderRadius: 6,
                        ...transitionAllSX,
                        ":hover": { opacity: 1 },
                        padding: 2.5,
                        display: "flex",
                        flexDirection: "column",
                    }} key={index}>
                        <Typography variant="h4" >{qasItem.q}</Typography>
                        <Typography sx={{
                            marginTop: 3
                        }} variant="body1" >{qasItem.a}</Typography>
                        <Box marginY={2}>
                            <IconButton onClick={() => {
                                // eslint-disable-next-line no-restricted-globals
                                if (confirm(t('Generics.areyousure'))) {
                                    deleteQA(qasItem.id);
                                }
                            }} aria-label="delete" size="large">
                                <DeleteIcon color="error" fontSize='large' />
                            </IconButton>
                        </Box>
                    </Paper>
                ))}
            </Masonry>
        </>
    )
}

export default QAS;

