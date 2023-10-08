import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Signin from "./Signin";
import Register from "./Register";

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundSize: 'cover',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    button: {
        cursor: 'pointer',
        color: theme.palette.primary.main,
    },
}));

export default function FormAuth() {
    const classes = useStyles();
    const [isRegister, setIsRegister] = useState(false);

    const toggleForm = () => {
        setIsRegister((prevIsRegister) => !prevIsRegister);
    };

    return (
        <Grid container className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} md={7} className={classes.image} />
            <Grid container className={classes.root}>
                <CssBaseline />
                <Grid item xs={false} md={7} className={classes.image} />
                <Grid item xs={12} md={5} component={Paper} elevation={6} square>
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            {isRegister ? "Register" : "Sign in"}
                        </Typography>
                        {isRegister ? <Register /> : <Signin />}
                        <Typography
                            className={classes.button}
                            variant="body2"
                            onClick={toggleForm}
                        >
                            {isRegister
                                ? "Already have an account? Sign in"
                                : "Don't have an account? Register"}
                        </Typography>
                    </div>
                </Grid>
            </Grid>
        </Grid>
    );
}
