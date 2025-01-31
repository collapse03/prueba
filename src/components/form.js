import * as React from 'react';
import { TextField, Grid, Typography, Button } from '@mui/material';
import { Box } from '@mui/system';
import { FormValidator } from './helpers/formValidator';
import { axiosInstance } from './providers/providers';
import { Loading } from './loading';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import {
    Link
  } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import { useHistory, useParams } from 'react-router-dom';

export default function Form() {
    let history = useHistory();
    const [errores, setErrores] = React.useState([]);
    //States para el form
    const [nombreEmpresa, setNombreEmpresa] = React.useState("");
    const [direcPrincipal, setDirecPrincipal] = React.useState("");
    const [direcSegundaria, setDirecSegundaria] = React.useState("");
    const [direcTercera, setDirecTercera] = React.useState("");
    const [nitEmpresa, setNitEmpresa] = React.useState("");
    const [telefonoEmpresa, setTelefonoEmpresa] = React.useState("");
    const [error, setError] = React.useState(false)
    const [errorNumeric, setErrorNumeric] = React.useState(false)
    const [cargando, setCargando] = React.useState(false);
    const [isEdit, setIsEdit] = React.useState(false);
    const { id } = useParams();

    React.useEffect(() => {
        if(id == undefined){
            
        }else{
            setCargando(true)
            axiosInstance.get('detail/'+id)
            .then(json => {
                console.log(json.data)
                let address = json.data.address.replace("#", "/").replace("-", "/").replaceAll(" ","")
                address = address.split('/')
                setDirecPrincipal(address[0])
                setDirecSegundaria(address[1])
                setDirecTercera(address[2])
                setNombreEmpresa(json.data.name)
                setNitEmpresa(json.data.nit)
                setTelefonoEmpresa(json.data.phone.toString())
                setIsEdit(true)
                setCargando(false)
            })
            .catch(e => {
                console.log(e)
            })
        }
    }, []);

    const getError = (llave, errores) => {
        let existe = errores.find(e => e.llave === llave);
        return existe ? existe.mensaje : '';
    }

    const sendDataToApi = async () => {
        let array = await FormValidator([
            { value: nombreEmpresa, name: 'nombreEmpresa', err: { empty: true  } },
            { value: direcPrincipal, name: 'direcPrincipal', err: { empty: true } },
            { value: direcSegundaria, name: 'direcSegundaria', err: { empty: true  } },
            { value: direcTercera, name: 'direcTercera', err: { empty: true } },
            { value: nitEmpresa, name: 'nitEmpresa', err: { empty: true } },
            { value: telefonoEmpresa, name: 'telefonoEmpresa', err: { empty: true } },
        ])
        setErrores(array)
        
        if(!array.length > 0){
            
            if(!isNaN(telefonoEmpresa)){

                setCargando(true)
                let direccion = `${direcPrincipal} # ${direcSegundaria} - ${direcTercera}`
                let url = ""
                if(isEdit){
                    url = `update/${id}`
                    axiosInstance.put(url, {
                        name: nombreEmpresa,
                        address: direccion,
                        nit: nitEmpresa,
                        phone: telefonoEmpresa
                    })
                    .then((res) => {
                        console.log(res);
                        console.log(res.data);
                        setError(false)
                        setCargando(false)
                        history.push("/list")
                    })
                    .catch((e)=>{
                        console.log(e)
                        setError(true)
                        setCargando(false)
                    });
                }else{
                    url = `create/`
                    axiosInstance.post(url, {
                        name: nombreEmpresa,
                        address: direccion,
                        nit: nitEmpresa,
                        phone: telefonoEmpresa
                    })
                    .then((res) => {
                        console.log(res);
                        console.log(res.data);
                        setError(false)
                        setCargando(false)
                        history.push("/list")
                    })
                    .catch((e)=>{
                        console.log(e)
                        setError(true)
                        setCargando(false)
                    });
                }
            }else{
                setErrorNumeric(true)
            }
        }
    }

    return (
        cargando == true ? <Loading />
            :
        <Box sx={{
            height: 'calc(100vh - 64px)',
            display: 'flex',
            alignItems: 'center'
        }}>
            <Grid container direction='column' alignItems='center' justifyContent='center'>
                <Grid item xs={12}>
                    <Typography variant="h3" component="div" sx={{ flexGrow: 1, textAlign: 'center', marginBottom: '25px' }}>
                        Digite la Siguiente Información
                    </Typography>
                </Grid>
                <Box sx={{
                    maxWidth: {
                        xs: '90%',
                        md: '40%'
                    }
                }}>
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} >
                                <TextField 
                                    fullWidth 
                                    label='Nombre de la Empresa'
                                    value={nombreEmpresa}
                                    error = { getError('nombreEmpresa', errores).length > 0}
                                    onChange={(e) => {
                                        setNombreEmpresa(e.target.value)
                                        setErrores(errores.filter(er => er.llave !== "nombreEmpresa"));
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container direction='row' >
                                    <Grid item xs={4}>
                                        <TextField 
                                            fullWidth 
                                            label='Carrera Principal'
                                            value={direcPrincipal}
                                            error = { getError('direcPrincipal', errores).length > 0}
                                            onChange={(e) => {
                                                setDirecPrincipal(e.target.value)
                                                setErrores(errores.filter(er => er.llave !== "direcPrincipal"));
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <Box  
                                            sx={{ 
                                            display: 'flex', 
                                            alignItems:'center', 
                                            justifyContent:'center',
                                            height: '100%'
                                            }}
                                        >#
                                        </Box>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField 
                                            fullWidth 
                                            value={direcSegundaria}
                                            error = { getError('direcSegundaria', errores).length > 0}
                                            onChange={(e) => {
                                                setDirecSegundaria(e.target.value)
                                                setErrores(errores.filter(er => er.llave !== "direcSegundaria"));
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <Box  
                                            sx={{ 
                                            display: 'flex', 
                                            alignItems:'center', 
                                            justifyContent:'center',
                                            height: '100%'
                                            }}
                                        >-
                                        </Box>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField 
                                            fullWidth
                                            value={direcTercera}
                                            error = { getError('direcTercera', errores).length > 0}
                                            onChange={(e) => {
                                                setDirecTercera(e.target.value)
                                                setErrores(errores.filter(er => er.llave !== "direcTercera"));
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                
                            </Grid>
                            <Grid item xs={12} >
                                <TextField 
                                    fullWidth 
                                    label='NIT'
                                    value={nitEmpresa}
                                    error = { getError('nitEmpresa', errores).length > 0}
                                    onChange={(e) => {
                                        setNitEmpresa(e.target.value)
                                        setErrores(errores.filter(er => er.llave !== "nitEmpresa"));
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <TextField 
                                    fullWidth 
                                    label='Telefono'
                                    value={telefonoEmpresa}
                                    error = { getError('telefonoEmpresa', errores).length > 0}
                                    onChange={(e) => {
                                        setTelefonoEmpresa(e.target.value)
                                        setErrores(errores.filter(er => er.llave !== "telefonoEmpresa"));
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <Box 
                                    sx={{ 
                                        display: 'flex', 
                                        alignItems:'center', 
                                        justifyContent:'center'
                                    }}
                                >
                                    <Button variant="contained" onClick={() => sendDataToApi()}>Enviar</Button>
                                    <Link
                                        to={'/list'}
                                    >
                                    <IconButton>
                                        <FormatListBulletedIcon></FormatListBulletedIcon>
                                    </IconButton>
                                    </Link>
                                </Box>
                                {errorNumeric == true ? <div style={{textAlign: 'center'}}>El campo Telefono solo puede set numerico.</div> : ''}
                                
                                {error == true ? <div style={{textAlign: 'center'}}>Error, contacte con el Administrador.</div> : ''}
                            </Grid>
                            
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            
        </Box>
  )
}